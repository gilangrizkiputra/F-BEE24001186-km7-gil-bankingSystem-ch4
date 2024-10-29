import { BankAccount } from "../services/bank_account.js";
import joi from "joi";

const bankAccountSchema = joi.object({
  bankName: joi.string().required(),
  bankAccountNumber: joi.string().required(),
  balance: joi.number().required(),
  userId: joi.number().required(),
});

const withdrawSchema = joi.object({
  balance: joi.number().positive().required(),
});

const depositSchema = joi.object({
  balance: joi.number().positive().required(),
});

export class BankAccountController {
  constructor() {
    this.bankAccountInstance = new BankAccount();
  }

  async createBankAccount(req, res) {
    const { error } = bankAccountSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { bankName, bankAccountNumber, balance, userId } = req.body;
    const bankAccountInstance = new BankAccount(
      bankName,
      bankAccountNumber,
      balance,
      userId
    );
    try {
      const bankAccount = await bankAccountInstance.createBankAccount(req.body);
      res.status(201).json({
        message: "Bank account created successfully",
        data: bankAccount,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async depositMoney(req, res) {
    const { id } = req.params;
    const { balance } = req.body;
    const { error } = depositSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    try {
      const bankAccount = await this.bankAccountInstance.depositMoney(
        id,
        balance
      );
      if (!bankAccount)
        return res.status(404).json({ message: "Bank account not found" });
      res.json({
        message: "Bank account deposit successfully",
        data: bankAccount,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async withdrawMoney(req, res) {
    const { id } = req.params;
    const { balance } = req.body;
    const { error } = withdrawSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    try {
      const bankAccount = await this.bankAccountInstance.withdrawMoney(
        id,
        balance
      );
      if (!bankAccount)
        return res.status(404).json({ message: "Bank account not found" });
      res.json({
        message: "Bank account withdraw successfully",
        data: bankAccount,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllBankAccounts(req, res) {
    try {
      const bankAccounts = await this.bankAccountInstance.getAllBankAccounts();
      res.json(bankAccounts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getBankAccountById(req, res) {
    try {
      const bankAccount = await this.bankAccountInstance.getBankAccountById(
        req.params.id
      );
      if (!bankAccount)
        return res.status(404).json({ message: "Bank account not found" });
      res.json(bankAccount);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateBankAccount(req, res) {
    const { id } = req.params;
    const { bankName, bankAccountNumber, balance } = req.body;
    const { error } = bankAccountSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const bankAccountInstance = new BankAccount(
      bankName,
      bankAccountNumber,
      balance
    );

    try {
      const bankAccount = await bankAccountInstance.updateBankAccount(id, {
        bankName,
        bankAccountNumber,
        balance,
      });
      if (!bankAccount)
        return res.status(404).json({ message: "Bank account not found" });
      res.json({
        message: "Bank account updated successfully",
        data: bankAccount,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteBankAccount(req, res) {
    try {
      const deletedAccount = await this.bankAccountInstance.deleteBankAccount(
        req.params.id
      );
      if (deletedAccount) {
        res.json({
          message: "Bank account deleted successfully",
          data: deletedAccount,
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
