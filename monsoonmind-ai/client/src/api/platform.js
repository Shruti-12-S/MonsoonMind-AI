import { api } from "./client";

export const getFarmProfile = async () => {
  const { data } = await api.get("/farm");
  return data.profile;
};

export const saveFarmProfile = async (payload) => {
  const { data } = await api.post("/farm", payload);
  return data.profile;
};

export const runLiveRecommendation = async (payload) => {
  const { data } = await api.post("/recommendation/live", payload);
  return data.recommendation;
};

export const getRecommendationHistory = async () => {
  const { data } = await api.get("/recommendation/history");
  return data.history;
};

export const verifyPendingRecommendations = async () => {
  const { data } = await api.post("/recommendation/verify-pending");
  return data;
};

export const getCalibrationSummary = async () => {
  const { data } = await api.get("/recommendation/calibration");
  return data;
};

export const seedDemoCalibrationData = async () => {
  const { data } = await api.post("/recommendation/dev-seed-calibration");
  return data;
};

export const runRisk = async (payload) => {
  const { data } = await api.post("/risk/live", payload);
  return data;
};

export const runSimulator = async (payload) => {
  const { data } = await api.post("/simulator/run", payload);
  return data.simulation;
};

export const askCopilot = async (payload) => {
  const { data } = await api.post("/copilot/chat", payload);
  return data;
};
