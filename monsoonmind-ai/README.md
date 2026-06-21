# MonsoonMind AI

Turning uncertain monsoons into confident farming decisions.

MonsoonMind AI is an AI-powered decision intelligence platform for monsoon-sensitive farming. It is not a weather app, crop recommendation app, or generic chatbot. The platform converts real-time weather, forecast, rainfall anomaly, crop calendar, irrigation availability, and farm economics into a personalized SOW or WAIT decision.

## Features

- JWT farmer authentication with register, login, logout, profile, and profile update
- Farm profile management with crop, PIN code/location, land size, irrigation, and expected market price
- AI Sowing Decision Engine with recommendation, confidence, rainfall deficit, sowing window, expected yield, income, and reasons
- Monsoon Scenario Simulator with 0-30 day rain-delay slider, yield, income, risk, and charts
- AI Risk Engine for monsoon health, rain delay, crop risk, water stress, drought risk, and overall score
- Smart Action Plan that turns rainfall signals into practical actions with why
- Financial Impact Calculator comparing sow today against waiting 7 days
- Agriculture-only Gemini copilot with domain guardrails
- What Changed timeline, Explainable AI panel, and Confidence Meter
- Leaflet/OpenStreetMap risk map and Recharts dashboards
- Redis and MongoDB-backed weather/recommendation caching
- Docker Compose deployment wiring

## Tech Stack

Frontend: React, Vite, TailwindCSS, React Router, TanStack Query, Axios, Framer Motion, Leaflet, React Hook Form, Recharts, Lucide Icons.

Backend: Node.js, Express.js, JWT, bcrypt, Mongoose, Redis, Helmet, CORS, Morgan, rate limiting, Joi validation.

Data APIs: OpenWeather, Open-Meteo Forecast, Open-Meteo Geocoding, NASA POWER, OpenStreetMap map tiles, Gemini API.

## Folder Structure

```text
monsoonmind-ai/
  client/
    src/
      api/
      assets/
      components/
      contexts/
      data/
      pages/
  server/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      utils/
  docs/
  .env.example
  docker-compose.yml
  README.md
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment files:

```bash
cp .env.example .env
cp client/.env.example client/.env
```

3. Fill in required values:

```bash
MONGO_URI=
JWT_SECRET=
REDIS_URL=redis://localhost:6379
OPENWEATHER_API_KEY=
GEMINI_API_KEY=
```

Open-Meteo Forecast, Open-Meteo Geocoding, NASA POWER, and OpenStreetMap map tiles work without keys. OpenWeather is used when `OPENWEATHER_API_KEY` is present; otherwise the current-weather fallback is Open-Meteo. Gemini copilot requires `GEMINI_API_KEY`.

4. Run locally:

```bash
npm run dev
```

Client: `http://localhost:5173`

Server: `http://localhost:5000`

## Docker

```bash
docker compose up --build
```

The compose stack starts:

- `client` on port `8080`
- `server` on port `5000`
- `redis` on port `6379`

For production, set NODE_ENV=production, a deployed CLIENT_URL, a real MONGO_URI, and a long random JWT_SECRET.

Use MongoDB Atlas for `MONGO_URI`.

## API Documentation

All protected routes require:

```http
Authorization: Bearer <jwt>
```

### Auth

`POST /api/auth/register`

```json
{
  "name": "Shruti",
  "email": "shruti@example.com",
  "phone": "9999999999",
  "password": "password123"
}
```

`POST /api/auth/login`

```json
{
  "email": "shruti@example.com",
  "password": "password123"
}
```

`GET /api/auth/me`

`PUT /api/auth/me`

`POST /api/auth/logout`

### Farm

`POST /api/farm`

`GET /api/farm`

`PUT /api/farm`

```json
{
  "farmName": "Monsoon Plot",
  "city": "Nagpur",
  "pincode": "440001",
  "state": "Maharashtra",
  "coordinates": {
    "latitude": 21.1458,
    "longitude": 79.0882
  },
  "crop": "soybean",
  "landSize": 5,
  "landUnit": "acre",
  "irrigationAvailable": false,
  "expectedMarketPrice": 4500
}
```

### Weather

`GET /api/weather/current?pincode=440001`

`GET /api/weather/forecast?latitude=21.1458&longitude=79.0882`

`GET /api/weather/historical-rainfall?pincode=440001`

### Decision

`POST /api/recommendation/live`

```json
{
  "city": "Nagpur",
  "pincode": "440001",
  "crop": "soybean",
  "landSize": 5,
  "landUnit": "acre",
  "irrigationAvailable": false,
  "expectedMarketPrice": 4500
}
```

`GET /api/recommendation/history`

### Risk

`POST /api/risk/live`

Accepts the same payload as the live recommendation endpoint and returns risk, confidence, explainability, and rainfall metrics.

### Simulator

`POST /api/simulator/run`

```json
{
  "crop": "soybean",
  "landSize": 5,
  "landUnit": "acre",
  "irrigationAvailable": false,
  "expectedMarketPrice": 4500,
  "rainDelay": 15
}
```

### Copilot

`POST /api/copilot/chat`

```json
{
  "message": "Should I irrigate before sowing soybean this week?"
}
```

The copilot declines non-agriculture and non-monsoon topics.

## Architecture Diagram

```text
React + Vite + Tailwind
        |
        v
Express API + JWT + Validation
        |
        v
Decision Engine
        |
        +--> Weather Service --> OpenWeather / Open-Meteo Forecast + Geocoding / OSM map tiles
        |
        +--> Rainfall Service --> NASA POWER historical rainfall
        |
        +--> Simulator + Financial + Risk Engines
        |
        v
Redis Cache
        |
        v
MongoDB Atlas
```

## Screenshots Placeholder

Add production screenshots after running with API keys:

- `docs/screenshots/landing.png`
- `docs/screenshots/dashboard.png`
- `docs/screenshots/mobile-dashboard.png`

## Future Scope

- Soil moisture API integration
- Crop-specific pest and disease risk signals
- Local-language voice assistant
- Advisory export as PDF
- SMS/WhatsApp alert workflow
- Farm-level satellite NDVI integration
- Region-specific crop calendar configuration

## Notes

The backend does not fabricate weather data. If an external weather API is unavailable, the request returns an error or marks the specific data source unavailable. The decision output is computed only from live/current API data, cached API data, user input, and deterministic agronomic rules.

