import { UserController } from "../../controllers/user.js";
import { User } from "../../services/user.js";

jest.mock("../../services/user.js");

describe("Test_userController", () => {
  let req, res, userController;

  beforeEach(() => {
    req = {
      body: {
        name: "John Doe",
        email: "HlTqz@example.com",
        password: "password123",
        profile: {
          identityType: "ID",
          identityNumber: "123456789",
          address: "123 Main St",
        },
      },
      params: {
        id: "1",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    userController = new UserController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    test("should return 400 if validation fails", async () => {
      req.body.email = "invalid-email";

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.stringContaining('"email" must be a valid email'),
      });
    });

    test("should return 500 if service throws an error", async () => {
      const mockCreateUser = jest
        .spyOn(User.prototype, "createUser")
        .mockRejectedValue(new Error("Internal server error"));

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
      expect(mockCreateUser).toHaveBeenCalled();
    });

    test("should return 201 and user data when user is created successfully", async () => {
      const mockCreateUser = jest
        .spyOn(User.prototype, "createUser")
        .mockResolvedValue(req.body);

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
        data: req.body,
      });
      expect(mockCreateUser).toHaveBeenCalled();
    });
  });

  describe("getAllUsers", () => {
    test("should return 500 if service throws an error", async () => {
      const mockGetAllUsers = jest
        .spyOn(User.prototype, "getAllUsers")
        .mockRejectedValue(new Error("Internal server error"));

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
      expect(mockGetAllUsers).toHaveBeenCalled();
    });

    test("should return all users when successfully", async () => {
      const mockUsers = [
        { id: 1, name: "John Doe", email: "john.doe@example.com" },
        { id: 2, name: "Jane Doe", email: "jane.doe@example.com" },
      ];

      const mockGetAllUsers = jest
        .spyOn(User.prototype, "getAllUsers")
        .mockResolvedValue(mockUsers);

      await userController.getAllUsers(req, res);

      expect(res.json).toHaveBeenCalledWith(mockUsers);
      expect(mockGetAllUsers).toHaveBeenCalled();
    });
  });

  describe("getUserById", () => {
    test("should return 404 if user not found", async () => {
      const mockGetUserById = jest
        .spyOn(User.prototype, "getUserById")
        .mockResolvedValue(null);

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found",
      });
      expect(mockGetUserById).toHaveBeenCalledWith(req.params.id);
    });

    test("should return 500 if service throws an error", async () => {
      const mockGetUserById = jest
        .spyOn(User.prototype, "getUserById")
        .mockRejectedValue(new Error("Internal server error"));

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
      expect(mockGetUserById).toHaveBeenCalledWith(req.params.id);
    });

    test("should return user if found", async () => {
      const mockUser = {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
      };

      const mockGetUserById = jest
        .spyOn(User.prototype, "getUserById")
        .mockResolvedValue(mockUser);

      await userController.getUserById(req, res);

      expect(res.json).toHaveBeenCalledWith(mockUser);
      expect(mockGetUserById).toHaveBeenCalledWith(req.params.id);
    });
  });

  describe("updateUser", () => {
    test("should return 400 if validation fails", async () => {
      req.body.email = "invalid email";

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.stringContaining('"email" must be a valid email'),
      });
    });

    test("should return 500 if service throws an error", async () => {
      const mockUpdateUser = jest
        .spyOn(User.prototype, "updateUser")
        .mockRejectedValue(new Error("Internal server error"));

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
      expect(mockUpdateUser).toHaveBeenCalledWith(req.params.id, req.body);
    });

    test("should return updated user when successful", async () => {
      const mockUpdatedUser = {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        profile: {
          identityType: "ID",
          identityNumber: "123456789",
          address: "123 Main St",
        },
      };

      const mockUpdateUser = jest
        .spyOn(User.prototype, "updateUser")
        .mockResolvedValue(mockUpdatedUser);

      await userController.updateUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "User updated successfully",
        data: mockUpdatedUser,
      });
      expect(mockUpdateUser).toHaveBeenCalledWith(req.params.id, req.body);
    });
  });
});
