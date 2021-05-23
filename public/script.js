const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const videoEle = document.createElement("video");

var peer = new Peer(undefined, { path: "/peerjs", host: "/", port: 80 });
var userList = {};
var streamSrc;
var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;
if (getUserMedia) {
  getUserMedia(
    {
      video: true,
      audio: false,
    },
    function (Stream) {
      streamSrc = Stream;
      addVideoStream(videoEle, Stream);
    });
} else{ $(".main-video").html("<h5 class='text-white' >sorry! Your browser dont support the video</h5>");}

peer.on("open", (id) => {
  socket.emit("join-room", roomID, id);
});
peer.on("call", function (callAns) {
  callAns.answer(streamSrc); // Answer the call with an A/V stream.
  const video = document.createElement("video");
  callAns.on("stream", function (remoteStream) {
    addVideoStream(video, remoteStream);
  });
});
socket.on("user-connected", (userID) => {
  if (typeof userList[userID] == "undefined") {
    userList[userID] = true;
    connecToNewUser(userID);
  }
});

socket.on("createMessage", (message) => {
  $("#chatLog").append(`<li class='message'><b>user</b><br>${message}</li>`);
});
//adfdf
const connecToNewUser = (userID) => {
  const call = peer.call(userID, streamSrc);
  const video = document.createElement("video");
  call.on("stream", (usrStream) => {
    addVideoStream(video, usrStream);
  });
};

const addVideoStream = function (video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", function () {
    video.play();
  });
  videoGrid.append(video);
};

var msg = $("#msg");
$("html").keydown(function (e) {
  if (e.which == 13 && msg.val().length !== 0) {
    socket.emit("message", msg.val());
    msg.val("");
  }
});
