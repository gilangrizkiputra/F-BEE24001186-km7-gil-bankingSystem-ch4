import { TransactionController } from "../../controllers/transaction.js";
import { Transaction } from "../../services/transaction.js";

jest.mock("../../services/transaction.js");

describe("Test_TransactionController", () => {
  let req, res, transactionController;

  beforeEach(() => {
    req = {
      body: {
        sourceAccountId: 1,
        destinationAccountId: 2,
        amount: 100,
      },
      params: {
        id: 1,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    transactionController = new TransactionController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("sendMoney", () => {
    test("should return 400 if validation fails", async () => {
      req.body.amount = -100;

      await transactionController.sendMoney(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.stringContaining('"amount" must be a positive number'),
      });
    });

    test("should return 500 if service throws an error", async () => {
      jest
        .spyOn(Transaction.prototype, "sendMoney")
        .mockRejectedValue(new Error("Internal server error"));

      await transactionController.sendMoney(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });

    test("should return 200 and transaction data when money is sent successfully", async () => {
      const mockSendMoney = jest
        .spyOn(Transaction.prototype, "sendMoney")
        .mockResolvedValue(req.body);

      await transactionController.sendMoney(req, res);

      expect(mockSendMoney).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transaction successfully",
        data: req.body,
      });
    });
  });

  describe("getAllTransactions", () => {
    test("should return 500 if service throws an error", async () => {
      jest
        .spyOn(Transaction.prototype, "getAllTransactions")
        .mockRejectedValue(new Error("Internal server error"));

      await transactionController.getAllTransactions(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });

    test("should return all transactions", async () => {
      const mockGetAllTransactions = jest
        .spyOn(Transaction.prototype, "getAllTransactions")
        .mockResolvedValue([]);

      await transactionController.getAllTransactions(req, res);

      expect(mockGetAllTransactions).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe("getTransactionById", () => {
    test("should return 500 if service throws an error", async () => {
      jest
        .spyOn(Transaction.prototype, "getTransactionById")
        .mockRejectedValue(new Error("Internal server error"));

      await transactionController.getTransactionById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });

    test("should return 404 if transaction not found", async () => {
      jest
        .spyOn(Transaction.prototype, "getTransactionById")
        .mockResolvedValue(null);

      await transactionController.getTransactionById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transaction not found",
      });
    });

    test("should return transaction if found", async () => {
      const mockGetTransactionById = jest
        .spyOn(Transaction.prototype, "getTransactionById")
        .mockResolvedValue({
          id: 1,
          sourceAccountId: 1,
          destinationAccountId: 2,
          amount: 100,
        });

      await transactionController.getTransactionById(req, res);

      expect(mockGetTransactionById).toHaveBeenCalledWith(req.params.id);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        sourceAccountId: 1,
        destinationAccountId: 2,
        amount: 100,
      });
    });
  });
});
