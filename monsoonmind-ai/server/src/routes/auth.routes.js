import { Router } from "express";
import Joi from "joi";
import {
  login,
  logout,
  me,
  register,
  updateMe
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().max(20).allow("", null),
  password: Joi.string().min(8).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const updateMeSchema = Joi.object({
  name: Joi.string().min(2).max(80),
  phone: Joi.string().max(20).allow("", null)
}).min(1);

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", protect, me);
router.put("/me", protect, validate(updateMeSchema), updateMe);

export default router;
