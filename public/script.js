const socket = io("/");
const videoGrid = document.getElementById("video-grid-cs");
const videoGridCp = document.getElementById("video-grid-cp");
const videoContainerCp = document.querySelector("#cp_vid_container");
const videoContainerCs = document.querySelector("#cs_vid_container");

const videoName = document.getElementById("video-name");
const myVideo = document.createElement("video");
const showChat = document.querySelector("#showChat");
// const backBtn = document.querySelector(".header__back");
// const dateTime = document.querySelector("#dateTime");
const calendarDate = document.querySelector("#calendar_date");
const timeClock = document.querySelector("#time_clock");
const warningModal = document.querySelector("#warning_modal");
const dismissBtn = document.querySelector("#dismissBtn");
const okBtn = document.querySelector("#okBtn");
const activeCamera = document.querySelector("#active_camera")
const disableCamera = document.querySelector("#disable_camera")
const activeVoice = document.querySelector("#active_voice")
const disableVoice = document.querySelector("#disable_voice")
const sessionTitle = document.querySelector("#session_title")
const chatMessage = document.getElementById("chat_message")
const chatContainer = document.getElementById("chat_container")
const closeChat = document.getElementById("close_chat")
const activeChat = document.getElementById("active_chat")
const disableChat = document.getElementById("disable_chat")
const chatBody = document.querySelector('.chat--body')


let startTimeCall = ""
let endTimeCall = ""

// import Helpers from "/views/helper.js";
const  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let path = 'https://e-safetalk.herokuapp.com'
if(document.location.hostname == 'localhost'){
  path = 'http://localhost:3001'
}

myVideo.muted = true;

// backBtn.addEventListener("click", () => {
//   document.querySelector(".main__left").style.display = "flex";
//   document.querySelector(".main__left").style.flex = "1";
//   document.querySelector(".main__right").style.display = "none";
//   document.querySelector(".header__back").style.display = "none";
// });

showChat.addEventListener("click", () => {
  const disable = chatMessage.disabled;
  let html = '';
  if (disable) {
    chatMessage.disabled = false;
    chatContainer.style.display = "block"
    
    activeChat.style.display = "block"
    disableChat.style.display = "none"
  } else {
    chatMessage.disabled = true;
    chatContainer.style.display = "none"

    activeChat.style.display = "none"
    disableChat.style.display = "block"
  }
});

closeChat.addEventListener("click", () => {
  showChat.click()
  
});


dismissBtn.addEventListener("click", () => {
  warningModal.style.display = "none"
});

okBtn.addEventListener("click", () => {
  warningModal.style.display = "none"
});

warningModal.addEventListener("click", () => {
  warningModal.style.display = "none"
});

