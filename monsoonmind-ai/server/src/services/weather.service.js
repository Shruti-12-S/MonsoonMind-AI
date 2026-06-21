import axios from "axios";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { cacheKey, getCache, setCache } from "../utils/cache.js";

const WEATHER_TTL_SECONDS = 10 * 60;
const FORECAST_TTL_SECONDS = 30 * 60;
const GEOCODE_TTL_SECONDS = 24 * 60 * 60;
const HISTORICAL_TTL_SECONDS = 12 * 60 * 60;

const roundCoordinate = (value) => Number(Number(value).toFixed(4));

const formatDate = (date) =>
  date.toISOString().slice(0, 10).replaceAll("-", "");

const toIsoDate = (date) => date.toISOString().slice(0, 10);

const addDays = (date, days) => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

const normalizeText = (value = "") =>
  String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const compactLabel = (...parts) =>
  parts.filter(Boolean).map((part) => String(part).trim()).filter(Boolean).join(", ");

const normalizePincode = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length === 6 ? digits : "";
};

const chooseGeocodeResult = (results = [], { state }) => {
  if (!results.length) return null;

  const requestedState = normalizeText(state);
  const indiaResults = results.filter((result) => result.country_code === "IN");
  const candidates = indiaResults.length ? indiaResults : results;

  if (requestedState) {
    const stateMatch = candidates.find((result) =>
      normalizeText(result.admin1).includes(requestedState)
    );
    if (stateMatch) return stateMatch;
  }

  return candidates[0];
};

export const getCoordinates = async ({ latitude, longitude, city, district, state, pincode, label, source }) => {
  if (latitude !== undefined && longitude !== undefined) {
    return {
      latitude: roundCoordinate(latitude),
      longitude: roundCoordinate(longitude),
      label: label || compactLabel(city, district, state, pincode) || `${latitude}, ${longitude}`,
      source: source || "user"
    };
  }

  const normalizedPincode = normalizePincode(pincode);
  if (normalizedPincode) {
    return getCoordinatesFromPincode({ pincode: normalizedPincode, city, district, state });
  }

  if (!city && !district) {
    throw new ApiError(400, "Provide either latitude/longitude, PIN code, or city.");
  }

  const placeName = city || district;
  const key = cacheKey("geocode", placeName, district, state);
  const cached = await getCache(key);
  if (cached) return cached;

  const { data } = await axios.get(env.openMeteoGeocodingUrl, {
    params: {
      name: placeName,
      count: 10,
      language: "en",
      format: "json"
    },
    timeout: 10000
  });

  const result = chooseGeocodeResult(data?.results || [], { state });

  if (!result) {
    throw new ApiError(404, `Could not geocode location: ${compactLabel(city, district, state)}`);
  }

  const payload = {
    latitude: roundCoordinate(result.latitude),
    longitude: roundCoordinate(result.longitude),
    label: compactLabel(result.name, result.admin2, result.admin1, result.country),
    source: "open-meteo-geocoding"
  };

  await setCache(key, payload, GEOCODE_TTL_SECONDS, "open-meteo-geocoding");
  return payload;
};

const getCoordinatesFromPincode = async ({ pincode, city, district, state }) => {
  if (!env.openWeatherApiKey) {
    if (city || district) {
      return getCoordinates({ city, district, state });
    }

    throw new ApiError(
      503,
      "PIN code lookup requires OPENWEATHER_API_KEY. Add city/state or exact coordinates instead."
    );
  }

  const key = cacheKey("geocode-pincode", pincode);
  const cached = await getCache(key);
  if (cached) return cached;

  const { data } = await axios.get("https://api.openweathermap.org/geo/1.0/zip", {
    params: {
      zip: `${pincode},IN`,
      appid: env.openWeatherApiKey
    },
    timeout: 10000
  });

  if (data?.lat === undefined || data?.lon === undefined) {
    throw new ApiError(404, `Could not geocode PIN code: ${pincode}`);
  }

  const payload = {
    latitude: roundCoordinate(data.lat),
    longitude: roundCoordinate(data.lon),
    label: compactLabel(data.name, district, state, pincode),
    source: "openweather-pincode"
  };

  await setCache(key, payload, GEOCODE_TTL_SECONDS, "openweather-pincode");
  return payload;
};

export const getCurrentWeather = async (locationInput) => {
  const location = await getCoordinates(locationInput);
  const key = cacheKey("current", location.latitude, location.longitude);
  const cached = await getCache(key);
  if (cached) return cached;

  const payload = env.openWeatherApiKey
    ? await fetchOpenWeatherCurrent(location)
    : await fetchOpenMeteoCurrent(location);

  await setCache(key, payload, WEATHER_TTL_SECONDS, payload.source);
  return payload;
};

export const getForecast = async (locationInput) => {
  const location = await getCoordinates(locationInput);
  const key = cacheKey("forecast", location.latitude, location.longitude);
  const cached = await getCache(key);
  if (cached) return cached;

  const { data } = await axios.get(env.openMeteoUrl, {
    params: {
      latitude: location.latitude,
      longitude: location.longitude,
      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "precipitation",
        "rain",
        "wind_speed_10m",
        "cloud_cover"
      ].join(","),
      daily: [
        "precipitation_sum",
        "precipitation_probability_max",
        "temperature_2m_max",
        "temperature_2m_min",
        "wind_speed_10m_max"
      ].join(","),
      forecast_days: 7,
      timezone: "auto"
    },
    timeout: 12000
  });

  const daily = data.daily.time.map((date, index) => ({
    date,
    rainfall: Number(data.daily.precipitation_sum[index] || 0),
    rainProbability: Number(
      data.daily.precipitation_probability_max?.[index] || 0
    ),
    temperatureMax: Number(data.daily.temperature_2m_max[index]),
    temperatureMin: Number(data.daily.temperature_2m_min[index]),
    windSpeedMax: Number(data.daily.wind_speed_10m_max[index] || 0)
  }));

  const payload = {
    source: "open-meteo",
    location,
    generatedAt: new Date().toISOString(),
    daily
  };

  await setCache(key, payload, FORECAST_TTL_SECONDS, "open-meteo");
  return payload;
};

