const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
app.set("view engine", "ejs");
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use("/peerjs", peerServer);
app.use(express.static("public"));

app.get("/", (req, res) => {
  if(req.query.session) {
    res.redirect(`/${uuidv4()}?session="${req.query.session}"`);
  }
  if(req.query.schedule) {
    res.redirect(`/${uuidv4()}?schedule="${req.query.schedule}"`);
  }
});

app.get("/:room", (req, res) => {
  console.log(req.query.session);
  if(req.query.session) {
    res.render("room", { roomId: req.params.room, sessionId: req.query.session });
  }
  if(req.query.schedule) {
    res.render("room", { roomId: req.params.room, scheduleId: req.query.schedule });
  }
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId, userName);
    io.to(roomId).emit("connect-call", userId, userName);

    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId, userName)
    })
  });
  // socket.on("vcall", (roomId, name) => {
  //   socket.to(roomId).broadcast.emit("vcall-connected", name);
  // });
});

server.listen(process.env.PORT || 3030);
