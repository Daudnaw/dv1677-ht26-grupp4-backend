## Krav 2 — websocket och realtid
Den här kraven implementeras i backend `contollers/documentController.js`, `db/app.js`, `db/server.js` och i frontend i `src/APP.jsx`.

Vi använder socket.io för att hantera realtidsuppdateringar mellan användare som arbetar med samma dokument. Event som används är
connection: hanterar när en klient ansluter till servern
join: låter klienten gå in i ett rum för specifik dokument
redigera: skickar den nya texten till andra användare i samma rum
document:updated: hanterar uppdatering av hela dokument, titel och content
disconnect: hanterar när en klient kopplas i från
connect och connect_error: hanterar anslutning och anslutningsfel på klienten

Varje dokument har ett eget rum som namnges med dokument_id. Det gör att endast användare i samma rum får varandras realtidsuppdateringar. Den egna klienten uppdaterar sin text direkt medan ändringar skickas till övriga användare.

Vi använder userEffect för att hantera anslutningar och eventlyssnare. När komponenten avmonteras eller token går ut efter 15 minuter då stängs anslutningen med disconnect() och tar bort eventlyssnaren med socket.off(). Vi använder också clearTimeout() så att onödiga autosparingar kan förhindras. 

