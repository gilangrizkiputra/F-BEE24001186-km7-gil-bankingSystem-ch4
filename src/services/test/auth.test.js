import { PrismaClient } from "@prisma/client";
import { AuthService } from "../../services/auth.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

jest.mock("@prisma/client");
jest.mock("jsonwebtoken");

describe("Test_AuthService", () => {
  let mockPrisma;

  beforeAll(() => {
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
      },
    };

    PrismaClient.mockImplementation(() => mockPrisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    test("fail when user not found", async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      const authService = new AuthService(mockPrisma);

      try {
        await authService.login("6iFb0@example.com", "password123");
      } catch (error) {
        expect(error.message).toBe("User not found");
      }

      expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
    });

    test("fail when password is incorrect", async () => {
      const mockUser = {
        id: 1,
        email: "6iFb0@example.com",
        password: await bcrypt.hash("password123", 10),
        name: "John Doe",
      };
      mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);

      const authService = new AuthService(mockPrisma);

      try {
        await authService.login("6iFb0@example.com", "wrongPassword");
      } catch (error) {
        expect(error.message).toBe("Invalid password");
      }

      expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
    });

    test("successfully login and return token", async () => {
      const mockUser = {
        id: 1,
        email: "6iFb0@example.com",
        password: await bcrypt.hash("password123", 10),
        name: "John Doe",
      };
      mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);

      const mockToken = "mockJwtToken";
      jwt.sign.mockReturnValue(mockToken);

      const authService = new AuthService(mockPrisma);

      const result = await authService.login(
        "6iFb0@example.com",
        "password123"
      );

      expect(result).toBe(mockToken);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        },
        process.env.JWT_SECRET
      );
    });
  });
});
