# Architecture

MonsoonMind AI follows a clean MERN split with a domain-focused service layer.

```text
Client
  React pages
  Reusable dashboard widgets
  Auth context
  TanStack Query mutations
  Axios API client

Server
  Routes
  Controllers
  Validation middleware
  Domain services
  Mongoose models
  Redis/Mongo cache

External Data
  OpenStreetMap/Nominatim geocoding
  OpenWeather current weather when API key is configured
  Open-Meteo forecast and current-weather fallback
  NASA POWER historical rainfall
  Gemini agriculture copilot
```

## Decision Flow

```text
Farmer input
  |
  v
Location resolution
  |
  v
Weather bundle
  |
  +--> current weather
  +--> 7-day forecast
  +--> 30-day historical rainfall
  |
  v
Rainfall metrics
  |
  +--> rainfall deficit
  +--> rainfall anomaly
  +--> rolling average
  +--> expected rainfall window
  |
  v
Decision engine
  |
  +--> SOW / WAIT
  +--> confidence
  +--> risk score
  +--> expected yield/income
  +--> action plan
  +--> explainability
```

## Key Backend Services

- `weather.service.js`: OpenWeather, Open-Meteo, NASA POWER, and OpenStreetMap access with caching.
- `rainfall.service.js`: rainfall deficit, anomaly, rolling average, trend, and rainfall window.
- `decisionEngine.service.js`: recommendation, confidence, risk, financial impact, action plan, timeline, and explainability.
- `simulator.service.js`: rain-delay yield, income, and risk curves.
- `copilot.service.js`: agriculture-only Gemini prompt with domain guardrails.

## Data Models

- `User`: farmer identity and hashed password.
- `FarmProfile`: crop, location, land size, irrigation, and market price.
- `Recommendation`: immutable decision history.
- `WeatherCache`: API response cache with TTL index.
- `SimulationHistory`: simulator runs.
- `CopilotHistory`: agriculture copilot conversations.

## Caching

Redis is the first cache layer when `REDIS_URL` is configured. MongoDB `WeatherCache` is the fallback and also uses TTL expiry through `expiresAt`.

Typical cache windows:

- Geocode: 24 hours
- Current weather: 10 minutes
- Forecast: 30 minutes
- NASA historical rainfall: 12 hours

## Security

- Passwords hashed with bcrypt
- JWT auth through Bearer token and optional HTTP-only cookie
- Helmet security headers
- CORS limited by `CLIENT_URL`
- Express rate limiting
- Joi input validation
- Centralized error handling
