const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const Server = require("http").Server(app);
const io = require("socket.io")(Server);
const {ExpressPeerServer} = require('peer')
const peerServer = ExpressPeerServer(Server,{debug:true})


const host = "http://localhost";
const port = 80;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use('/peerjs',peerServer)

app.get("/", (req, res) => {
  res.redirect("/" + uuidv4());
});
app.get("/:room", (req, res) => {
  res.render("room", { roomID: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomID,userID) => {
    socket.join(roomID);
    socket.to(roomID).emit("user-connected",userID);
    socket.on('message',messge=>{
      io.to(roomID).emit('createMessage',messge)
    })
  });
});

Server.listen(port, () => console.log(`server link ${host + ":" + port}`));
