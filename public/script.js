const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const videoEle = document.createElement("video");

var peer = new Peer(undefined, { path: "/peerjs", host: "/", port: 80 });

var peers = {};
var myVideoStream;
var myUserID;
var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;
if (getUserMedia) {
  getUserMedia(
    {
      video: true,
      audio: true,
    },
    function (Stream) {
      myVideoStream = Stream;
      addVideoStream(videoEle, Stream);

      peer.on("call", (call) => {
        call.answer(Stream);
        const video = document.createElement("video");
        call.on("stream", (userVideoStream) => {
          addVideoStream(video, userVideoStream);
        });
      });
      socket.on("user-connected", function (userId) {
        connecToNewUser(userId, Stream);
      });
      socket.on("user-disconnected", (userId) => {
        if (peers[userId]) peers[userId].close();
      });
      let text = $("#msg");

      $("html").keydown((e) => {
        if (e.which == 13 && text.val().length !== 0) {
          socket.emit("message", text.val(), username);
          text.val("");
        }
      });

      socket.on("createMessage", (message, username) => {
        $("#chatLog").append(
          `<li class="message"><b>${username}</b><br/>${message}</li>`
        );
        $("#chatLog").scrollTop($("#chatLog").scrollTop());
      });
    }
  );
} else {
  $(".main-video").html(
    "<h5 class='text-white' >sorry! Your browser dont support the video</h5>"
  );
}

// on open will be launch when you successfully connect to PeerServer
peer.on("open", function (id) {
  myUserID = id;
  socket.emit("join-room", roomID, id);
});

function connecToNewUser(userId, stream) {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });
  peers[userId] = call;
}

const addVideoStream = function (video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", function () {
    video.play();
  });
  videoGrid.append(video);
};

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `;
  document.querySelector(".main__mute_button").innerHTML = html;
};

const security = () => {
  alert("Connection is end-to-end encrypted");
  document.querySelector(".main__security").innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `;
  document.querySelector(".main__mute_button").innerHTML = html;
};

const leave = () => {
  const video = document.querySelector("video");
  video.remove();
  window.close()
  document.querySelector(".main__leave_meeting").innerHTML = "leaved";
};

const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `;
  document.querySelector(".main__video_button").innerHTML = html;
};

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `;
  document.querySelector(".main__video_button").innerHTML = html;
};
