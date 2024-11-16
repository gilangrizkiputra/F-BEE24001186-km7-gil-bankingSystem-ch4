import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { Server } from "socket.io";
import http from "http";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2000;

const server = http.createServer(app);

// Initialize Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware untuk menambahkan io ke res.locals setiap request
app.use((req, res, next) => {
  res.locals.io = io; 
  next();
});

app.use(express.json());

// Middleware untuk serving static files
app.use(express.static(path.join(process.cwd(), "src/views")));

app.use(routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.isJoi) {
    return res.status(400).json({ message: err.message });
  }
  return res.status(500).json({ message: "Internal server error" });
});

// Handle koneksi WebSocket
io.on("connection", (socket) => {
  console.log("New user connected: ", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
