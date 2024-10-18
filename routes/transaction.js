const express = require("express");
const router = express.Router();
const joi = require("joi");
const transactionService = require("../services/transaction");

const transactionSchema = joi.object({
  sourceAccountId: joi.number().required(),
  destinationAccountId: joi.number().required(),
  amount: joi.number().positive().required(),
});

router.post("/", async (req, res) => {
  const { error } = transactionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { sourceAccountId, destinationAccountId, amount } = req.body;
  const transactionInstance = new transactionService(sourceAccountId, destinationAccountId, amount);
  try {
    const transaction = await transactionInstance.sendMoney(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  const transactionInstance = new transactionService();
  try {
    const transactions = await transactionInstance.getAllTransactions();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const transactionInstance = new transactionService();
  try {
    const transaction = await transactionInstance.getTransactionById(req.params.id);
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
