import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import Handlebars from "handlebars";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const prisma = new PrismaClient();
dotenv.config();

export class AuthService {
  constructor(prismaClient = prisma) {
    this.prisma = prismaClient;
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async login(email, password) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET
    );
    return token;
  }

  async forgetPassword(email) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new Error("User not found");
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "10m",
      });

      const resetPasswordLink = `${process.env.APP_URL}/api/v1/auth/reset-password?token=${token}`;

      const templatePath = path.join(
        process.cwd(),
        "src/views",
        "resetPasswordView.html"
      );

      const source = fs.readFileSync(templatePath, "utf-8");
      const template = Handlebars.compile(source);
      const htmlContent = template({ resetPasswordLink });

      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset Password",
        html: htmlContent,
      });

      return { message: "Password reset email sent" };
    } catch (error) {
      console.error("Error when sending password reset email:", error);
      throw error;
    }
  }

  async resetPassword(token, newPassword) {
    if (!token || !newPassword) {
      throw new Error("Token and new password are required");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });
      return { message: "Successfully reset password" };
    } catch (error) {
      console.error("Error when resetting password:", error);
      if (error.name === "TokenExpiredError") {
        throw new Error("Token has expired.");
      }
      if (error.name === "JsonWebTokenError") {
        throw new Error("Invalid token.");
      }
      throw error;
    }
  }
}