export const getHistoricalRainfall = async (locationInput, days = 30) => {
  const location = await getCoordinates(locationInput);
  const end = addDays(new Date(), -1);
  const start = addDays(end, -days);
  const key = cacheKey(
    "historical-rainfall",
    location.latitude,
    location.longitude,
    formatDate(start),
    formatDate(end)
  );
  const cached = await getCache(key);
  if (cached) return cached;

  try {
    const { data } = await axios.get(env.nasaPowerUrl, {
      params: {
        parameters: "PRECTOTCORR",
        community: "AG",
        longitude: location.longitude,
        latitude: location.latitude,
        start: formatDate(start),
        end: formatDate(end),
        format: "JSON"
      },
      timeout: 15000
    });

    const values = data?.properties?.parameter?.PRECTOTCORR || {};
    const daily = Object.entries(values)
      .filter(([, value]) => Number(value) >= 0)
      .map(([date, rainfall]) => ({
        date: `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`,
        rainfall: Number(rainfall)
      }));

    const totalRainfall = daily.reduce((sum, item) => sum + item.rainfall, 0);
    const averageDailyRainfall = daily.length ? totalRainfall / daily.length : 0;

    const payload = {
      source: "nasa-power",
      available: true,
      location,
      period: {
        start: toIsoDate(start),
        end: toIsoDate(end)
      },
      totalRainfall: Number(totalRainfall.toFixed(2)),
      averageDailyRainfall: Number(averageDailyRainfall.toFixed(2)),
      daily
    };

    await setCache(key, payload, HISTORICAL_TTL_SECONDS, "nasa-power");
    return payload;
  } catch (error) {
    return {
      source: "nasa-power",
      available: false,
      location,
      reason: error.message,
      daily: [],
      totalRainfall: null,
      averageDailyRainfall: null
    };
  }
};


export const getObservedRainfallRange = async (locationInput, { start, end }) => {
  const location = await getCoordinates(locationInput);
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new ApiError(400, "Provide valid start and end dates for observed rainfall.");
  }

  const key = cacheKey(
    "observed-rainfall",
    location.latitude,
    location.longitude,
    formatDate(startDate),
    formatDate(endDate)
  );
  const cached = await getCache(key);
  if (cached) return cached;

  const { data } = await axios.get(env.nasaPowerUrl, {
    params: {
      parameters: "PRECTOTCORR",
      community: "AG",
      longitude: location.longitude,
      latitude: location.latitude,
      start: formatDate(startDate),
      end: formatDate(endDate),
      format: "JSON"
    },
    timeout: 15000
  });

  const values = data?.properties?.parameter?.PRECTOTCORR || {};
  const daily = Object.entries(values)
    .filter(([, value]) => Number(value) >= 0)
    .map(([date, rainfall]) => ({
      date: `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`,
      rainfall: Number(rainfall)
    }));
  const totalRainfall = daily.reduce((sum, item) => sum + item.rainfall, 0);

  const payload = {
    source: "nasa-power",
    available: daily.length > 0,
    location,
    period: {
      start: toIsoDate(startDate),
      end: toIsoDate(endDate)
    },
    totalRainfall: Number(totalRainfall.toFixed(2)),
    daily
  };

  await setCache(key, payload, HISTORICAL_TTL_SECONDS, "nasa-power");
  return payload;
};
export const getWeatherBundle = async (locationInput) => {
  const location = await getCoordinates(locationInput);
  const [current, forecast, historical] = await Promise.all([
    getCurrentWeather(location),
    getForecast(location),
    getHistoricalRainfall(location)
  ]);

  return {
    location,
    current,
    forecast,
    historical
  };
};

const fetchOpenWeatherCurrent = async (location) => {
  const { data } = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
    params: {
      lat: location.latitude,
      lon: location.longitude,
      units: "metric",
      appid: env.openWeatherApiKey
    },
    timeout: 10000
  });

  return {
    source: "openweather",
    location,
    generatedAt: new Date().toISOString(),
    temperature: Number(data.main?.temp),
    humidity: Number(data.main?.humidity),
    rainfall: Number(data.rain?.["1h"] || data.rain?.["3h"] || 0),
    windSpeed: Number(data.wind?.speed || 0),
    cloudCover: Number(data.clouds?.all || 0),
    condition: data.weather?.[0]?.description || "Unavailable"
  };
};

const fetchOpenMeteoCurrent = async (location) => {
  const { data } = await axios.get(env.openMeteoUrl, {
    params: {
      latitude: location.latitude,
      longitude: location.longitude,
      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "precipitation",
        "rain",
        "wind_speed_10m",
        "cloud_cover"
      ].join(","),
      timezone: "auto"
    },
    timeout: 10000
  });

  return {
    source: "open-meteo",
    location,
    generatedAt: new Date().toISOString(),
    temperature: Number(data.current?.temperature_2m),
    humidity: Number(data.current?.relative_humidity_2m),
    rainfall: Number(data.current?.rain || data.current?.precipitation || 0),
    windSpeed: Number(data.current?.wind_speed_10m || 0),
    cloudCover: Number(data.current?.cloud_cover || 0),
    condition: "Open-Meteo current conditions"
  };
};
