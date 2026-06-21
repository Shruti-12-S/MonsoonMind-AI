import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const signToken = (userId) =>
  jwt.sign({ id: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  createdAt: user.createdAt
});

const sendAuth = (res, user, statusCode = 200) => {
  const token = signToken(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: env.nodeEnv === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  res.status(statusCode).json({ token, user: publicUser(user) });
};

export const register = asyncHandler(async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const user = await User.create(req.body);
  sendAuth(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select("+password");
  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new ApiError(401, "Invalid email or password.");
  }

  sendAuth(res, user);
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully." });
});

export const me = asyncHandler(async (req, res) => {
  res.status(200).json({ user: publicUser(req.user) });
});

export const updateMe = asyncHandler(async (req, res) => {
  const allowed = ["name", "phone"];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });

  await req.user.save();
  res.status(200).json({ user: publicUser(req.user) });
});
