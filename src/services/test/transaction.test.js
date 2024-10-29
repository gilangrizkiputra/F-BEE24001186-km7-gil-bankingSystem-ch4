import { PrismaClient } from "@prisma/client";
import { Transaction } from "../../services/transaction.js";

jest.mock("@prisma/client");

describe("Test_TransactionService", () => {
  let mockPrisma;

  beforeAll(() => {
    mockPrisma = {
      bankAccount: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      transaction: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    PrismaClient.mockImplementation(() => mockPrisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("sendMoney", () => {
    test("fail when source account is not found", async () => {
      mockPrisma.bankAccount.findUnique.mockResolvedValueOnce(null);

      const transactionService = new Transaction(1, 2, 100, mockPrisma);

      try {
        await transactionService.sendMoney();
      } catch (error) {
        expect(error.message).toBe("Source account not found");
      }
      expect(mockPrisma.bankAccount.findUnique).toHaveBeenCalledTimes(1);
    });

    test("fail when source account has insufficient balance", async () => {
      mockPrisma.bankAccount.findUnique.mockResolvedValueOnce({
        id: 1,
        balance: 50,
      });

      const transactionService = new Transaction(1, 2, 100, mockPrisma);

      try {
        await transactionService.sendMoney();
      } catch (error) {
        expect(error.message).toBe("Insufficient balance");
      }
      expect(mockPrisma.bankAccount.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrisma.bankAccount.update).not.toHaveBeenCalled();
    });

    test("successfully send money", async () => {
      mockPrisma.bankAccount.findUnique.mockResolvedValueOnce({
        id: 1,
        balance: 200,
      }); 
      mockPrisma.bankAccount.update.mockResolvedValueOnce({
        id: 1,
        balance: 100,
      }); 
      mockPrisma.bankAccount.update.mockResolvedValueOnce({
        id: 2,
        balance: 300,
      }); 
      mockPrisma.transaction.create.mockResolvedValueOnce({
        id: 1,
        sourceAccountId: 1,
        destinationAccountId: 2,
        amount: 100,
      });

      const transactionService = new Transaction(1, 2, 100, mockPrisma); 

      const result = await transactionService.sendMoney();

      expect(result).toEqual({
        id: 1,
        sourceAccountId: 1,
        destinationAccountId: 2,
        amount: 100,
      });
      expect(mockPrisma.bankAccount.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrisma.bankAccount.update).toHaveBeenCalledTimes(2); 
      expect(mockPrisma.transaction.create).toHaveBeenCalledWith({
        data: {
          sourceAccountId: 1,
          destinationAccountId: 2,
          amount: 100,
        },
      });
    });
  });

  describe("getAllTransactions", () => {
    test("fail when internal server error", async () => {
      mockPrisma.transaction.findMany.mockRejectedValueOnce(
        new Error("Internal server error")
      );

      try {
        const transactionService = new Transaction();
        await transactionService.getAllTransactions();
        expect(mockPrisma.transaction.findMany).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error.message).toBe("Internal server error");
      }
    });

    test("successfully get all transactions", async () => {
      const transactions = [
        { id: 1, sourceAccountId: 1, destinationAccountId: 2, amount: 100 },
      ];

      mockPrisma.transaction.findMany.mockResolvedValueOnce(transactions);

      try {
        const transactionService = new Transaction();
        const result = await transactionService.getAllTransactions();

        expect(result).toEqual(transactions);
        expect(mockPrisma.transaction.findMany).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error.message).toBe("Internal server error");
      }
    });
  });

  describe("getTransactionById", () => {
    test("fail when transaction not found", async () => {
      mockPrisma.transaction.findUnique.mockResolvedValueOnce(null);

      const transactionService = new Transaction();
      try {
        await transactionService.getTransactionById(999);
        expect(mockPrisma.transaction.findUnique).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error.message).toBe("Transaction not found");
      }
    });

    test("successfully get transaction by id", async () => {
      const transaction = {
        id: 1,
        sourceAccountId: 1,
        destinationAccountId: 2,
        amount: 100,
      };

      mockPrisma.transaction.findUnique.mockResolvedValueOnce(transaction);

      try {
        const transactionService = new Transaction();
        const result = await transactionService.getTransactionById(1);

        expect(result).toEqual(transaction);
        expect(mockPrisma.transaction.findUnique).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error.message).toBe("Transaction not found");
      }
    });
  });
});
