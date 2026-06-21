# API Reference

Base URL: `/api`

Use `Authorization: Bearer <token>` for protected routes.

## Auth

| Method | Route | Description |
| --- | --- | --- |
| POST | `/auth/register` | Create farmer account |
| POST | `/auth/login` | Login and receive JWT |
| POST | `/auth/logout` | Clear cookie session |
| GET | `/auth/me` | Current user |
| PUT | `/auth/me` | Update profile |

## Farm

| Method | Route | Description |
| --- | --- | --- |
| POST | `/farm` | Create or replace farm profile |
| GET | `/farm` | Get current farm profile |
| PUT | `/farm` | Update farm profile |

## Weather

| Method | Route | Description |
| --- | --- | --- |
| GET | `/weather/current` | Current weather |
| GET | `/weather/forecast` | 7-day forecast |
| GET | `/weather/historical-rainfall` | NASA POWER rainfall history |
| GET | `/weather/geocode` | Resolve city to coordinates |

All weather routes accept either `city` or `latitude` and `longitude`.

## Decision

| Method | Route | Description |
| --- | --- | --- |
| POST | `/recommendation/live` | Run live AI sowing decision |
| GET | `/recommendation/history` | Latest recommendation history |

## Risk

| Method | Route | Description |
| --- | --- | --- |
| POST | `/risk/live` | Run live AI risk engine |

## Simulator

| Method | Route | Description |
| --- | --- | --- |
| POST | `/simulator/run` | Run rain-delay scenario simulator |

## Copilot

| Method | Route | Description |
| --- | --- | --- |
| POST | `/copilot/chat` | Agriculture-only Gemini copilot |
