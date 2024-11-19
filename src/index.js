import "./utils/instrument.js";
import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import * as Sentry from "@sentry/node";
import morgan from "morgan";
import http from "http";
import path from "path";
import socket from "./socket.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 2000;

function main() {
  const server = http.createServer(app);
  const io = socket(server);

  app.use((req, res, next) => {
    res.locals.io = io;
    next();
  });

  app.use("/notifications", express.static(path.join(process.cwd(), "src/views")));
  
  app.use(morgan("combined"));
  
  app.use(express.json());

  app.use(routes);

  app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });

  Sentry.setupExpressErrorHandler(app);

  app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.isJoi) {
      return res.status(400).json({ message: err.message });
    }
    Sentry.captureException(err);
    return res.status(500).json({ message: "Internal server error" });
  });

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main();
