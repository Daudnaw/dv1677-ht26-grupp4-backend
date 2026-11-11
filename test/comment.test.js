import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import connectDB, { closeDB } from '../db/database.js';
import mongoose from 'mongoose';

let mongod;
let app;
let ownerToken;
let otherToken;
let documentId;
let commentId;

const owner = {
  email: 'owner@example.com',
  password: 'Test123'
};

const otherUser = {
  email: 'other@example.com',
  password: 'Test123'
};

async function registerAndLogin(user) {
  const registerResponse = await request(app)
    .post('/api/users/register')
    .send(user);

  expect(registerResponse.status).toBe(201);

  const loginResponse = await request(app)
    .post('/api/users/login')
    .send(user);

  expect(loginResponse.status).toBe(200);

  return loginResponse.body.accessToken;
}

async function createDocument(token) {
  return request(app)
    .post('/api/documents')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Comment test document',
      content: 'Line one\nLine two\nLine three',
      type: 'text'
    });
}

async function createComment(token, id = documentId, data = {}) {
  return request(app)
    .post('/api/comments')
    .set('Authorization', `Bearer ${token}`)
    .send({
      documentId: id,
      lineNumber: 1,
      text: 'Test comment',
      ...data
    });
}

beforeAll(async () => {
  process.env.ACCESS_TOKEN_SECRET = 'test-secret-for-jwt';

  mongod = await MongoMemoryServer.create();

  process.env.MONGODB_URI = mongod.getUri();
  process.env.DATABASE_NAME = 'jsramverk_test';

  // Import the app after setup test
  const module = await import('../db/app.js');
  app = module.default;

  await connectDB();

  ownerToken = await registerAndLogin(owner);
  otherToken = await registerAndLogin(otherUser);

  const documentResponse = await createDocument(ownerToken);

  expect(documentResponse.status).toBe(201);
  documentId = documentResponse.body._id;

  const commentResponse = await createComment(ownerToken);

  expect(commentResponse.status).toBe(201);
  commentId = commentResponse.body._id;
});

afterAll(async () => {
  await closeDB();
  await mongod?.stop();
});

describe('Comments API', () => {
  describe('POST /api/comments', () => {
    it('creates a comment when authenticated', async () => {
      const res = await createComment(ownerToken, documentId, {
        lineNumber: 2,
        text: 'Another comment'
      });

      expect(res.status).toBe(201);
      expect(res.body.text).toBe('Another comment');
      expect(res.body.lineNumber).toBe(2);
      expect(res.body.documentId.toString()).toBe(documentId);
      expect(res.body.userId).toBeTruthy();
      expect(res.body._id).toBeTruthy();
    });

    it('rejects a request withouta token', async () => {
      const res = await request(app)
        .post('/api/comments')
        .send({
          documentId,
          lineNumber: 1,
          text: 'Unauthorized comment'
        });

      expect(res.status).toBe(401);
    });

    it('rejects missing required fields', async () => {
      const res = await request(app)
        .post('/api/comments')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          documentId,
          text: 'Missing line number'
        });

      expect(res.status).toBe(400);
    });

    it('returns 404 if the document not exist', async () => {
      const nonexistentId = new mongoose.Types.ObjectId();

      const res = await createComment(ownerToken, nonexistentId.toString());

      expect(res.status).toBe(404);
    });

    it('rejects a user who does not own the document', async () => {
      const res = await createComment(otherToken);

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/comments/:documentId', () => {
    it('returns comments for an owned document', async () => {
      const res = await request(app)
        .get(`/api/comments/${documentId}`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(
        res.body.some((comment) => comment._id === commentId)
      ).toBe(true);
    });

    it('rejects a request without a token', async () => {
      const res = await request(app)
        .get(`/api/comments/${documentId}`);

      expect(res.status).toBe(401);
    });

    it('returns 404 if the document does not exist', async () => {
      const nonexistentId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .get(`/api/comments/${nonexistentId}`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(res.status).toBe(404);
    });

    it('rejects a user who does not own the document', async () => {
      const res = await request(app)
        .get(`/api/comments/${documentId}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('PUT /api/comments/:id', () => {
    it('updates a comment created by the user', async () => {
      const res = await request(app)
        .put(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          text: 'Updated comment',
          lineNumber: 3
        });

      expect(res.status).toBe(200);
      expect(res.body.text).toBe('Updated comment');
      expect(res.body.lineNumber).toBe(3);
    });

    it('rejects a request without a token', async () => {
      const res = await request(app)
        .put(`/api/comments/${commentId}`)
        .send({ text: 'Unauthorized update' });

      expect(res.status).toBe(401);
    });

    it('returns 404 if the comment does not exist', async () => {
      const nonexistentId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .put(`/api/comments/${nonexistentId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ text: 'Updated comment' });

      expect(res.status).toBe(404);
    });

    it('rejects updates by a different user', async () => {
      const res = await request(app)
        .put(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ text: 'Unauthorized update' });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/comments/:id', () => {
    it('rejects a request without a ttoken', async () => {
      const res = await request(app)
        .delete(`/api/comments/${commentId}`);

      expect(res.status).toBe(401);
    });

    it('returns 404 if the comment does not exist', async () => {
      const nonexistentId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`/api/comments/${nonexistentId}`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(res.status).toBe(404);
    });

    it('rejects deletion by a different user', async () => {
      const res = await request(app)
        .delete(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.status).toBe(403);
    });

    it('deletes a comment created by the user', async () => {
      const created = await createComment(ownerToken);

      expect(created.status).toBe(201);

      const res = await request(app)
        .delete(`/api/comments/${created.body._id}`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Comment deleted');

      const getRes = await request(app)
        .get(`/api/comments/${documentId}`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(getRes.status).toBe(200);
      expect(
        getRes.body.some(
          (comment) => comment._id === created.body._id
        )
      ).toBe(false);
    });
  });
});
