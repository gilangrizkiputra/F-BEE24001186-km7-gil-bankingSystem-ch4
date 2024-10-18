const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user");
const accountRoutes = require("./routes/bank_account");
const transactionRoutes = require("./routes/transaction");
const app = express();

dotenv.config();
const PORT = process.env.PORT;
function main() {
  app.use(express.json());

  app.use("/api/v1/users", userRoutes);

  app.use("/api/v1/accounts", accountRoutes);

  app.use("/api/v1/transactions", transactionRoutes);

  app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.isJoi) {
      res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: "Internal server error" });
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main();
