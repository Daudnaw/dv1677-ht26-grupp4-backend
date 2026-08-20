# SSR Editor HT26

Startprojekt för kursen [DV1677 JavaScript-baserade webbramverk](https://jsramverk.se) vid Blekinge Tekniska Högskola.

Applikationen är en server-renderad texteditor byggd med Express och SQLite. Under kursens gång byggs den om till ett JSON-API med MongoDB som databas, och en fristående React-frontend skapas i ett separat repo.

## Kom igång

Installera beroenden:

```bash
npm install
```

Skapa en `.env`-fil utifrån exemplet:

```bash
cp .env.example .env
```

Starta applikationen:

```bash
npm start
```

Öppna sedan `http://localhost:3000` i webbläsaren.

## Miljövariabler

| Variabel | Beskrivning | Exempel |
|----------|-------------|---------|
| `PORT` | Porten som Express lyssnar på | `3000` |

## Teknikstack

- [Node.js](https://nodejs.org)
- [Express](https://expressjs.com)
- [SQLite](https://www.sqlite.org) (byts ut mot MongoDB i vecka 2)
- [EJS](https://ejs.co) (byts ut mot React-frontend i vecka 3)
