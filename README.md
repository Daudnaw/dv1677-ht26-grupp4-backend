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

## Att göra
Namn på alla gruppmedlemmar (för- och efternamn + GitHub-användarnamn)
Projektval: vilket startrepo ni valt och en kort motivering
Teknikval: vilket frontend-ramverk ni planerar och varför

Tillvägagångssätt: Vi fick några vulnerabvulnerabilities när vi körde npm install. npm audit rapport avslöjade flera vulnerabilities och de flesta av dem kunde fixats med npm audit fix. Tre av dem kunde inte fixas med fix men genom att uppdatera qs kunde vi fixa resterande 3 vulnerabilities också. Nu har vi 0 vulnerabilities.

Instruktioner för att köra appen lokalt (npm install && npm start)
behöver vi skriva något här, det är ju redan nämnt ovan.