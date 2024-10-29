import express from "express";
const router = express.Router();
import {  UserController} from "../controllers/user.js";
import verifyToken from "../utils/auth.js";

const user = new UserController();

router.post("/", (req, res) => {user.createUser(req, res);});

router.get("/", verifyToken, (req, res) => {user.getAllUsers(req, res);});

router.get("/:id", (req, res) => {user.getUserById(req, res);});

router.put("/:id", (req, res) => {user.updateUser(req, res);});

export default router;