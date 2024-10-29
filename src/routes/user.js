import express from "express";
const router = express.Router();
import {  UserController} from "../controllers/user.js";

const user = new UserController();

router.get("/", (req, res) => {user.getAllUsers(req, res);});

router.get("/:id", (req, res) => {user.getUserById(req, res);});

router.put("/:id", (req, res) => {user.updateUser(req, res);});

export default router;