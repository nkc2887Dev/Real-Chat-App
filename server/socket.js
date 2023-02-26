// Node server which handle socket io connections
const io = require("socket.io")(8000, {
  cors: {
    origin: "*",
  },
});

const users = {};

io.on("connection", (socket) => {
  // if any new user joins, let other users connected to the server knows!
  socket.on("new-user-joined", (name) => {
    // console.log("user", name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  // if someone sends a message,broadcast it to other people
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  // if someone Leave a Chat,let others know!
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});
