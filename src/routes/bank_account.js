import express from "express";
const router = express.Router();
import { BankAccountController } from "../controllers/bank_account.js";

const bankAccount = new BankAccountController();

router.post("/", (req, res) => {bankAccount.createBankAccount(req, res);});

router.post("/:id/deposit", (req, res) => {bankAccount.depositMoney(req, res);});

router.post("/:id/withdraw", (req, res) => {bankAccount.withdrawMoney(req, res);});

router.get("/", (req, res) => {bankAccount.getAllBankAccounts(req, res);});

router.get("/:id", (req, res) => {bankAccount.getBankAccountById(req, res);});

router.put("/:id", (req, res) => {bankAccount.updateBankAccount(req, res);});

router.delete("/:id", (req, res) => {bankAccount.deleteBankAccount(req, res);});

export default router;
