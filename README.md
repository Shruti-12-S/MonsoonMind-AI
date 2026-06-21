# MonsoonMind AI

MonsoonMind AI is an AI-powered monsoon decision support platform for farmers. It helps farmers understand whether current rainfall, weather, crop, irrigation, and market conditions support sowing now or waiting for a safer window.

The idea came from a real farming challenge: even near the end of June, rainfall can still be delayed or uncertain. In that situation, a farmer is not only asking "Will it rain?" but also "Should I sow now, wait, arrange labor, use irrigation, or protect input costs?"

MonsoonMind AI turns weather and farm inputs into practical recommendations, risk signals, expected yield and income ranges, map-based location context, and a saved decision history that can later be verified against observed rainfall.

> The application source code is inside [`monsoonmind-ai/`](monsoonmind-ai/).

## Features

- Farmer authentication and profile management
- Farm profile with crop, location, land size, irrigation, and expected market price
- Live sowing recommendation: `SOW` or `WAIT`
- 7-day rainfall forecast and current weather analysis
- Historical rainfall context using NASA POWER
- Rainfall deficit, rainfall trend, and expected rain window
- Crop risk, water stress, drought risk, and monsoon health metrics
- Expected yield and income range estimation
- Action plan for the farmer based on the recommendation
- Scenario simulator for rain-delay impact
- Farm map visualization with Leaflet and OpenStreetMap
- Saved recommendation history
- Outcome verification against observed rainfall
- Calibration readiness tracking after enough verified outcomes
- Agriculture-focused AI copilot using Gemini
- Docker setup for local containerized deployment

## How It Works

1. The farmer enters farm details such as crop, location, land size, irrigation availability, and expected market price.
2. The backend resolves the farm location and collects weather data from external APIs.
3. The system analyzes current weather, 7-day forecast rainfall, historical rainfall, rainfall deficit, temperature, and crop water needs.
4. The decision engine calculates readiness, risk, expected yield, expected income, and action guidance.
5. The app returns a clear `SOW` or `WAIT` recommendation with the reason behind it.
6. Each recommendation is saved.
7. After enough time passes, old recommendations can be verified against observed rainfall to measure real-world accuracy.
8. Once enough verified outcomes are collected, the system becomes ready for true confidence calibration.

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- TanStack Query
- React Hook Form
- React Router
- Recharts
- Leaflet and React Leaflet
- Lucide React icons
- Framer Motion

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- Redis caching
- JWT authentication
- Joi validation
- Helmet, CORS, rate limiting, and centralized error handling

### External Services

- Open-Meteo Forecast API
- Open-Meteo Geocoding API
- NASA POWER rainfall data
- OpenWeather API for PIN-code/current-weather support when configured
- OpenStreetMap map tiles
- Gemini API for the agriculture copilot

### Deployment

- Docker Compose
- Nginx for serving the production React build
- MongoDB Atlas or another MongoDB-compatible database
- Redis for optional cache acceleration

## Repository Structure

```text
.
  monsoonmind-ai/
    client/                 React frontend
      src/
        api/                Axios clients and platform API functions
        components/         Dashboard, layout, and UI components
        contexts/           Auth context
        pages/              Landing, login, register, dashboard, records, profile
    server/                 Express backend
      src/
        config/             Environment, database, and Redis config
        controllers/        Request handlers
        middleware/         Auth, validation, and error middleware
        models/             Mongoose models
        routes/             API routes
        services/           Weather, decision, rainfall, simulator, copilot logic
        utils/              Shared helpers
    docs/                   Architecture and API notes
    docker-compose.yml      Local container orchestration
    package.json            Workspace scripts
```

## Getting Started

### Prerequisites

- Node.js 22 or later
- npm
- MongoDB connection string
- Redis, optional but recommended
- Gemini API key, required for the copilot feature
- OpenWeather API key, optional but recommended for PIN-code based current weather

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <repository-folder>/monsoonmind-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment Files

```bash
cp .env.example .env
cp client/.env.example client/.env
```

### 4. Configure Server Environment

Update `.env`:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/monsoonmind-ai
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d

REDIS_URL=redis://localhost:6379

OPENWEATHER_API_KEY=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash

NASA_POWER_URL=https://power.larc.nasa.gov/api/temporal/daily/point
OPEN_METEO_URL=https://api.open-meteo.com/v1/forecast
OPEN_METEO_GEOCODING_URL=https://geocoding-api.open-meteo.com/v1/search
```

Update `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Run Locally

```bash
npm run dev
```

Local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health check: `http://localhost:5000/health`

