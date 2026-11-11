import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import connectDB, { closeDB } from '../db/database.js';

const notifieraMock = vi.hoisted(() => vi.fn());

vi.mock('../services/notify.js', () => ({
  default: notifieraMock
}));

let mongod;
let app;
let ownerToken;
let documentId;

const owner = {
  email: 'owner@example.com',
  password: 'Test123'
};

async function registerAndLogin(user) {
  await request(app)
    .post('/api/users/register')
    .send(user)
    .expect(201);

  const response = await request(app)
    .post('/api/users/login')
    .send(user)
    .expect(200);

  return response.body.accessToken;
}

beforeAll(async () => {
  process.env.ACCESS_TOKEN_SECRET = 'test-secret-for-jwt';
  process.env.COLLECTION_NAME = 'documents';

  mongod = await MongoMemoryServer.create();

  process.env.MONGODB_URI = mongod.getUri();
  process.env.DATABASE_NAME = 'jsramverk_test';

  const module = await import('../db/app.js');
  app = module.default;

  const db = await connectDB();

  ownerToken = await registerAndLogin(owner);

  const response = await request(app)
    .post('/api/documents')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({
      title: 'Testdokument',
      content: 'this is test document',
      type: 'text'
    })
    .expect(201);

  documentId = response.body._id;
});

afterAll(async () => {
  await closeDB();
  await mongod?.stop();
});

describe('POST /api/comments', () => {
  it('notifierar när en kommentar skapas', async () => {
    notifieraMock.mockClear();

    const response = await request(app)
      .post(`/api/comments`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        documentId,
        lineNumber: 5,
        text: 'This is a new comment'
      })
      .expect(201);

    expect(response.body.text).toBe('This is a new comment');

    expect(notifieraMock).toHaveBeenCalledOnce();

    expect(notifieraMock).toHaveBeenCalledWith(
      `💬 Comment on "Testdokument" at line 5 has been created.`
    );
  });
});
