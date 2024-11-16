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

  async forgetPassword(req, res) {
    const { email } = req.body;
    try {
      const token = await this.auth.forgetPassword(email);
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

  async resetPassword(req, res) {
    const { token } = req.query;
    const { password } = req.body;

    try {
      const user = await this.auth.resetPassword(token, password);
      res.status(200).json({
        status: "success",
        data: {
          user,
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
