import express from "express";
const router = express.Router();
import { AuthController } from "../controllers/auth.js";

const auth = new AuthController();

router.post("/login", (req, res) => {auth.login(req, res);});

export default router;