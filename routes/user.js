const express = require("express");
const router = express.Router();
const joi = require("joi");
const userService = require("../services/user");

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

const userInstance = new userService();

router.post("/", async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, email, password, profile } = req.body;
  const userInstance = new userService(name, email, password, profile);
  try {
    const user = await userInstance.createUser(req.body);
    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await userInstance.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await userInstance.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password, profile } = req.body;
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const userInstance = new userService(name, email, password, profile);

  try {
    const user = await userInstance.updateUser(id, {name, email, password, profile});
     res.json({
       message: "User updated successfully",
       data: user,
     });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
