const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const videoEle = document.createElement("video");

var peer = new Peer(); 

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




var conn = peer.connect(userID);
// on open will be launch when you successfully connect to PeerServer
conn.on('open', function(){
  // here you have conn.id
  conn.send('hi!');
});


const addVideoStream = function (video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", function () {
    video.play();
  });
  videoGrid.append(video);
};

