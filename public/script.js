const videoGrid = document.getElementById('video-grid');
const videoEle = document.createElement('video');
// undefined, { path: '/peerjs', host: '/', port: 3030 }
var peer = new Peer();

peer.on('open', function (userId) {
  socket.emit('join-room', roomId, userId);
});

var myVideoStream;
var myUserID;
var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

// midea stream
if (getUserMedia) {
  getUserMedia(
    {
      video: true,
      audio: true,
    },
    function (Stream) {
      myVideoStream = Stream;
      addVideoStream(videoEle, Stream);
      socket.on('user-connected', function (userId) {
        connectNewUser(userId, Stream);
      });
      socket.on('user-disconnected', function (userId) {
        document.getElementById(userId).remove();
        videoSizing();
      });

      peer.on('call', (call) => {
        call.answer(Stream);
        const video = document.createElement('video');
        video.setAttribute('id', call.peer);
        call.on('stream', (userStream) => {
          addVideoStream(video, userStream);
        });
      });
      let text = $('#msg');

      $('html').keydown((e) => {
        if (e.which == 13 && text.val().length !== 0) {
          socket.emit('message', text.val(), username);
          text.val('');
        }
      });

      socket.on('createMessage', (message, username) => {
        $('#chatLog').append(
          `<li class="message"><b>${username}</b><br/>${message}</li>`
        );
        $('#chatLog').scrollTop($('#chatLog').scrollTop());
      });
    }
  );
} else {
  $('.main-video').html(
    "<h5 class='text-white' >sorry! Your browser dont support the video</h5>"
  );
}
function connectNewUser(userId, myStream) {
  const call = peer.call(userId, myStream);
  const video = document.createElement('video');
  video.setAttribute('id', userId);
  call.on('stream', (userStream) => {
    addVideoStream(video, userStream);
  });
}

const addVideoStream = function (video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', function () {
    video.play();
  });
  videoGrid.append(video);
  videoSizing();
};
const videoSizing = () => {
  // const videos = document.querySelectorAll('video');
  // var numVideo = videos.length;
  // var lx = window.innerWidth - 270;
  // var ly = window.innerHeight - 56;
  // var w = parseInt(lx / numVideo);
  // videos.forEach((v) => {
  //   v.style.width = w - 5 + 'px';
  // });
};
//control
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
  document.querySelector('.main__mute_button').innerHTML = html;
};
const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `;
  document.querySelector('.main__mute_button').innerHTML = html;
};
const leave = () => {
  if (confirm('Are you sure to leave')) location.assign('/');
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
  document.querySelector('.main__video_button').innerHTML = html;
};
const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `;
  document.querySelector('.main__video_button').innerHTML = html;
};
const toggolChat = () => {
  $('#chatBlock').toggle();
};
const shareRoom = () => {
  if (navigator.clipboard.writeText(window.location.href)) {
    alert('Link Copyed! Send it to your friend.');
  } else alert('Link copy failed');
};
const editNickName = () => {
  var newName = prompt('Enter your nickname.', username);
  if (newName != null) {
    username = newName;
    localStorage.setItem('_vcallUser', JSON.stringify({ name: newName }));
  } else console.log(newName);
};
