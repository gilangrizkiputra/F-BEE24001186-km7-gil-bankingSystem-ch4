import { User } from "../services/user.js";
import joi from "joi";
import imagekit from "../utils/imagekit.js";

const userSchema = joi.object({
  name: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  profile: joi
    .object({
      identityType: joi.string().required(),
      identityNumber: joi.string().required(),
      address: joi.string().required(),
    })
    .required(),
});

export class UserController {
  constructor() {
    this.userInstance = new User();
  }

  async createUser(req, res) {
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password, profile } = req.body;
    const userInstance = new User(name, email, password, profile);
    try {
      const user = await userInstance.createUser();
      res.status(201).json({
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await this.userInstance.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await this.userInstance.getUserById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateUser(req, res) {
    const { id } = req.params;
    const { name, email, password, profile } = req.body;
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userInstance = new User(name, email, password, profile);

    try {
      const user = await userInstance.updateUser(id, {
        name,
        email,
        password,
        profile,
      });
      res.json({
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async uploadImage(req, res) {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    try {
      const base64File = file.buffer.toString("base64");

      const uploadResponse = await imagekit.upload({
        file: base64File,
        fileName: `user_${id}_${Date.now()}`,
        folder: "/user_images",
      });

      const imageUrl = uploadResponse.url;

      const user = await this.userInstance.uploadImage(id, imageUrl);

      res.json({
        message: "User image updated successfully",
        data: {
          id: user.id,
          url: imageUrl,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
