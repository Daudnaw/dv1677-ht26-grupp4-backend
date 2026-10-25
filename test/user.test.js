import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import connectDB, { closeDB } from '../db/database.js';

let mongod;
let app;
let accessToken;

const testUser = {
  email: 'test@example.com',
  password: 'Test123!'
};

beforeAll(async () => {
  process.env.COLLECTION_NAME = 'documents';

  process.env.ACCESS_TOKEN_SECRET = 'test-secret-for-jwt';

  mongod = await MongoMemoryServer.create();

  process.env.MONGODB_URI = mongod.getUri();
  process.env.DATABASE_NAME = 'jsramverk_test';

  // Import the app after configuring the test environment.
  const module = await import('../db/app.js');
  app = module.default;

  // Connect to the test database.
  await connectDB();

  // Register the user using the actual API.
  const registerResponse = await request(app)
    .post('/api/users/register')
    .send(testUser);

  expect(registerResponse.status).toBe(201);

  // Log in to get a real JWT.
  const loginResponse = await request(app)
    .post('/api/users/login')
    .send(testUser);

  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body.accessToken).toBeTruthy();

  accessToken = loginResponse.body.accessToken;
});

afterAll(async () => {
  await closeDB();
  await mongod?.stop();
});

describe('User authentication', () => {
  describe('GET /api/users/current', () => {
    it('returns the curent user when authenticated', async () => {
      const res = await request(app)
        .get('/api/users/current')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        email: testUser.email
      });
      expect(res.body.id ?? res.body._id).toBeTruthy();
    });

    it('rejects a request without a token', async () => {
      const res = await request(app)
        .get('/api/users/current');

      expect(res.status).toBe(401);
    });

    it('rejects an invalid token', async () => {
      const res = await request(app)
        .get('/api/users/current')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
    });
  });
});