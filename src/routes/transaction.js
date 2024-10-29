import express from "express";
const router = express.Router();
import { TransactionController } from "../controllers/transaction.js";

const transaction = new TransactionController();

router.post("/", (req, res) => {transaction.sendMoney(req, res);});

router.get("/", (req, res) => {transaction.getAllTransactions(req, res);});

router.get("/:id", (req, res) => {transaction.getTransactionById(req, res);});

export default router;
