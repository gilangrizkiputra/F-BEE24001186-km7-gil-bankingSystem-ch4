import { PrismaClient } from "@prisma/client";
import { BankAccount } from "../../services/bank_account.js";

jest.mock("@prisma/client");

describe("Test_BankAccountService", () => {
  let mockPrisma;

  beforeAll(() => {
    mockPrisma = {
      bankAccount: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    PrismaClient.mockImplementation(() => mockPrisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createBankAccount", () => {
    test("fail when internal server error", async () => {
      const bankAccount = {
        bankName: "Bank A",
        bankAccountNumber: "123456789",
        balance: 1000,
        userId: 1,
      };

      mockPrisma.bankAccount.create.mockRejectedValue(
        new Error("Internal server error")
      );

      try {
        const bankAccountService = new BankAccount(
          bankAccount.bankName,
          bankAccount.bankAccountNumber,
          bankAccount.balance,
          bankAccount.userId
        );
        await bankAccountService.createBankAccount();
      } catch (error) {
        expect(error.message).toBe("Internal server error");
      }
    });

    test("successfully create bank account", async () => {
      const bankAccount = {
        bankName: "Bank A",
        bankAccountNumber: "123456789",
        balance: 1000,
        userId: 1,
      };

      mockPrisma.bankAccount.create.mockResolvedValue(bankAccount);

      try {
        const bankAccountService = new BankAccount(
          bankAccount.bankName,
          bankAccount.bankAccountNumber,
          bankAccount.balance,
          bankAccount.userId
        );
        const createdBankAccount = await bankAccountService.createBankAccount();
        expect(createdBankAccount).toEqual(bankAccount);
      } catch (error) {
        expect(error.message).toBe("Internal server error");
      }
    });
  });

  describe("depositMoney", () => {
    test("fail when bank account is not found or deposit failed", async () => {
     
      mockPrisma.bankAccount.findUnique.mockRejectedValue(new Error("Bank account not found or deposit failed"));

      try {
        const bankAccountService = new BankAccount();
        await bankAccountService.depositMoney(null, null);
        expect(mockPrisma.bankAccount.update).not.toHaveBeenCalled();
      } catch (error) {
        expect(error.message).toBe("Bank account not found or deposit failed");
      }
    });

    test("successfully deposit money when bank account is found", async () => {
      const bankAccount = { id: 1, balance: 1000 };

      mockPrisma.bankAccount.findUnique.mockResolvedValue(bankAccount);
      mockPrisma.bankAccount.update.mockResolvedValue({
        ...bankAccount,
        balance: bankAccount.balance + 100,
      });

      try {
        const bankAccountService = new BankAccount();
        const updatedBankAccount = await bankAccountService.depositMoney(
          1,
          100
        );
        expect(updatedBankAccount.balance).toBe(1100);
        expect(mockPrisma.bankAccount.update).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error.message).toBe("Bank account not found or deposit failed");
      }
    });
  });

  describe("withdrawMoney", () => {
    test("fail when bank account not found", async () => {
      const bankAccount = { balance: 1000 };

      mockPrisma.bankAccount.update.mockRejectedValue(
        new Error("Bank account not found or withdraw failed")
      );

      try {
        const bankAccountService = new BankAccount(bankAccount.balance);
        await bankAccountService.withdrawMoney(100);
        expect(mockPrisma.bankAccount.update).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error.message).toBe("Bank account not found or withdraw failed");
      }
    });

    test("successfully withdraw money", async () => {
      const bankAccount = { balance: 1000 };

      mockPrisma.bankAccount.update.mockResolvedValue(bankAccount);

      try {
        const bankAccountService = new BankAccount(bankAccount.balance);
        const updatedBankAccount = await bankAccountService.withdrawMoney(100);
        expect(updatedBankAccount).toEqual(bankAccount);
        expect(mockPrisma.bankAccount.update).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error.message).toBe("Bank account not found or withdraw failed");
      }
    });
  });

  describe("getAllBankAccounts", () => {
    test("fail when internal server error", async () => {
      mockPrisma.bankAccount.findMany.mockRejectedValue(
        new Error("Internal server error")
      );

      try {
        const bankAccountService = new BankAccount();
        await bankAccountService.getAllBankAccounts();
        expect(mockPrisma.bankAccount.findMany).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error.message).toBe("Internal server error");
      }
    });

    test("successfully get all bank accounts", async () => {
      const bankAccounts = [
        {
          id: 1,
          bankName: "Bank A",
          bankAccountNumber: "123456789",
          balance: 1000,
          userId: 1,
        },
        {
          id: 2,
          bankName: "Bank B",
          bankAccountNumber: "987654321",
          balance: 2000,
          userId: 2,
        },
      ];

      mockPrisma.bankAccount.findMany.mockResolvedValue(bankAccounts);

      try {
        const bankAccountService = new BankAccount();
        const bankAccountsResult =
          await bankAccountService.getAllBankAccounts();
        expect(bankAccountsResult).toEqual(bankAccounts);
        expect(mockPrisma.bankAccount.findMany).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error.message).toBe("Internal server error");
      }
    });
  });

  describe("getBankAccountById", () => {
    test("fail when bank account not found", async () => {
      mockPrisma.bankAccount.findUnique.mockRejectedValue(
        new Error("Bank account not found")
      );

      try {
        const bankAccountService = new BankAccount();
        await bankAccountService.getBankAccountById(999);
        expect(mockPrisma.bankAccount.findUnique).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error.message).toBe("Bank account not found");
      }
    });

    test("successfully get bank account by id", async () => {
      const bankAccount = {
        id: 1,
        bankName: "Bank A",
        bankAccountNumber: "123456789",
        balance: 1000,
        userId: 1,
      };

      mockPrisma.bankAccount.findUnique.mockResolvedValue(bankAccount);

      try {
        const bankAccountService = new BankAccount();
        const bankAccountResult = await bankAccountService.getBankAccountById(
          1
        );
        expect(bankAccountResult).toEqual(bankAccount);
        expect(mockPrisma.bankAccount.findUnique).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error.message).toBe("Bank account not found");
      }
    });
  });

  describe("updateBankAccount", () => {
    test("fail when bank account not found or update failed", async () => {
      mockPrisma.bankAccount.update.mockRejectedValue(
        new Error("Bank account not found or update failed")
      );

      try {
        const bankAccountService = new BankAccount();
        await bankAccountService.updateBankAccount(999);
        expect(mockPrisma.bankAccount.update).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error.message).toBe("Bank account not found or update failed");
      }
    });

    test("successfully update bank account", async () => {
      const bankAccount = {
        id: 1,
        bankName: "Bank A",
        bankAccountNumber: "123456789",
        balance: 1000,
        userId: 1,
      };

      mockPrisma.bankAccount.update.mockResolvedValue(bankAccount);

      try {
        const bankAccountService = new BankAccount();
        const bankAccountResult = await bankAccountService.updateBankAccount(1);
        expect(bankAccountResult).toEqual(bankAccount);
        expect(mockPrisma.bankAccount.update).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error.message).toBe("Bank account not found or update failed");
      }
    });
  });

  describe("deleteBankAccount", () => {
    test("fail when delete bank account not found or delete failed", async () => {

      mockPrisma.bankAccount.delete.mockRejectedValue(new Error("Bank account not found or delete failed"));

      try {
        const bankAccountService = new BankAccount();
        await bankAccountService.deleteBankAccount(999);
        expect(mockPrisma.bankAccount.delete).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error.message).toBe("Bank account not found or delete failed");
      }
    });

    test("successfully delete bank account", async () => {
      const bankAccount = { id: 1 };

      mockPrisma.bankAccount.delete.mockResolvedValue(bankAccount);

      try {
        const bankAccountService = new BankAccount();
        const bankAccountResult = await bankAccountService.deleteBankAccount(1);
        expect(bankAccountResult).toEqual(bankAccount);
        expect(mockPrisma.bankAccount.delete).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error.message).toBe("Bank account not found or delete failed");
      }
    });
  });
});
