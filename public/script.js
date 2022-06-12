const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const videoName = document.getElementById("video-name");
const myVideo = document.createElement("video");
const showChat = document.querySelector("#showChat");
const backBtn = document.querySelector(".header__back");
const dateTime = document.querySelector("#dateTime");

// import Helpers from "/views/helper.js";
const  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let path = 'https://e-safetalk.herokuapp.com'
if(document.location.hostname == 'localhost'){
  path = 'http://localhost:3001'
}

myVideo.muted = true;

backBtn.addEventListener("click", () => {
  document.querySelector(".main__left").style.display = "flex";
  document.querySelector(".main__left").style.flex = "1";
  document.querySelector(".main__right").style.display = "none";
  document.querySelector(".header__back").style.display = "none";
});

showChat.addEventListener("click", () => {
  document.querySelector(".main__right").style.display = "flex";
  document.querySelector(".main__right").style.flex = "1";
  document.querySelector(".main__left").style.display = "none";
  document.querySelector(".header__back").style.display = "block";
});

let user = "test";
let id = "";

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  // port: "3030",
});

let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then( async(stream) => {
    // let name = await getUsername();
    // socket.emit("vcall", ROOM_ID, name);

    // socket.on("vcall-connected", (userName) => {
    //   console.log(userName, "name ni");
    //   user = userName;
    // });

    myVideoStream = stream;
    var container_div = document.getElementById('video-grid');
    var count = container_div.getElementsByTagName('video').length;
    if (count < 2) {
      addVideoStream(myVideo, user, stream);
    }

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        var container_div = document.getElementById('video-grid');
        var count = container_div.getElementsByTagName('video').length;
        if (count < 2) {
          addVideoStream(video, user, userVideoStream);
        }
      });
    });

    socket.on("user-connected", (userId, userName) => {
      user = userName;
      connectToNewUser(userId, userName, stream);
    });
    
  });

const connectToNewUser = (userId, userName, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    var container_div = document.getElementById('video-grid');
    var count = container_div.getElementsByTagName('video').length;
    if (count < 2) {
      addVideoStream(video, userName, userVideoStream);
    }
  });
};

peer.on("open", async (id) => {
  user = await getUsername();
  socket.emit("join-room", ROOM_ID, id, user);
});

