import { AuthService } from "../services/auth.js";
import joi from "joi";

export class AuthController {
    constructor() {
        this.auth = new AuthService();
    }
  async login(req, res) {
    const { email, password } = req.body;
    const { error } = joi
      .object({
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
      })
      .validate({ email, password });

    if (error) {
      return res.status(400).json({
        status: "fail",
        message: error.details[0].message,
      });
    }
    
    try {
      const token = await this.auth.login(email, password);
      res.status(200).json({
        status: "success",
        data: {
          token,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "fail",
        message: error.message,
      });
    }
  }
}
