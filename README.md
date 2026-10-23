# DV1677 HT26 Grupp 4 - Backend

Backend för grupp 4:s projekt i kursen DV1677 JavaScript-baserade webbramverk.

Projektet är ett JSON-API byggt med Express och MongoDB. API:t används av gruppens separata React-frontend för att hämta, skapa, uppdatera och ta bort dokument.

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
```

`MONGODB_URI` ska ersättas med URI:n till den MongoDB-instans som ska användas.

Starta backend:

```bash
npm start
```

Servern körs som standard på port 3000.

## API

Backenden tillhandahåller ett JSON-API för dokument och innehåller routes för att hämta, skapa, uppdatera och ta bort dokument.

## Tester

Tester körs med:

```bash
npm test
```

Testerna använder Vitest som testramverk och Supertest för att skicka HTTP-anrop till Express-applikationen.

MongoDB Memory Server används för att skapa en separat tillfällig MongoDB-databas under testerna. Testerna påverkar därför inte den vanliga databasen.

Testsviten testar:

- GET `/api/documents` - hämtar dokument
- POST `/api/documents` - skapar ett dokument
- GET `/api/documents` - verifierar att det skapade dokumentet finns
- PUT `/api/documents/:id` - uppdaterar ett dokument
- DELETE `/api/delete/:id` - tar bort ett dokument

Testerna kontrollerar bland annat HTTP-statuskoder, JSON-svar och att dokumentens data är korrekt.

## Deployment

Backenden containeriseras med Docker och driftsätts till gruppens VPS med GitHub Actions.

Den driftsatta backenden används av React-frontenden via JSON-API:t.