# SSR Editor HT26

Starter-repo för DV1677 JavaScript-baserade webbramverk HT26.

ett exempel som är en server-renderad texteditor byggd med Express och SQLite. Under kursens gång byggs den om/refaktoreras.

## Krav

> **OBS: Kräver Node.js 22.23 eller högre.**
> `better-sqlite3` använder nativa binärer kompilerade för en specifik Node-version — äldre 22.x (t.ex. 22.11) ger `Segmentation fault` vid start.
>
> Uppgradera med nvm:
> ```bash
> nvm install 22.23
> nvm use 22.23
> ```

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
