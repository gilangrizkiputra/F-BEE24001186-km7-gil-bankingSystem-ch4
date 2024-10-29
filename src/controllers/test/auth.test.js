import { AuthController } from "../../controllers/auth.js";
import { AuthService } from "../../services/auth.js";

jest.mock("../../services/auth.js");

describe("Test_AuthController", () => {
  let req, res, authController;

  beforeEach(() => {
    req = {
      body: {
        email: "kCqQh@example.com",
        password: "password123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    authController = new AuthController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    test("should return 400 if joi validation fails", async () => {
      req.body = {
        email: "invalid-email",
        password: "123",
      };

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "fail",
        message: expect.any(String),
      });
    });

    test("should return 500 if service throws an error", async () => {
      const mockLogin = jest
        .spyOn(AuthService.prototype, "login")
        .mockRejectedValue(new Error("Internal server error"));

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "fail",
        message: "Internal server error",
      });
      expect(mockLogin).toHaveBeenCalledWith(req.body.email, req.body.password);
    });

    test("should return 200 and token on successful login", async () => {
      const mockToken = "mockJwtToken";
      const mockLogin = jest
        .spyOn(AuthService.prototype, "login")
        .mockResolvedValue(mockToken);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: {
          token: mockToken,
        },
      });
      expect(mockLogin).toHaveBeenCalledWith(req.body.email, req.body.password);
    });
  });
});
