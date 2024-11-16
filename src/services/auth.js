import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
const prisma = new PrismaClient();
import dotenv from "dotenv";
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
        throw new AppError("No user found with this email", 404);
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "5m",
      });

      const resetLink = `http://${process.env.APP_URL}/reset-password?token=${token}`;

      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset",
        html: `<p>You requested a password reset. Click the link below to reset your password:</p>
               <a href="${resetLink}">${resetLink}</a>`,
      });

      return { message: "Password reset link sent to your email" };
    } catch (error) {
      console.error("Error during password reset process:", error);
      throw error;
    }
  }

  // Reset Password
  async resetPassword(token, newPassword) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });
      return { message: "Password successfully reset" };
    } catch (error) {
      console.error("Error when resetting password:", error);
      if (error.name === "TokenExpiredError") {
        throw new error(
          "Token expired. Please request a new password reset link.",
          400
        );
      }
      if (error.name === "JsonWebTokenError") {
        throw new error("Invalid token.", 400);
      }
      throw error;
    }
  }
}
