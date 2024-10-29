import { PrismaClient } from "@prisma/client";
import { User } from "../../services/user.js";

jest.mock("@prisma/client");

describe("Test_userService", () => {
  let mockPrisma;

  beforeAll(() => {
    mockPrisma = {
      user: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    PrismaClient.mockImplementation(() => mockPrisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    test("fail when internal server error", async () => {
      const user = {
        name: "John Doe",
        email: "6iFb0@example.com",
        password: "password123",
        profile: {
          identityType: "ID",
          identityNumber: "123456789",
          address: "123 Main St",
        },
      };

      mockPrisma.user.create.mockRejectedValue(
        new Error("Internal server error")
      );

      try {
        const userService = new User(
          user.name,
          user.email,
          user.password,
          user.profile
        );
        await userService.createUser();
      } catch (error) {
        expect(error.message).toBe("Internal server error");
      }
    });

    test("successfully create user", async () => {
      const user = {
        name: "John Doe",
        email: "6iFb0@example.com",
        password: "password123",
        profile: {
          identityType: "ID",
          identityNumber: "123456789",
          address: "123 Main St",
        },
      };

      mockPrisma.user.create.mockResolvedValue(user);

      try {
        const userService = new User(
          user.name,
          user.email,
          user.password,
          user.profile
        );
        const result = await userService.createUser();
        expect(result).toEqual(createUser);
      } catch (error) {
        expect(error.message).toBe("Internal server error");
      }
    });
  });

  describe("getAllUsers", () => {
    test("fail when internal server error", async () => {
      mockPrisma.user.findMany.mockRejectedValue(
        new Error("Internal server error")
      );

      try {
        const userService = new User();
        await userService.getAllUsers();
        expect(mockPrisma.user.findMany).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error.message).toBe("Internal server error");
      }
    });

    test("successfully get all users", async () => {
      const users = [
        {
          id: 1,
          name: "John Doe",
          email: "6iFb0@example.com",
          password: "password123",
        },
        {
          id: 2,
          name: "Jane Doe",
          email: "8o3r8@example.com",
          password: "password456",
        },
      ];

      mockPrisma.user.findMany.mockResolvedValue(users);

      try {
        const userService = new User();
        const result = await userService.getAllUsers();
        expect(result).toEqual(users);
        experct(mockPrisma.user.findMany).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error.message).toBe("Internal server error");
      }
    });
  });

  describe("getUserById", () => {
    test("fail when user not found", async () => {
      mockPrisma.user.findUnique.mockRejectedValue(new Error("User not found"));

      try {
        const userService = new User();
        await userService.getUserById(999);
        expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error.message).toBe("User not found");
      }
    });

    test("successfully get user by id", async () => {
      const user = {
        id: 1,
        name: "John Doe",
        email: "6iFb0@example.com",
        password: "password123",
        profile: {
          identityType: "ID",
          identityNumber: "123456789",
          address: "123 Main St",
        },
      };

      mockPrisma.user.findUnique.mockResolvedValue(user);

      try {
        const userService = new User();
        const result = await userService.getUserById(1);
        expect(result).toEqual(user);
        expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error.message).toBe("User not found");
      }
    });
  });

  describe("updateUser", () => {
    test("fail when user not found", async () => {
      mockPrisma.user.update.mockRejectedValue(
        new Error("User not found or update failed")
      );

      try {
        const userService = new User();
        await userService.updateUser(1, {});
        expect(mockPrisma.user.update).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error.message).toBe("User not found or update failed");
      }
    });

    test("successfully update user", async () => {
      const user = {
        id: 1,
        name: "John Doe",
        email: "6iFb0@example.com",
        password: "password123",
        profile: {
          identityType: "ID",
          identityNumber: "123456789",
          address: "123 Main St",
        },
      };

      mockPrisma.user.update.mockResolvedValue(user);

      try {
        const userService = new User();
        const result = await userService.updateUser(1, {});
        expect(result).toEqual(user);
        expect(mockPrisma.user.update).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error.message).toBe("User not found or update failed");
      }
    });
  });
});
