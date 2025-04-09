const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors"); // Import cors
const { Server } = require("socket.io");

// ✅ Enable CORS for all HTTP routes before defining any routes.
app.use(cors());

const server = http.createServer(app);

// ✅ Configure Socket.io with CORS options
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // allow connections from your React app
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    // Emitting to all sockets in the given room except the sender:
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// Start the server on port 3001
server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
