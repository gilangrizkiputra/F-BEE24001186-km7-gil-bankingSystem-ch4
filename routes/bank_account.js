const express = require("express");
const router = express.Router();
const joi = require("joi");
const bankAccountService = require("../services/bank_account");
const { put } = require("./user");

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

router.post("/", async (req, res) => {
   const { error } = bankAccountSchema.validate(req.body);
   if (error) {
     return res.status(400).json({ message: error.details[0].message });
   }

  const { bankName, bankAccountNumber, balance, userId } = req.body;
  const bankAccountInstance = new bankAccountService(bankName,bankAccountNumber,balance, userId);
  try {
    const bankAccount = await bankAccountInstance.createBankAccount(req.body);
    res.status(201).json({
      message: "Bank account created successfully",
      data: bankAccount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  const bankAccountInstance = new bankAccountService();
  try {
    const bankAccounts = await bankAccountInstance.getAllBankAccounts();
    res.json(bankAccounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const bankAccountInstance = new bankAccountService();
  try {
    const bankAccount = await bankAccountInstance.getBankAccountById(req.params.id);
    if (!bankAccount)
      return res.status(404).json({ message: "Bank account not found" });
    res.json(bankAccount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { bankName, bankAccountNumber, balance } = req.body;
  const { error } = bankAccountSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const bankAccountInstance = new bankAccountService(bankName, bankAccountNumber, balance);
  try {
    const bankAccount = await bankAccountInstance.updateBankAccount(id, {
      bankName,
      bankAccountNumber,
      balance
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
});

router.put("/:id/deposit", async (req, res) => {
  const { id } = req.params;
  const { balance } = req.body;
  const { error } = depositSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const bankAccountInstance = new bankAccountService();
  try {
    const bankAccount = await bankAccountInstance.depositMoney(id, balance);
    if (!bankAccount)
      return res.status(404).json({ message: "Bank account not found" });
    res.json({
      message: "Bank account deposit successfully",
      data: bankAccount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id/withdraw", async (req, res) => {
  const { id } = req.params;
  const { balance } = req.body;
  const { error } = withdrawSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const bankAccountInstance = new bankAccountService();
  try {
    const bankAccount = await bankAccountInstance.depositMoney(id, balance);
    if (!bankAccount)
      return res.status(404).json({ message: "Bank account not found" });
    res.json({
      message: "Bank account withdraw successfully",
      data: bankAccount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const bankAccountInstance = new bankAccountService();
  try {
    const deletedAccount = await bankAccountInstance.deleteBankAccount(req.params.id);
    if(deletedAccount){
      res.json({
        message: "Bank account deleted successfully",
        data: deletedAccount,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
