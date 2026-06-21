import { api } from "./client";

export const registerUser = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const loginUser = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const logoutUser = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};

export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data.user;
};

export const updateMe = async (payload) => {
  const { data } = await api.put("/auth/me", payload);
  return data.user;
};
