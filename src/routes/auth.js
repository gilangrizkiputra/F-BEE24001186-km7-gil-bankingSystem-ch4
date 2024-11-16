import express from "express";
const router = express.Router();
import { AuthController } from "../controllers/auth.js";
import { UserController } from "../controllers/user.js";

const auth = new AuthController();
const user = new UserController();

router.post("/register", (req, res) => {user.createUser(req, res);});

router.post("/login", (req, res) => {auth.login(req, res);});

router.post("/forget-password", (req, res) => {auth.forgetPassword(req, res);});

router.post("/reset-password", (req, res, next) => {auth.resetPassword(req, res, next);});

export default router;