let user = "test";
let id = "";

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/"
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
    var container_div = document.getElementById('video-grid-cp');
    var count = container_div.getElementsByTagName('video').length;
    if (count < 2) {
      addVideoStream(myVideo, user, stream);
    }

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        var container_div = document.getElementById('video-grid-cp');
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
    var container_div = document.getElementById('video-grid-cp');
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
          if(csData) {
            // user = csData.data.data.cs_id.profile.firstname;
            sessionTitle.innerHTML = `Video Session with ${csData.data.data.schedule.cp_id.firstname}`

            let container_div_cs = document.getElementById('video-grid-cs');
            let countVideoCs = container_div_cs.getElementsByTagName('video').length;
            let container_div_cp = document.getElementById('video-grid-cp');
            let countVideoCp = container_div_cp.getElementsByTagName('video').length;
            if (countVideoCs == 0) {
              videoGrid.append(video)
              const videoGridStyle = document.querySelector("#cs_vid_container video");
              console.log(videoGridStyle)
              videoGridStyle.style.width="100%"
              if (videoGridStyle != "undefined") {
                videoContainerCs.classList.remove("d-none")
              }
            }

            if (countVideoCp == 0) {
              videoGridCp.append(video)
              const videoGridStyle = document.querySelector("#cp_vid_container video");
              console.log(videoGridStyle)
              videoGridStyle.style.width="100%"
              if (videoGridStyle != "undefined") {
                videoContainerCp.classList.remove("d-none")
              }
            }

            // if (count > 1) {
            //   // let element = document.getElementById('video-name').children[1]
            //   element.innerHTML = "Care provider: " + csData.data.data.schedule.cp_id.firstname;
            // }
            // if (count < 2) {
            //   let nameHtml = `<span class="text-white p-10 name m-13">Care seeker: ${userName != "test"? userName : csData.data.data.cs_id.profile.firstname}</span>`;
            //   // videoName.innerHTML += nameHtml;
              
            //   console.log(userName)
            // } 
            if (countVideoCs < 3) {
              
              video.play();
              // videoContainerCp.remove("d-none")
              // console.log(userName, csData.data.data.schedule.cp_id.firstname)
              // if (userName == csData.data.data.schedule.cp_id.firstname) {
              //   videoContainerCs.classList.remove("d-none")
              //   videoGrid.append(video)
              //   const videoGridStyle = document.querySelector("#cs_vid_container video");
              //   videoGridStyle.style.width="100%"
              // } else {
              //   videoContainerCp.classList.remove("d-none")
              //   videoGridCp.append(video)
              //   const videoGridStyle = document.querySelector("#cp_vid_container video");
              //   videoGridStyle.style.width="100%"
              // }
              
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
            sessionTitle.innerHTML = `Video Session with ${cpData.data.data.cp_id.firstname}`
            // user = cpData.data.data.cp_id.firstname;
            let container_div_cs = document.getElementById('video-grid-cs');
            let countVideoCs = container_div_cs.getElementsByTagName('video').length;
            let container_div_cp = document.getElementById('video-grid-cp');
            let countVideoCp = container_div_cp.getElementsByTagName('video').length;
            if (countVideoCs == 0) {
              videoGrid.append(video)
              const videoGridStyle = document.querySelector("#cs_vid_container video");
              videoGridStyle.style.width="100%"
              if (videoGridStyle) {
                videoContainerCs.classList.remove("d-none")
              }
            }

            if (countVideoCp == 0) {
              
              videoGridCp.append(video)
              const videoGridStyle = document.querySelector("#cp_vid_container video");
              videoGridStyle.style.width="100%"
              if (videoGridStyle) {
                videoContainerCp.classList.remove("d-none")
              }
            }
            
            if (countVideoCs == 2) {
              let nameHtml = `<span class="text-white p-10 name m-13">Care provider: ${userName != "test"? userName: cpData.data.data.cp_id.firstname}</span>`;
              // videoName.innerHTML += nameHtml;
            } 

            if (countVideoCs < 3) {
              video.play();
            } else {
              document.getElementById("video-grid-cs").remove();
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
    activeVoice.style.display = "none"
    disableVoice.style.display = "block"
    // html = `<i class="fas fa-microphone-slash"></i>`;
    // muteButton.classList.toggle("background__red");
    // muteButton.innerHTML = html;
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    disableVoice.style.display = "none"
    activeVoice.style.display = "block"
    // html = `<i class="fas fa-microphone"></i>`;
    // muteButton.classList.toggle("background__red");
    // muteButton.innerHTML = html;
  }
});

stopVideo.addEventListener("click", () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  let html = '';
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    activeCamera.style.display = "none"
    disableCamera.style.display = "block"
    // html = `<i class="fas fa-video-slash"></i>`;
    // stopVideo.classList.toggle("background__red");
    // stopVideo.innerHTML = html;
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    disableCamera.style.display = "none"
    activeCamera.style.display = "block"
    
    // html = `<i class="fas fa-video"></i>`;
    // stopVideo.classList.toggle("background__red");
    // stopVideo.innerHTML = html;
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
  let current_date = new Date();
  let format_current_date = `${current_date.getFullYear()}-${current_date.getDate()}-${current_date.getMonth()}`

  messages.innerHTML =
    messages.innerHTML +
    `<div class="cp--chat--bubble mb-2">
      <label>${userName}</label>
      <div class="msg">
        ${message}
      </div>
      <div class="date-time">${format_current_date}</div>
    </div>`;

    chatBody.scrollTop = chatBody.scrollHeight;

    // `<div class="message">
    //     <b><i class="far fa-user-circle"></i> <span> ${
    //       // userName === user ? "me" : userName
    //       userName
    //     }</span> </b>
    //     <span>${message}</span>
    // </div>`;
});

