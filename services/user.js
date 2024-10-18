const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class User {
  constructor(name, email, password, profile) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.profile = profile;
  }

  async createUser() {
    return await prisma.user.create({
      data: {
        name: this.name,
        email: this.email,
        password: this.password,
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
  }

  async getAllUsers() {
    return await prisma.user.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }

  async getUserById(id) {
    return await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        profile: true,
      },
    });
  }

  async updateUser(id) {
    try {
      const updatedUser = await prisma.user.update({
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
      return updatedUser;
    } catch (error) {
      console.error(error);
      throw new Error("User not found or update failed");
    }
  }
}

module.exports = User;