## Available Scripts

Run these commands from `monsoonmind-ai/`:

```bash
npm run dev          # Run frontend and backend together
npm run build        # Build frontend for production
npm run start        # Start backend server
npm run lint         # Lint frontend source
npm run install:all  # Install workspace dependencies
npm run docker:up    # Run Docker Compose stack
```

## Docker Setup

Run from `monsoonmind-ai/`:

```bash
docker compose up --build
```

The compose stack starts:

- Client: `http://localhost:8080`
- Server: `http://localhost:5000`
- Redis: `localhost:6379`

The client Docker image builds the React app and serves it through Nginx.

## Production Deployment

For production, set these variables on your hosting platform:

```env
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
MONGO_URI=your-production-mongodb-uri
JWT_SECRET=long-random-secret-at-least-32-characters
JWT_EXPIRES_IN=7d
REDIS_URL=your-production-redis-url
OPENWEATHER_API_KEY=your-openweather-key
GEMINI_API_KEY=your-gemini-key
GEMINI_MODEL=gemini-2.5-flash
```

For the frontend build:

```env
VITE_API_URL=https://your-api-domain.com/api
```

Production safety checks are built into the backend. In production, the API refuses to start if:

- `MONGO_URI` is missing
- `JWT_SECRET` is missing, too short, or still using the development fallback
- `CLIENT_URL` is missing or still points to localhost

## API Overview

Base URL: `/api`

Protected routes use:

```text
Authorization: Bearer <token>
```

Main route groups:

| Area | Routes |
| --- | --- |
| Auth | `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me` |
| Farm | `/api/farm` |
| Weather | `/api/weather/current`, `/api/weather/forecast`, `/api/weather/historical-rainfall`, `/api/weather/geocode` |
| Recommendation | `/api/recommendation/live`, `/api/recommendation/history`, `/api/recommendation/calibration`, `/api/recommendation/verify-pending` |
| Risk | `/api/risk/live` |
| Simulator | `/api/simulator/run` |
| Copilot | `/api/copilot/chat` |

More details are available in [`monsoonmind-ai/docs/API.md`](monsoonmind-ai/docs/API.md).

## Calibration and Accuracy

The app currently shows `signal strength`, not a fully calibrated probability.

Each recommendation is saved and marked for later verification. After the recommendation window passes, the app checks observed rainfall and decides whether the original `SOW` or `WAIT` call matched real rainfall support.

A recommendation is considered correct when:

- `SOW` was recommended and observed rainfall supported sowing, or
- `WAIT` was recommended and observed rainfall did not support sowing

The calibration card tracks verified outcomes and observed accuracy:

```text
observed accuracy = correct verified recommendations / total verified recommendations
```

The system requires at least 500 verified recommendations before it is considered ready for true confidence calibration.

A development-only demo seed feature exists for testing calibration UI. It is hidden in production builds and blocked by the backend when `NODE_ENV=production`.

## Data Sources

- Open-Meteo provides forecast data and current-weather fallback.
- NASA POWER provides historical rainfall data.
- OpenWeather is used when configured, especially for PIN-code based weather lookup.
- OpenStreetMap and Leaflet power the farm map.
- Gemini powers the agriculture copilot.

## Security Notes

- Passwords are hashed with bcrypt.
- Authentication uses JWT bearer tokens and optional HTTP-only cookies.
- Helmet is enabled for security headers.
- CORS is restricted using `CLIENT_URL`.
- Express rate limiting protects API routes.
- Joi validates incoming request payloads.
- Production startup blocks unsafe secrets and localhost frontend URLs.
- `.env` files are ignored by Git and should never be committed.

## Current Status

MonsoonMind AI is ready for staging deployment. For real-world farmer use, it still needs:

- More verified outcome data across different regions and crops
- Agronomist review of thresholds and recommendations
- Monitoring, logging, and alerting in production
- A production calibration model after enough verified outcomes
- Field testing with real users before relying on recommendations operationally

## Important Disclaimer

MonsoonMind AI is a decision support tool. It should not replace local agricultural expertise, field inspection, government advisories, or professional agronomy guidance. Weather forecasts and agricultural estimates can be uncertain, so farmers should use the recommendation as one input in a broader decision-making process.

## Documentation

- [`monsoonmind-ai/docs/ARCHITECTURE.md`](monsoonmind-ai/docs/ARCHITECTURE.md)
- [`monsoonmind-ai/docs/API.md`](monsoonmind-ai/docs/API.md)

## Engineered by Shruti Shinde 
Built to apply what I learn to real-world problems and turn ideas into practical tools.
