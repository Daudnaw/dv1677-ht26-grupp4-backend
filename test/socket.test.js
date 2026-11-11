import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { io as Client } from 'socket.io-client';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { closeDB } from '../db/database.js';

let mongod;
let server;
let a;
let b;

beforeAll(async () => {
  process.env.ACCESS_TOKEN_SECRET = 'test-secret-for-jwt';

  // egentligen behövs inte men app.js startar db automatiskt och för att undvika undefined
  mongod = await MongoMemoryServer.create();

  process.env.MONGODB_URI = mongod.getUri();
  process.env.DATABASE_NAME = 'jsramverk_test';
  process.env.PORT = '0';

  const module = await import('../db/server.js');
  server = module.default;

  // vi gör ett krångligare sätt här eftersom server startas automatiskt av server.js
  if (!server.listening) {
    await new Promise((resolve, reject) => {
      server.once('listening', resolve);
      server.once('error', reject);
    });
  }
});

afterAll(async () => {
  a?.disconnect();
  b?.disconnect();

  // stäng servern efter varje test
  if (server?.listening) {
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  await closeDB();
  await mongod?.stop();
});

describe('Socket-IO', () => {
  it('skickar uppdatering till andra i rummet', async () => {
    const port = server.address().port;

    a = Client(`http://localhost:${port}`);
    b = Client(`http://localhost:${port}`);

    await Promise.all([
      new Promise((resolve, reject) => {
        a.once('connect', resolve);
        a.once('connect_error', reject);
      }),
      new Promise((resolve, reject) => {
        b.once('connect', resolve);
        b.once('connect_error', reject);
      })
    ]);

    // kort funktion for att skicka client i rummet
    const joinRoom = (client) =>
      new Promise((resolve) => {
        client.emit('join', '1');

        setTimeout(resolve, 100);
      });
    
    // Skicka in både clients 
    await Promise.all([joinRoom(a), joinRoom(b)]);

    const mottaget = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Ingen uppdatering mottogs inom 2 sekunder'));
      }, 2000);

      // fångar in uppdatering
      b.once('uppdatering', (text) => {
        clearTimeout(timeout);
        resolve(text);
      });
    });

    // skickar iväg uppdaterng som fångas in av b via mottaget
    a.emit('redigera', { doc: '1', text: 'i am in crisis' });

    expect(await mottaget).toBe('i am in crisis');
  });
});
