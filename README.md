# DV1677 HT26 Grupp 4 - Backend

Backend för grupp 4:s projekt i kursen DV1677 JavaScript-baserade webbramverk.

Projektet är ett JSON-API byggt med Express och MongoDB. API:ar används av gruppens separata React-frontend för att skapa och hantera TEXT-EDITOR.

## Gruppmedlemmar

- Hussein Sabte - GitHub: ZEZZ3
- Daud Nawaz - GitHub: Daudnaw

## Teknik

- Node.js
- Express
- MongoDB
- Vitest
- Supertest
- MongoDB Memory Server
- Docker
- GitHub Actions
- Webbsocket-IO

## GitHub-secrets

Följande GitHub-secrets behövs.

- ACCESS_TOKEN_SECRET
- DISCORD_WEBHOOK_URL
- MONGODB_URI
- VPS_HOST
- VPS_SSH_KEY
- VPS_USER

## Driftsatt applikation

Frontend (GitHub Pages):

https://ZEZZ3.github.io/dv1677-ht26-grupp4-frontend/

Backend API:

https://dv1677-crusher.nplab.bth.se/api/documents

## Krav

Projektet kräver Node.js 22.23 eller högre.

## Köra projektet lokalt

Installera dependencies:

```bash
npm install
```

Skapa en `.env`-fil utifrån `.env.example`:

```bash
cp .env.example .env
```

Fyll i miljövariablerna:

```env
PORT=3000
MONGODB_URI=<your-mongodb-uri>
DATABASE_NAME=jsramverk
COLLECTION_NAME=documents
ACCESS_TOKEN_SECRET=yoursecretkey
DISCORD_WEBHOOK_URL=getthehookfromdiscor
```

`MONGODB_URI` ska ersättas med URI:n till den MongoDB-instans som ska användas.

Starta backend:

```bash
npm start
```

Servern körs som standard på port 3000.

## API

Backenden tillhandahåller JSON-API för dokument, comments och users routes. Vilka routes som existerar totalt kan du se längre ner under rubrik test.

## Database
Projektet använder MongoDB Atlas, en molnbaserad NoSQL-databas.

För att köra projektet behöver du skapa ett konto på MongoDB Atlas, skapa ett kluster och lägga till din anslutningssträng i filen .env:

```bash
MONGODB_URI=ERSÄTT_HÄR
```

### Models

| Collection | Fields |
|--- | --- |
| `users` | `email`, `password`, `role`, `createdAt`, `updateAt` |
| `documents` | `title`, `content`, `type`, `language`, `owners` (`userId[]`), `createdAt`, `updateAt` |
| `comments` | `documentId`, `userId`, `lineNumber`, `text`, `createdAt` |

## Tester

Tester körs med:

```bash
npm test
```

Testerna använder Vitest som testramverk och Supertest för att skicka HTTP-anrop till Express-applikationen.

MongoDB Memory Server används för att skapa en separat tillfällig MongoDB-databas under testerna. Testerna påverkar därför inte den vanliga databasen.

Testsviten testar:

- POST `api/users/register`
- POST `api/users/login`
- GET `api/users/current`

- POST `api/documents` Create a document
- GET `api/documents` Get all documents for a user
- GET `api/documents/:id` Get a specifik document by id
- PUT `api/documents/:id` Update a document
- POST `api/documents/:id/share` Share a document with another user
- DELETE `api/documents/:id` Delete a document

- POST `api/comments` Add a comment
- GET `api/documents/:documentId` Get comments for a specific document
- PUT `api/documents/:id` Update a document
- DELETE `api/documents/:id` Delete a document

- Notification function which notifies to the discord server when some updates happens also is tested. 
- Webbsocket_IO testas också.


## Deployment

Backenden containeriseras med Docker och driftsätts till gruppens VPS med GitHub Actions.

Den driftsatta backenden används av React-frontenden via JSON-API:t.