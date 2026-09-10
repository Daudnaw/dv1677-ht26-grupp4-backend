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


## Gruppmedlemmar

- Hussein Sabte - GitHub: ZEZZ3
- Daud Nawaz - GitHub: Daudnaw

## Projektval

Vi har valt att arbeta med **Text Editor / SSR Editor** och utgår från
startrepot `ssr-editor-ht26`.

Vi valde Text Editor eftersom vi tycker att projektet passar bra för kursen
och ger oss möjlighet att arbeta med både backend och frontend.

## Teknikval

Vi planerar att använda **React** som frontend-ramverk.

Vi valde React eftersom det är ett vanligt ramverk som används mycket i
praktiken. Det finns också mycket dokumentation, guider och exempel, vilket
gör det lättare att hitta hjälp när vi stöter på problem.

## Tillvägagångssätt

Vi fick några vulnerabilities när vi körde npm install. npm audit
rapporterade flera vulnerabilities och de flesta av dem kunde fixas med
npm audit fix. Tre av dem kunde inte fixas med npm audit fix, men genom
att uppdatera qs kunde vi fixa de resterande tre också. Nu har vi
0 vulnerabilities.

Vi har även verifierat att det går att både skapa nya dokument och uppdatera
befintliga dokument. Vid uppdatering ändras det befintliga dokumentet istället
för att ett nytt dokument skapas.