// GET schedule data
const getSession = async(req, res) => {
  try {
    // console.log(Helpers.getToken("careseeker"), "token");
    if(typeof SESSION_ID != "undefined") {
      // console.log(SESSION_ID, 'session_id');
      //
      let result = await axios.get(`${path}/esafetalk/api/careseeker/session/view/${SESSION_ID}`)
      let session_date = new Date(result.data.data.schedule.date);
      
      let session_date_time = `${months[session_date.getMonth()]} ${session_date.getDate()}, ${session_date.getFullYear()}- ${result.data.data.schedule.time_start} - ${result.data.data.schedule.time_end}`
      // dateTime.innerHTML = session_date_time
      calendarDate.innerHTML = `<span>${months[session_date.getMonth()]}</span> <p>${session_date.getDate()}</p>`
      timeClock.innerHTML = `${result.data.data.schedule.time_start} - ${result.data.data.schedule.time_end}`
      startTimeCall = result.data.data.schedule.time_start
      endTimeCall = result.data.data.schedule.time_end
      
      // Set icons
      disableCamera.style.display = "none"
      activeCamera.style.display = "block"

      let format_session_date = `${session_date.getFullYear()}-${session_date.getDate()}-${session_date.getMonth()}`
      let current_date = new Date();
      let format_current_date = `${current_date.getFullYear()}-${current_date.getDate()}-${current_date.getMonth()}`
      // console.log(format_session_date, format_current_date, "ontime")
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
        let textShow = endDate < currentDate? "Video call session is about to end." : "This session will be start on"
        if (!valid) { //!valid
          // Show warning
          
          

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
          return result;
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
      console.log(result, "nunsad")

      calendarDate.innerHTML = `<span>${months[session_date.getMonth()]}</span> <p>${session_date.getDate()}</p>`
      timeClock.innerHTML = `${result.data.data.time_start} - ${result.data.data.time_end}`
      startTimeCall = result.data.data.time_start
      endTimeCall = result.data.data.time_end
      
      let format_session_date = `${session_date.getFullYear()}-${session_date.getDate()}-${session_date.getMonth()}`
      let current_date = new Date();
      let format_current_date = `${current_date.getFullYear()}-${current_date.getDate()}-${current_date.getMonth()}`

      let session_date_time = `${months[session_date.getMonth()]} ${session_date.getDate()}, ${session_date.getFullYear()}- ${result.data.data.time_start} - ${result.data.data.time_end}`
      // dateTime.innerHTML = session_date_time
      // console.log(format_current_date, format_session_date , "time condition");
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
    // console.log(result, "result")
    
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
    // console.log(currentDatePlusFiveMinutes, "current date", endDate)
    // console.log(isValid);
    if(isValid) { //valid
      warningModal.innerHTML = `<p><b>${textShow}.</b> Your session time with ${result.data.data.schedule.cp_id.nickname} will be finishing in 5minutes.</p> 
          <div class="action--btn">
            <button class="extend-btn" id="okBtn">Ok</button>
            <button class="dismiss-btn" id="dismissBtn">Dismiss</button>
          </div>`

          warningModal.style.display = "block"
          

      // Swal.fire({
      //   title: 'Info!',
      //   text: `This session will be finished in 5 minutes`,
      //   icon: 'info',
      //   showCancelButton: false,
      //   showConfirmButton: true,
      //   closeOnClickOutside: true,
      //   allowOutsideClick: false,
      //   allowEscapeKey: false,
      // })
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
    // console.log(currentDatePlusFiveMinutes, "current date", endDate)
    // console.log(isValid);
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


