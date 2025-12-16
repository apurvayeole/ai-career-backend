import express from "express";
import { handleUserSignup, handleUserLogin, getSignupPage, getLoginPage } from "../controllers/auth.controllers.js";

const router = express.Router();

router.get("/", getSignupPage);
router.post("/", handleUserSignup);
router.get("/login", getLoginPage);
router.post("/login", handleUserLogin);

export default router;