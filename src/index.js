import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js";
const app = express();

dotenv.config();
const PORT = process.env.PORT;
function main() {
  app.use(express.json());

  app.use(routes);

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