const addVideoStream = async(video, userName, stream) => {
  video.srcObject = stream;
  
  // if(csData) {
    // var container_div = document.getElementById('video-grid');
    // var count = container_div.getElementsByTagName('video').length;
    // if (count < 2) {
      await video.addEventListener("loadedmetadata", async() => {
        if(typeof SESSION_ID != "undefined") {
          let csData =  await getSession();
          console.log(csData);
          if(csData) {
            // user = csData.data.data.cs_id.profile.firstname;
            let container_div = document.getElementById('video-grid');
            let count = container_div.getElementsByTagName('video').length;
            if (count > 1) {
              let element = document.getElementById('video-name').children[1]
              element.innerHTML = "Care provider: " + csData.data.data.schedule.cp_id.firstname;
              console.log("ningsulod", element);
            }
            if (count < 2) {
              let nameHtml = `<span class="text-white p-10 name m-13">Care seeker: ${userName != "test"? userName : csData.data.data.cs_id.profile.firstname}</span>`;
              videoName.innerHTML += nameHtml;
            } 
            if (count < 3) {
              video.play();
              videoGrid.append(video);
            } else {
              document.getElementById("video-grid").remove();
              
              Swal.fire({
                title: 'Info!',
                text: `This session is only limited to 2 users`,
                icon: 'info',
                showCancelButton: false,
                showConfirmButton: false,
                closeOnClickOutside: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
              })
            }
            // Session type filter (video, chat, voice)
            // if (csData.data.data.schedule.session_type) {
            //   if(!(csData.data.data.schedule.session_type).includes("video")) {
            //     myVideoStream.getVideoTracks()[0].enabled = false;
            //     let html = `<i class="fas fa-video-slash"></i>`;
            //     stopVideo.classList.toggle("background__red");
            //     stopVideo.innerHTML = html;
            //   }
            //   if(!(csData.data.data.schedule.session_type).includes("voice")) {
            //     myVideoStream.getAudioTracks()[0].enabled = false;
            //     let html = `<i class="fas fa-microphone-slash"></i>`;
            //     muteButton.classList.toggle("background__red");
            //     muteButton.innerHTML = html;
            //   }
            // }
          }
        }
        if(typeof SCHEDULE_ID != "undefined") {
          let cpData = await getSchedule();
          if(cpData) {
            console.log(cpData);
            // user = cpData.data.data.cp_id.firstname;
            let container_div = document.getElementById('video-grid');
            let count = container_div.getElementsByTagName('video').length;
            if (count > 1) {
              let element = document.getElementById('video-name').children[1]
              element.innerHTML = "Care Seeker: " + cpData.data.data.session_set.cs_id.profile.firstname;
              console.log("ningsulod", element);
            }
            if (count < 2) {
              let nameHtml = `<span class="text-white p-10 name m-13">Care provider: ${userName != "test"? userName: cpData.data.data.cp_id.firstname}</span>`;
              videoName.innerHTML += nameHtml;
            } 
            if (count < 3) {
              video.play();
              videoGrid.append(video);
            } else {
              document.getElementById("video-grid").remove();
              Swal.fire({
                title: 'Info!',
                text: `This session is only limited to 2 users`,
                icon: 'info',
                showCancelButton: false,
                showConfirmButton: false,
                closeOnClickOutside: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
              })
            }
            // Session type filter (video, chat, voice)
            // if (cpData.data.data.session_type) {
            //   if(!(cpData.data.data.session_type).includes("video")) {
            //     myVideoStream.getVideoTracks()[0].enabled = false;
            //     let html = `<i class="fas fa-video-slash"></i>`;
            //     stopVideo.classList.toggle("background__red");
            //     stopVideo.innerHTML = html;
            //   }
            //   if(!(cpData.data.data.session_type).includes("voice")) {
            //     myVideoStream.getAudioTracks()[0].enabled = false;
            //     let html = `<i class="fas fa-microphone-slash"></i>`;
            //     muteButton.classList.toggle("background__red");
            //     muteButton.innerHTML = html;
            //   }
            // }
          }
        }
        
      });
    // }else {
    //   console.log("The video call is only limited to two");
    // }
  // }
};

let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

const inviteButton = document.querySelector("#inviteButton");
const endButton = document.querySelector("#endButton");
const muteButton = document.querySelector("#muteButton");
const stopVideo = document.querySelector("#stopVideo");
muteButton.addEventListener("click", () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  let html = '';
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    html = `<i class="fas fa-microphone-slash"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    html = `<i class="fas fa-microphone"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  }
});

stopVideo.addEventListener("click", () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  let html = '';
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    html = `<i class="fas fa-video-slash"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    html = `<i class="fas fa-video"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  }
});

inviteButton.addEventListener("click", (e) => {
  prompt(
    "Copy this link and send it to people you want to meet with",
    window.location.href
  );
});
endButton.addEventListener("click", (e) => {
  let res = confirm("Are you sure you want to end this session?");
  if (res) {
    alert("The session ended");
  }
});



