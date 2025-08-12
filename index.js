let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".recode-btn-container");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-container");
let captureBtn = document.querySelector(".capture-btn");
let transparentColor = "transparent-screen"

let recodeFlag = false;

let recoder;
let chucks = [];

// Requesting access to the user's camera and microphone
let constraints = {
  audio: true,
  video: true,
};

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  video.srcObject = stream;

  recoder = new MediaRecorder(stream);
  recoder.addEventListener("start", (e) => {
    chucks = [];
  });

  recoder.addEventListener("dataavailable", (e) => {
    chucks.push(e.data);
  });

  recoder.addEventListener("stop", (e) => {
    let blob = new Blob(chucks, { type: "video/mp4" });
    let videoURL = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = videoURL;
    a.download = "stream.mp4";
    a.click();
  });

  recordBtnCont.addEventListener("click", (e) => {
    if (!recoder) return;

    recodeFlag = !recodeFlag;
    if (recodeFlag) {
      recoder.start();
      recordBtnCont.classList.add("scale-record");
      startTimer();
    } else {
      recoder.stop();
      recordBtnCont.classList.remove("scale-record");
      stopTimer();
    }
  });
});

let timerID;
let counter = 0;
let timer = document.querySelector(".timer");
function startTimer() {
  timer.style.display = "block";

  function displayTimer() {
    let totalseconds = counter;
    let hour = Number.parseInt(totalseconds / 3600);
    totalseconds = totalseconds % 3600;
    let min = Number.parseInt(totalseconds / 60);
    totalseconds = totalseconds % 60;
    let sec = totalseconds;

    

    hour = hour < 10 ? `0${hour}` : hour;
    min = min < 10 ? `0${min}` : min;
    sec = sec < 10 ? `0${sec}` : sec;

    timer.innerText = `${hour}:${min}:${sec}`;
    
    counter++;
  }
  timerID = setInterval(displayTimer, 1000);

}

 

  function stopTimer() {
    clearInterval(timerID);
    timer.innerText = "00:00:00";
    timer.style.display = "none";
  }

captureBtnCont.addEventListener("click", (e) => {
  captureBtnCont.classList.add("scale-capture");
  let canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  let tool = canvas.getContext("2d");
  tool.drawImage(video, 0, 0, canvas.width, canvas.height);

  tool.fillStyle = transparentColor;
  tool.fillRect(0, 0, canvas.width, canvas.height);

  let imgURL = canvas.toDataURL();
  let a = document.createElement("a");
  a.href = imgURL;
  a.download = "image.jpg";
  a.click();

  setTimeout(() => {
    captureBtn.classList.remove("scale-capture");
  },500);
  
 
});

// filtering loigc
let filter = document.querySelector(".filter-layer");

let allFilters = document.querySelectorAll(".filter");
allFilters.forEach((filterElem) => {
  filterElem.addEventListener("click", (e) => {
    // get style 
    transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
    filter.style.backgroundColor = transparentColor;
  });
});