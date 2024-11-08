import express from "express";
const router = express.Router();
import {  UserController } from "../controllers/user.js";
import { upload } from "../utils/multer.js";

const user = new UserController();

router.get("/", (req, res) => {user.getAllUsers(req, res);});

router.get("/:id", (req, res) => {user.getUserById(req, res);});

router.put("/:id", (req, res) => {user.updateUser(req, res);});

router.put("/:id/image", upload.single("image"), (req, res) => {
      user.uploadImage(req, res).catch((error) => {
        res.status(400).json({ message: error.message });
      });
});

export default router;