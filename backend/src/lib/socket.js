// import { Server } from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173"],
//   },
// });

// export function getReceiverSocketId(userId) {
//   return userSocketMap[userId];
// }

// // used to store online users
// const userSocketMap = {}; // {userId: socketId}

// // io.on("connection", (socket) => {
// //   console.log("A user connected", socket.id);

// //   const userId = socket.handshake.query.userId;
// //   if (userId) userSocketMap[userId] = socket.id;

// //   // io.emit() is used to send events to all the connected clients
// //   io.emit("getOnlineUsers", Object.keys(userSocketMap));

// //   socket.on("disconnect", () => {
// //     console.log("A user disconnected", socket.id);
// //     delete userSocketMap[userId];
// //     io.emit("getOnlineUsers", Object.keys(userSocketMap));
// //   });
// // });

// io.on("connection", (socket) => {
//   console.log("A user connected", socket.id);

//   const userId = socket.handshake.query.userId;
//   if (userId) userSocketMap[userId] = socket.id;

//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   // ✅ Add this block to handle messaging
//   socket.on("sendMessage", ({ senderId, receiverId, text }) => {
//     const receiverSocketId = userSocketMap[receiverId];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("receiveMessage", {
//         senderId,
//         text,
//       });
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("A user disconnected", socket.id);
//     delete userSocketMap[userId];
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// });


// export { io, app, server };

import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // adjust if needed
  },
});

const userSocketMap = {}; // { userId: socketId }

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // Notify all clients about currently online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for chat messages
  socket.on("sendMessage", ({ senderId, receiverId, text, image }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", {
        senderId,
        text,
        image, // ✅ include image if sent
      });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
