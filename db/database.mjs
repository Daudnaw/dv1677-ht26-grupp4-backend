import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';

// Skapa db-mappen om den inte finns
if (!existsSync('./db')) {
    mkdirSync('./db');
}

const dbFilename = process.env.NODE_ENV === 'test'
    ? './db/test.db'
    : './db/docs.db';

const db = new Database(dbFilename);

// Skapa tabell om den inte finns
db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT
    )
`);

//för att lägga in exempeldata i sqlite
//avkommentera och kör servern så läggs tre dokument in med info nedan
const seed = db.transaction(() => {
    db.prepare("DELETE FROM documents").run();
    db.prepare("INSERT INTO documents (title, content) VALUES (?, ?)").run(
        "ett dokument",
        "Det här är innehållet är ett innehåll i ett dokument."
    );
    db.prepare("INSERT INTO documents (title, content) VALUES (?, ?)").run(
        "Handla mat",
        "Kom ihåg att handla mjölk och träskruv."
    );
    db.prepare("INSERT INTO documents (title, content) VALUES (?, ?)").run(
        "Mötesanteckningar",
        "Mötet hölls den 1 september. Närvarande: Sven och ingen alls. Nytt möte varje onsdag 09:00-21:42."
    );
});
seed();

export default db;
