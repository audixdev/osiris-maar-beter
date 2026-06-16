# Osiris Student Portal (Proxy + Frontend)

Een kleine Node/Express proxy en frontend die Osiris API's bevraagt en een compacte student-portal frontend serveert.

## Inhoud
- `server/` — Express server die statische bestanden serveert en Osiris API's proxyt.
- `client/` — Single-file frontend (`index.html`) met UI voor dashboard, cijfers, mededelingen en aan-/afwezigheid.

## Vereisten
- Node.js 16+ (of recenter)
- NPM of Yarn

## Configuratie
Maak een bestand `server/.env` (niet commiten) en zet minimaal de volgende variabele:

```
BEARER_TOKEN=your_osiris_bearer_token_here
# (optioneel) PORT=3000
```

- `BEARER_TOKEN` is de autorisatietoken die de server gebruikt om requests naar de Osiris backend te forwarden.
- Als je een andere poort wilt gebruiken kun je `PORT` instellen; standaard gebruikt de server `3000`.

Zorg ervoor dat `server/.env` buiten versiebeheer blijft (staat in `.gitignore`).

## Installatie

1. Clone of haal de repository binnen:

```bash
git clone <repo-url>
cd Osiris
```

2. Installeer dependencies (in de project root als er een `package.json` staat):

```bash
npm install
```

3. Maak `server/.env` aan zoals hierboven.

## Runnen (ontwikkeling)

Start de server in de project root:

```bash
node server/index.js
```

De server serveert de frontend en biedt proxyroutes onder `/api/*`. Open je browser op `http://localhost:3000` (of de poort die je in `PORT` hebt gezet).

Voor productie kun je een process manager zoals `pm2` gebruiken:

```bash
pm2 start server/index.js --name osiris-portal
```

## Hoe werkt het
- De frontend (`client/index.html`) doet fetch-requests naar `/api/*` endpoints. De Express server voegt de vereiste `Authorization: Bearer <token>` header toe en forward de request naar de echte Osiris backend.
- Dit voorkomt CORS-problemen en houdt je token veilig op de server.

## Debugging
- Als je `Onbekend undefined` ziet bij cijfers of mededelingen, controleer dan of de server draait en of `BEARER_TOKEN` correct is.
- Open devtools (Console / Network) om proxied API-calls te inspecteren.

## Veelvoorkomende proxyroutes
- `/api/gebruiker` — haalt gebruiker info op
- `/api/rooster/week` — rooster week
- `/api/resultaten` — resultaten (cijfers)
- `/api/mededelingen` — lijst mededelingen
- `/api/mededelingen/:id` — mededeling detail
- `/api/absentiemeldingen` — afwezigheidsmeldingen
- `/api/afwezigheid/per_dag` — per-dag overzicht (ondersteunt `limit`, `offset`, `typen_waarneming`)
- `/api/afwezigheid/overzicht` — samenvattend overzicht (minuten/uren)

Als je nieuwe endpoints toevoegt, update zowel `server/index.js` als de frontend referenties.

## Toekomstige verbeteringen
- Server-side caching van Osiris responses
- Optionele frontend build pipeline (van single-file naar module-build)
- Tests en CI

---
