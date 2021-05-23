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
app.get('/',(req,res)=>{
  res.render('getinfo',{btn:"make New room"})
})
app.get("/:user", (req, res) => {
  res.redirect(`/${uuidv4()}/${req.params.user}`);
});
app.get("/:room/:user", (req, res) => {
  if(req.params.user){
    res.render("room", {userID:req.params.user, roomID: req.params.room });
  }
  
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomID,userID) => {
    socket.join(roomID);
    socket.to(roomID).emit("user-connected",userID);
    socket.on('message',(message,username)=>{
      io.to(roomID).emit('createMessage',message,username)
    })
    socket.on('disconnect', () => {
      socket.to(roomID).emit('user-disconnected', userID)
    })
  });
});

Server.listen(port, () => console.log(`server link ${host + ":" + port}`));
