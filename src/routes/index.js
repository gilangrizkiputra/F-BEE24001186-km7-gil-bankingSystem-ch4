import express from "express";
import userRoutes from "./user.js";
import accountRoutes from "./bank_account.js";
import transactionRoutes from "./transaction.js";
import authRoutes from "./auth.js"; 
const app = express();

import { readFileSync } from "fs";
import swaggerUi from "swagger-ui-express";
const swaggerDocument = JSON.parse(readFileSync(new URL('../swagger-output.json', import.meta.url)));

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/accounts", accountRoutes);

app.use("/api/v1/transactions", transactionRoutes);

app.use("/api/v1/auth", authRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;