import { AuthService } from "../services/auth.js";
import joi from "joi";
import * as Sentry from "@sentry/node";

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
      Sentry.captureException(error);
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
      Sentry.captureException(error);
      res.status(500).json({
        status: "fail",
        message: error.message,
      });
    }
  }

  async resetPassword(req, res) {
    const { token } = req.query;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        status: "fail",
        message: "Password is required",
      });
    }

    try {
      const user = await this.auth.resetPassword(token, password);

      if (res.locals.io) {
        res.locals.io.emit("password_reset", {
          message: "Reset password successful",
        });
      } else {
        console.error("Socket.IO instance not found!");
      }

      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    } catch (error) {
      Sentry.captureException(error);
      res.status(500).json({
        status: "fail",
        message: error.message,
      });
    }
  }
}
