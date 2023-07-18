require("dotenv/config");

const express = require("express");
const bodyParser = require("body-parser");
const socketIO = require("socket.io");
const router = require("./routes");
const morgan = require("morgan");
const cors = require("cors");
const { createTable } = require("./config/db");

const app = express();

app.use(bodyParser.json());
app.use(cors("*"));
app.use(morgan("tiny"));

createTable();
// Create an HTTP server
const server = app.listen(3001, () => {
  console.log("Server started on port 3001");
});

// Create Socket.io server
io = socketIO(server, {
  cors: {
    origin: "*",
    optionSuccessStatus: 200,
  },
});

// WebSocket connection handler
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.set("io", io);
app.use("/", router);

// Cleanup resources when the server is closed
server.on("close", () => {
  // Clean up any resources if needed
});
