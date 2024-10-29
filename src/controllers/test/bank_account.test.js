import { BankAccountController } from "../../controllers/bank_account.js";
import { BankAccount } from "../../services/bank_account.js";

jest.mock("../../services/bank_account.js");

describe("Test_BankAccountController", () => {
  let req, res, bankAccountController;

  beforeEach(() => {
    req = {
      body: {
        bankName: "Bank of America",
        bankAccountNumber: "123456789",
        balance: 1000,
        userId: 1,
      },
      params: {
        id: 1,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    bankAccountController = new BankAccountController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createBankAccount", () => {
    test("should return 400 if validation fails", async () => {
      req.body.bankName = "";

      await bankAccountController.createBankAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.stringContaining(
          '"bankName" is not allowed to be empty'
        ),
      });
    });

    test("should return 500 if service throws an error", async () => {
      const mockCreateBankAccount = jest
        .spyOn(BankAccount.prototype, "createBankAccount")
        .mockRejectedValue(new Error("Internal server error"));

      await bankAccountController.createBankAccount(req, res);

      expect(mockCreateBankAccount).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });

    test("should return 201 and bank account data when bank account is created successfully", async () => {
      const mockCreateBankAccount = jest
        .spyOn(BankAccount.prototype, "createBankAccount")
        .mockResolvedValue(req.body);

      await bankAccountController.createBankAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Bank account created successfully",
        data: req.body,
      });
      expect(mockCreateBankAccount).toHaveBeenCalled();
    });
  });

  describe("getAllBankAccounts", () => {
    test("should return 500 if service throws an error", async () => {
      const mockGetAllBankAccounts = jest
        .spyOn(BankAccount.prototype, "getAllBankAccounts")
        .mockRejectedValue(new Error("Internal server error"));

      await bankAccountController.getAllBankAccounts(req, res);

      expect(mockGetAllBankAccounts).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });

    test("should return all bank accounts when successful", async () => {
      const mockBankAccounts = [
        {
          bankName: "Bank ABC",
          bankAccountNumber: "1234567890",
          balance: 1000,
          userId: 1,
        },
        {
          bankName: "Bank XYZ",
          bankAccountNumber: "9876543210",
          balance: 2000,
          userId: 2,
        },
      ];

      const mockGetAllBankAccounts = jest
        .spyOn(BankAccount.prototype, "getAllBankAccounts")
        .mockResolvedValue(mockBankAccounts);

      await bankAccountController.getAllBankAccounts(req, res);

      expect(res.json).toHaveBeenCalledWith(mockBankAccounts);
      expect(mockGetAllBankAccounts).toHaveBeenCalled();
    });
  });

  describe("getBankAccountById", () => {
    test("should return 500 if service throws an error", async () => {
      const mockGetBankAccountById = jest
        .spyOn(BankAccount.prototype, "getBankAccountById")
        .mockRejectedValue(new Error("Internal server error"));

      await bankAccountController.getBankAccountById(req, res);

      expect(mockGetBankAccountById).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });

    test("should return 404 if bank account not found", async () => {
      const mockGetBankAccountById = jest
        .spyOn(BankAccount.prototype, "getBankAccountById")
        .mockResolvedValue(null);

      await bankAccountController.getBankAccountById(req, res);

      expect(mockGetBankAccountById).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Bank account not found",
      });
    });

    test("should return bank account if found", async () => {
      const mockGetBankAccountById = jest
        .spyOn(BankAccount.prototype, "getBankAccountById")
        .mockResolvedValue(req.body);

      await bankAccountController.getBankAccountById(req, res);

      expect(mockGetBankAccountById).toHaveBeenCalledWith(req.params.id);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });
  });

  describe("updateBankAccount", () => {
    test("should return 500 if service throws an error", async () => {
      jest
        .spyOn(BankAccount.prototype, "updateBankAccount")
        .mockRejectedValue(new Error("Internal server error"));

      await bankAccountController.updateBankAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });

    test("should update bank account successfully", async () => {
      const updatedAccount = {
        bankName: "Updated Bank",
        bankAccountNumber: "999999999",
        balance: 1500,
      };

      jest
        .spyOn(BankAccount.prototype, "updateBankAccount")
        .mockResolvedValue(updatedAccount);

      await bankAccountController.updateBankAccount(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "Bank account updated successfully",
        data: updatedAccount,
      });
    });
  });

  describe("deleteBankAccount", () => {
    test("should return 500 if service throws an error", async () => {
      jest
        .spyOn(BankAccount.prototype, "deleteBankAccount")
        .mockRejectedValue(new Error("Internal server error"));

      await bankAccountController.deleteBankAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });

    test("should delete bank account successfully", async () => {
      const mockDeletedAccount = {
        bankName: "Bank ABC",
        bankAccountNumber: "123456789",
        balance: 0,
        userId: 1,
      };

      jest
        .spyOn(BankAccount.prototype, "deleteBankAccount")
        .mockResolvedValue(mockDeletedAccount);

      await bankAccountController.deleteBankAccount(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "Bank account deleted successfully",
        data: mockDeletedAccount,
      });
    });
  });

  describe("Test_depositMoney_and_withdrawMoney", () => {
    beforeEach(() => {
      req = {
        body: {
          balance: 1000,
        },
        params: {
          id: 1,
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      bankAccountController = new BankAccountController();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe("depositMoney", () => {
      test("should return 400 if validation fails", async () => {
        req.body.balance = -100;

        await bankAccountController.depositMoney(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          message: expect.stringContaining(
            '"balance" must be a positive number'
          ),
        });
      });

      test("should return 500 if service throws an error", async () => {
        jest
          .spyOn(BankAccount.prototype, "depositMoney")
          .mockRejectedValue(new Error("Internal server error"));

        await bankAccountController.depositMoney(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          message: "Internal server error",
        });
      });

      test("should return 404 if bank account not found", async () => {
        jest
          .spyOn(BankAccount.prototype, "depositMoney")
          .mockResolvedValue(null);

        await bankAccountController.depositMoney(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
          message: "Bank account not found",
        });
      });

      test("should deposit money successfully", async () => {
        const mockDepositMoney = jest
          .spyOn(BankAccount.prototype, "depositMoney")
          .mockResolvedValue(req.body);

        await bankAccountController.depositMoney(req, res);

        expect(mockDepositMoney).toHaveBeenCalledWith(1, req.body.balance);
        expect(res.json).toHaveBeenCalledWith({
          message: "Bank account deposit successfully",
          data: req.body,
        });
      });
    });

    describe("withdrawMoney", () => {
      test("should return 400 if validation fails", async () => {
        req.body.balance = -100;

        await bankAccountController.withdrawMoney(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          message: expect.stringContaining(
            '"balance" must be a positive number'
          ),
        });
      });

      test("should return 500 if service throws an error", async () => {
        jest
          .spyOn(BankAccount.prototype, "withdrawMoney")
          .mockRejectedValue(new Error("Internal server error"));

        await bankAccountController.withdrawMoney(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          message: "Internal server error",
        });
      });

      test("should return 404 if bank account not found", async () => {
        jest
          .spyOn(BankAccount.prototype, "withdrawMoney")
          .mockResolvedValue(null);

        await bankAccountController.withdrawMoney(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
          message: "Bank account not found",
        });
      });

      test("should withdraw money successfully", async () => {
        const mockWithdrawMoney = jest
          .spyOn(BankAccount.prototype, "withdrawMoney")
          .mockResolvedValue(req.body);

        await bankAccountController.withdrawMoney(req, res);

        expect(mockWithdrawMoney).toHaveBeenCalledWith(1, req.body.balance);
        expect(res.json).toHaveBeenCalledWith({
          message: "Bank account withdraw successfully",
          data: req.body,
        });
      });
    });
  });
});
