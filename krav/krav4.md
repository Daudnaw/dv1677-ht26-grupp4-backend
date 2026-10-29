## Krav 4 - Code mode med Monaco

För detta krav har vi implementerat ett kodläge i vår texteditor med hjälp av Monaco Editor och biblioteket `@monaco-editor/react`.

När användaren skapar ett dokument kan man välja om dokumentet ska vara vanlig text eller kod. Om man väljer kod kan man även välja programmeringsspråk, vi har lagt till stöd för JavaScript, Python, JSON, HTML och CSS.

I frontend har vi skapat en separat komponent `CodeEditor.jsx` som använder Monaco. Den har bland annat syntaxfärgning, radnummer och indentering. I `App.jsx` kontrollerar vi dokumenttypen och visar antingen Monaco för kod eller en vanlig textarea för text. Användaren kan även byta dokumenttyp och programmeringsspråk när man redigerar ett befintligt dokument.

I backend har vi lagt till fälten `type` och `language` i `documentModel.js`. När ett dokument skapas eller uppdateras skickas dessa värden från frontend till backend där de sparas i MongoDB. Vi använder JavaScript som standardspråk om inget annat språk har valts.

Vi har även kopplat Monaco till vår realtidsredigering med Socket.IO. Både den vanliga texteditorn och Monaco använder samma funktion för att hantera ändringar. När användaren skriver skickas ändringarna till andra användare via Socket.IO och innehållet autosparas efter en sekund utan nya ändringar.