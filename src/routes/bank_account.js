import express from "express";
const router = express.Router();
import { BankAccountController } from "../controllers/bank_account.js";
import verifyToken from "../utils/auth.js";

const bankAccount = new BankAccountController();

router.post("/", (req, res) => {bankAccount.createBankAccount(req, res);});

router.post("/:id/deposit", verifyToken, (req, res) => {bankAccount.depositMoney(req, res);});

router.post("/:id/withdraw", verifyToken, (req, res) => {bankAccount.withdrawMoney(req, res);});

router.get("/", verifyToken, (req, res) => {bankAccount.getAllBankAccounts(req, res);});

router.get("/:id", verifyToken, (req, res) => {bankAccount.getBankAccountById(req, res);});

router.put("/:id", verifyToken, (req, res) => {bankAccount.updateBankAccount(req, res);});

router.delete("/:id", (req, res) => {bankAccount.deleteBankAccount(req, res);});

export default router;
