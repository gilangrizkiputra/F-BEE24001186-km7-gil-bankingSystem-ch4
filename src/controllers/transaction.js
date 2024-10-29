import { Transaction } from "../services/transaction.js";
import joi from "joi";

const transactionSchema = joi.object({
  sourceAccountId: joi.number().required(),
  destinationAccountId: joi.number().required(),
  amount: joi.number().positive().required(),
});

export class TransactionController {
  constructor() {
    this.transactionInstance = new Transaction();
  }

  async sendMoney(req, res) {
    const { error } = transactionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { sourceAccountId, destinationAccountId, amount } = req.body;
    const transactionInstance = new Transaction(
      sourceAccountId,
      destinationAccountId,
      amount
    );
    try {
      const transaction = await transactionInstance.sendMoney(req.body);
      res.status(201).json({
        message: "Transaction successfully",
        data: transaction,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllTransactions(req, res) {
    try {
      const transactions = await this.transactionInstance.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTransactionById(req, res) {
    try {
      const transaction = await this.transactionInstance.getTransactionById(
        req.params.id
      );
      if (!transaction)
        return res.status(404).json({ message: "Transaction not found" });
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
