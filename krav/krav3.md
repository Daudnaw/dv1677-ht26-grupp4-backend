## Krav 3 - kommentarer
Den här kraven implementeras i backend `contollers/commentController.js`, `models/commentModeljs`, `routes/commentRoutes.js` och i frontend i `src/APP.jsx`.

Kommentarer kopplas ihop med ett specifikt dokument via en referens till Document mha. documentId och den binds ihop även med ägaren som skapar en kommentar via userId. Vi sparar radnummer där kommentaren hör hemma och själva kommentartexten. 

När en kommentar skapas sparas den först i databasen via comment.create(). Därefter skickar backend eventet comment:created till dokumentets socket.io rum. När en kommentar tas bort skickas eventet comment:deleted istället. På frontend lyssnar vi på dessa events och uppdaterar kommentarlistan direkt med setComments(). Vi kontrollerar om användaren har behörighet att komma åt dokument när en kommentar skapas och endast den användare som har skapat kommentarer kan ta bort den.

Kortsagt återanvänds samma socket som skapades för krav2 här så att när en kommentar skapas eller tas bort då uppdateras det för alla i samma dokument i realtid. 

En begränsning är att kommentarer kopplas till ett radnummer istället för en specifik textposition eller kodrad. Om dokumentet redigeras och rader läggs till eller tas bort då blir radnummer felaktigt för tidigare kommentarer. Det är något som inte kunde förbättras nu pga. tidsbrist men skulle kunna förbättras genom att koppla ihop kommentar till ett textstycke eller en unikmarkör så att kommentaren kan följa med när förändringar sker i kommentarens dokument.
