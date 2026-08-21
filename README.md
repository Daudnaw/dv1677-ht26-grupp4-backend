# SSR Editor HT26

Starter-repo för DV1677 JavaScript-baserade webbramverk HT26.

ett exempel som är en server-renderad texteditor byggd med Express och SQLite. Under kursens gång byggs den om/refaktoreras.

## Kom igång


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

Öppna sedan `http://localhost:3000`

## env-variabler

`PORT` - porten som Express lyssnar på -> `3000`

## Teknikstack

- [node](https://nodejs.org)
- [Express](https://expressjs.com)
- [SQLite](https://www.sqlite.org) (byts ut mot MongoDB)
- [EJS](https://ejs.co) (byts ut mot frontend-ramverk)
