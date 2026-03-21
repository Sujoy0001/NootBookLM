const http = require('http');
const express = require('express');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// socket.io connection
io.on('connection', (socket) => {
  socket.on("user-message", (message) => {
    io.emit("user-message", message);
  });
});

app.use(express.static(path.resolve("./public")));

app.get('/', (req, res) => {
  res.sendFile(path.resolve("./public/index.html"));
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});