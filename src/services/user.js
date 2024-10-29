import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

export class User {
  constructor(name, email, password, profile) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.profile = profile;
  }

  async createUser() {
    try {
      const encryptedPassword = await bcrypt.hash(this.password, 10);

      return await prisma.user.create({
        data: {
          name: this.name,
          email: this.email,
          password: encryptedPassword,
          profile: {
            create: {
              identityType: this.profile.identityType,
              identityNumber: this.profile.identityNumber,
              address: this.profile.address,
            },
          },
        },
        include: {
          profile: true,
        },
      });
    } catch (error) {
      throw new Error("Internal server error");
    }
  }

  async getAllUsers() {
    try {
      return await prisma.user.findMany({
        orderBy: {
          id: "asc",
        },
      });
    } catch (error) {
      throw new Error("Internal server error");
    }
  }

  async getUserById(id) {
    try {
      return await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          profile: true,
        },
      });
    } catch (error) {
      throw new Error("User not found");
    }
  }

  async updateUser(id) {
    try {
      return await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          name: this.name,
          email: this.email,
          password: this.password,
          profile: {
            update: {
              identityType: this.profile.identityType,
              identityNumber: this.profile.identityNumber,
              address: this.profile.address,
            },
          },
        },
        include: {
          profile: true,
        },
      });
    } catch (error) {
      throw new Error("User not found or update failed");
    }
  }
}
