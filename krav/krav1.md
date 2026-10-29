## Krav 1 — JWT-autentisering
Den här kraven implementeras i `contollers/userController.js`, `middleware/validateToke.js`, `models/userModel.js`, `routes/userRoutes.js` and `routes.js`.

Verifierar JWT i en middleware som körs före varje skyddad route.
Ea användare får en token när den loggar in för 15 minuter därefter måste usern logga in igen. Det finns endast två routes som inte kräver validateToken `api/users/register` och `api/users/login`. Alla andra routes så som `api/users/current` och alla routes för documents och comments kräver autentisering.

Ett exempel på hur ägarskapet kontrolleras är att när ett dokument skapas då hämtas oweners.id via validateToken och lagras som owner i document som senare används för att hämta documents till just denna owner som då också sker via JWT. 