socket.on("createMessage", (message, userName) => {
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
        <b><i class="far fa-user-circle"></i> <span> ${
          // userName === user ? "me" : userName
          userName
        }</span> </b>
        <span>${message}</span>
    </div>`;
});

// GET schedule data
const getSession = async(req, res) => {
  try {
    // console.log(Helpers.getToken("careseeker"), "token");
    if(typeof SESSION_ID != "undefined") {
      console.log(SESSION_ID, 'session_id');
      //
      let result = await axios.get(`${path}/esafetalk/api/careseeker/session/view/${SESSION_ID}`)
      let session_date = new Date(result.data.data.schedule.date);
      
      let session_date_time = `${months[session_date.getMonth()]} ${session_date.getDate()}, ${session_date.getFullYear()}- ${result.data.data.schedule.time_start} - ${result.data.data.schedule.time_end}`
      dateTime.innerHTML = session_date_time
      
      let format_session_date = `${session_date.getFullYear()}-${session_date.getDate()}-${session_date.getMonth()}`
      let current_date = new Date();
      let format_current_date = `${current_date.getFullYear()}-${current_date.getDate()}-${current_date.getMonth()}`
      console.log(format_session_date, format_current_date, "ontime")
      // CHECK IF CURRENT DATE EQUALS TO SESSION DATE
      if (format_session_date != format_current_date) { //!=
        Swal.fire({
          title: 'Info!',
          text: `This session will be open on: ${months[session_date.getMonth()]} ${session_date.getDate()}, ${session_date.getFullYear()}`,
          icon: 'info',
          showCancelButton: false,
          showConfirmButton: false,
          closeOnClickOutside: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
        })
      } else {
        // CHECK TIME IF WITHIN TIME SCHEDULE
        let current_time = current_date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

        var startTime = getTwentyFourHourTime(result.data.data.schedule.time_start);
        var endTime = getTwentyFourHourTime(result.data.data.schedule.time_end);

        let currentDate = new Date()   
        let startDate = new Date(currentDate.getTime());
        startDate.setHours(startTime.split(":")[0]);
        startDate.setMinutes(startTime.split(":")[1]);
        startDate.setSeconds('00');

        let endDate = new Date(currentDate.getTime());
        endDate.setHours(endTime.split(":")[0]);
        endDate.setMinutes(endTime.split(":")[1]);
        endDate.setSeconds('00');

        let valid = startDate < currentDate && endDate > currentDate
        let textShow = endDate < currentDate? "This session ended on" : "This session will be start on"
        if (!valid) { //!valid
          Swal.fire({
            title: 'Info!',
            text: `${textShow}: ${months[session_date.getMonth()]} ${session_date.getDate()}, ${session_date.getFullYear()} ${result.data.data.schedule.time_start} - ${result.data.data.schedule.time_end}`,
            icon: 'info',
            showCancelButton: false,
            showConfirmButton: false,
            closeOnClickOutside: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
          })
        } else {
          return result;
        }
      }
    }
  } catch (error) {
    console.error(error)
  }
};
// 
const getSchedule = async(req, res) => {
  try {
    // console.log(Helpers.getToken("careseeker"), "token");
    // console.log(SCHEDULE_ID, "schedule id");
    if(typeof SCHEDULE_ID != "undefined") { 
      let result = await axios.get(`${path}/esafetalk/api/user/schedule/view/${SCHEDULE_ID}`)
      let session_date = new Date(result.data.data.date);
      
      let format_session_date = `${session_date.getFullYear()}-${session_date.getDate()}-${session_date.getMonth()}`
      let current_date = new Date();
      let format_current_date = `${current_date.getFullYear()}-${current_date.getDate()}-${current_date.getMonth()}`

      let session_date_time = `${months[session_date.getMonth()]} ${session_date.getDate()}, ${session_date.getFullYear()}- ${result.data.data.time_start} - ${result.data.data.time_end}`
      dateTime.innerHTML = session_date_time
      console.log(format_current_date, format_session_date , "time condition");
      // CHECK IF CURRENT DATE EQUALS TO SESSION DATE
      if (format_session_date != format_current_date) { //!=
        Swal.fire({
          title: 'Info!',
          text: `This session will be start on: ${months[session_date.getMonth()]} ${session_date.getDate()}, ${session_date.getFullYear()} \n ${result.data.data.time_start} - ${result.data.data.time_end}`,
          icon: 'info',
          showCancelButton: false,
          showConfirmButton: false,
          closeOnClickOutside: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
        })
      } else {

        // CHECK TIME IF WITHIN TIME SCHEDULE
        let current_time = current_date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

        var startTime = getTwentyFourHourTime(result.data.data.time_start);
        var endTime = getTwentyFourHourTime(result.data.data.time_end);

        let currentDate = new Date()   
        let startDate = new Date(currentDate.getTime());
        startDate.setHours(startTime.split(":")[0]);
        startDate.setMinutes(startTime.split(":")[1]);
        startDate.setSeconds('00');

        let endDate = new Date(currentDate.getTime());
        endDate.setHours(endTime.split(":")[0]);
        endDate.setMinutes(endTime.split(":")[1]);
        endDate.setSeconds('00');

        let valid = startDate < currentDate && endDate > currentDate
        let textShow = endDate < currentDate? "This session ended on" : "This session will be start on"
        if (!valid) { //!valid
          Swal.fire({
            title: 'Info!',
            text: `${textShow}: ${months[session_date.getMonth()]} ${session_date.getDate()}, ${session_date.getFullYear()} ${result.data.data.time_start} - ${result.data.data.time_end}`,
            icon: 'info',
            showCancelButton: false,
            showConfirmButton: false,
            closeOnClickOutside: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
          })
        } else {
          return result;
        }
      }
      
    }
  } catch (error) {
    console.error(error)
  }
};

const getTwentyFourHourTime = (amPmString) => { 
  var d = new Date("1/1/2013 " + amPmString); 
  return d.getHours() + ':' + d.getMinutes(); 
}

const getUsername = async(req, res) => {
  let username = 'test';
  if(typeof SESSION_ID != "undefined") {
    let csData = await getSession()
    if(csData) {
      username = csData.data.data.cs_id.profile.firstname
    }
  }

  if(typeof SCHEDULE_ID != "undefined") {
    let cpData =  await getSchedule();
    if(cpData) {
      username = cpData.data.data.cp_id.firstname;
    }
  }
  user = username;
  return username;
}

const checkEndTime = async (req, res) => {
  if(typeof SESSION_ID != "undefined") {
    let currentDate = new Date()
    let result = await getSession()
    
    let endTime = getTwentyFourHourTime(result.data.data.schedule.time_end);
    let endDate = new Date(currentDate.getTime());
    endDate.setHours(endTime.split(":")[0]);
    endDate.setMinutes(endTime.split(":")[1]);
    endDate.setSeconds('00');

    
    let currentDatePlusFiveMinutes = new Date(currentDate.getTime() + 5 * 60000)
    currentDatePlusFiveMinutes.setSeconds('00')
    
    currentDatePlusFiveMinutes = `${currentDatePlusFiveMinutes.getHours()}:${currentDatePlusFiveMinutes.getMinutes()}`
    endDate = `${endDate.getHours()}:${endDate.getMinutes()}`
    let isValid = currentDatePlusFiveMinutes == endDate
    console.log(currentDatePlusFiveMinutes, "current date", endDate)
    console.log(isValid);
    if(isValid) { //valid
      Swal.fire({
        title: 'Info!',
        text: `This session will be finished in 5 minutes`,
        icon: 'info',
        showCancelButton: false,
        showConfirmButton: true,
        closeOnClickOutside: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
      })
    }

    let valid = currentDate > endDate 
    if(valid) { //valid
      Swal.fire({
        title: 'Info!',
        text: `This session is finished`,
        icon: 'info',
        showCancelButton: false,
        showConfirmButton: false,
        closeOnClickOutside: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      })
    }
  }

  if(typeof SCHEDULE_ID != "undefined") {
    let currentDate = new Date()
    let result = await getSchedule();

    let endTime = getTwentyFourHourTime(result.data.data.time_end);
    let endDate = new Date(currentDate.getTime());
    endDate.setHours(endTime.split(":")[0]);
    endDate.setMinutes(endTime.split(":")[1]);
    endDate.setSeconds('00');

    
    let currentDatePlusFiveMinutes = new Date(currentDate.getTime() + 5 * 60000)
    currentDatePlusFiveMinutes.setSeconds('00')
    
    currentDatePlusFiveMinutes = `${currentDatePlusFiveMinutes.getHours()}:${currentDatePlusFiveMinutes.getMinutes()}`
    endDate = `${endDate.getHours()}:${endDate.getMinutes()}`
    let isValid = currentDatePlusFiveMinutes == endDate
    console.log(currentDatePlusFiveMinutes, "current date", endDate)
    console.log(isValid);
    if(isValid) { //valid
      Swal.fire({
        title: 'Info!',
        text: `This session will be finished in 5 minutes`,
        icon: 'info',
        showCancelButton: false,
        showConfirmButton: true,
        closeOnClickOutside: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
      })
    }
    
    let valid = currentDate > endDate 
    if(valid) { //valid
      Swal.fire({
        title: 'Info!',
        text: `This session is finished`,
        icon: 'info',
        showCancelButton: false,
        showConfirmButton: false,
        closeOnClickOutside: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      })
    }
  }
}

setInterval(function() {
  checkEndTime();
}, 60 * 1000);



// const token = async(req, res) => {
//   return  Helpers.getToken("careseeker");
// };


