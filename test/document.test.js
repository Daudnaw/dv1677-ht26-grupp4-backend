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

const owner = {
  email: 'owner@example.com',
  password: 'Test123'
};

const other = {
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

async function createTestDocument(token, data = {}) {
  return request(app)
    .post('/api/documents')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Test document',
      content: 'Initial content',
      type: 'text',
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
  otherToken = await registerAndLogin(other);

  // Create a document owned by the first user(0wner)
  const response = await createTestDocument(ownerToken);

  expect(response.status).toBe(201);
  documentId = response.body._id;
});

afterAll(async () => {
  await closeDB();
  await mongod?.stop();
});

describe('Documents API', () => {
  describe('POST /api/documents', () => {
    it('creates a document when authenticated', async () => {
      const res = await createTestDocument(ownerToken, {
        title: 'A new document',
        content: 'Hello world',
        type: 'text'
      });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('A new document');
      expect(res.body.content).toBe('Hello world');
      expect(res.body.type).toBe('text');
      expect(res.body.owners).toContain(
        res.body.owners[0]
      );
      expect(res.body._id).toBeTruthy();
    });

    it('rejects requests without a token', async () => {
      const res = await request(app)
        .post('/api/documents')
        .send({
          title: 'Unauthorized document',
          type: 'text'
        });

      expect(res.status).toBe(401);
    });

    it('rejects a document without required felds', async () => {
      const res = await request(app)
        .post('/api/documents')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          content: 'Missing title and type'
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/documents', () => {
    it('returns documents belonging to the authenticated user', async () => {
      const res = await request(app)
        .get('/api/documents')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);

      expect(
        res.body.some((doc) => doc._id === documentId)
      ).toBe(true);
    });

    it('returns an empty array for a user without documents', async () => {
      const res = await request(app)
        .get('/api/documents')
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('rejects requests without token', async () => {
      const res = await request(app)
        .get('/api/documents');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/documents/:id', () => {
    it('returns a document owned by the user', async () => {
      const res = await request(app)
        .get(`/api/documents/${documentId}`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(res.status).toBe(200);
      expect(res.body._id).toBe(documentId);
      expect(res.body.title).toBe('Test document');
    });

    it('rejects access by a different user', async () => {
      const res = await request(app)
        .get(`/api/documents/${documentId}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.status).toBe(403);
    });

    it('returns 404 for nonexistent document', async () => {
      const nonexistentId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .get(`/api/documents/${nonexistentId}`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/documents/:id', () => {
    it('updates a document owned by the user', async () => {
      const res = await request(app)
        .put(`/api/documents/${documentId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          title: 'Updated title',
          content: 'Updated content'
        });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated title');
      expect(res.body.content).toBe('Updated content');
    });

    it('rejects updates by a different user', async () => {
      const res = await request(app)
        .put(`/api/documents/${documentId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          title: 'Unauthorized update'
        });

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/documents/:id/share', () => {
    it('shares a document with another registered user', async () => {
      const res = await request(app)
        .post(`/api/documents/${documentId}/share`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          email: other.email
        });

      expect(res.status).toBe(200);
      expect(res.body.owners).toHaveLength(2);
      expect(
        res.body.owners.map((id) => id.toString())
      ).toContain(
        res.body.owners[1].toString()
      );
    });

    it('rejects sharing without an email', async () => {
      const doc = await createTestDocument(ownerToken);

      const res = await request(app)
        .post(`/api/documents/${doc.body._id}/share`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('rejects sharing by a user who is not an owner', async () => {
      const doc = await createTestDocument(ownerToken);

      const res = await request(app)
        .post(`/api/documents/${doc.body._id}/share`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          email: other.email
        });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/documents/:id', () => {
    it('rejects deletion by a different user', async () => {
      const doc = await createTestDocument(ownerToken);

      const res = await request(app)
        .delete(`/api/documents/${doc.body._id}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.status).toBe(403);
    });

    it('deletes a document owned by the user', async () => {
      const doc = await createTestDocument(ownerToken);

      const res = await request(app)
        .delete(`/api/documents/${doc.body._id}`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Document and its comments deleted');

      const getRes = await request(app)
        .get(`/api/documents/${doc.body._id}`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(getRes.status).toBe(404);
    });
  });
});