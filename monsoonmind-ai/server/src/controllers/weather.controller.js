import {
  getCoordinates,
  getCurrentWeather,
  getForecast,
  getHistoricalRainfall
} from "../services/weather.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const parseLocation = (query) => ({
  city: query.city,
  district: query.district,
  state: query.state,
  pincode: query.pincode,
  latitude: query.latitude !== undefined ? Number(query.latitude) : undefined,
  longitude: query.longitude !== undefined ? Number(query.longitude) : undefined
});

export const geocode = asyncHandler(async (req, res) => {
  const location = await getCoordinates(parseLocation(req.query));
  res.status(200).json({ location });
});

export const currentWeather = asyncHandler(async (req, res) => {
  const current = await getCurrentWeather(parseLocation(req.query));
  res.status(200).json({ current });
});

export const forecastWeather = asyncHandler(async (req, res) => {
  const forecast = await getForecast(parseLocation(req.query));
  res.status(200).json({ forecast });
});

export const historicalRainfall = asyncHandler(async (req, res) => {
  const historical = await getHistoricalRainfall(parseLocation(req.query));
  res.status(200).json({ historical });
});
