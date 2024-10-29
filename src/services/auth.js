import { PrismaClient }  from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export class AuthService {
  constructor(prismaClient = prisma) {
    this.prisma = prismaClient;
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
    if (user.password !== password) {
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
}
