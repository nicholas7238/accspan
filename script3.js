const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
var timeline = document.getElementById('timeline');
//const currTime = document.querySelector('#currTime');
//const durTime = document.querySelector('#durTime');

const debug = document.getElementById('debug');

const lessonNumber = 20.5;
var numOfSlides = 4; 
var imageWidth = cover.width;
var imageHeight = cover.height;
const difficultyIcon = document.getElementById('difficulty');
const difficultyArray = new Array(numOfSlides).fill(false);
const difficultyCheckbox = document.getElementById('difficultyCheckbox');
const automaticPlayCheckbox = document.getElementById('automaticPlayCheckbox');
const prevButton = document.getElementById('prevButton');
const repeatButton = document.getElementById('repeatButton');
const nextButton = document.getElementById('nextButton');
const changeQuizButton = document.getElementById('changeQuizButton');
const quizSelect = document.getElementById('quizSelect');
//difficultyArray[1] = true;
const difficultColor = "#FF0000"; // red
const defaultColor = "#888888"; // grey
const currentColor = "#00EE00"; // green

// Keep track of song
let songIndex = 0;

// Song titles
var songs = ['20.5 Quiz 0', '20.5 Quiz 1', '20.5 Quiz 2', '20.5 Quiz 3'];
//createSongsList(89);
var quizName = 'Week 4 Day 2 Quiz';
var quizAmount = 103;
var isQuizAudioOnly = true;
changeQuiz();
createSongsList(quizAmount);




var isAutomaticPlay = false;
var isCancelAutomaticPlayTimer = false;
var automaticTimeout;


//alert(imageWidth);
//readTextFile();
// Initially load song details into DOM
drawTimeLine();
loadSong(songs[songIndex]);

function createSongsList(size) {
    //let titleName = "L2 ";
    let titleName = quizName + " ";
    songs = [];
    for(var i = 0; i < size; i++) {
        songs[i] = titleName + i;
    }
    numOfSlides = size;
    //console.log(songs2);
}

function readTextFile() {
    var fr = new FileReader();
    var text;

    //var file = new File('filenames.txt');

    debug.innerText = "lol";

    fr.onload = function(e) {
        text = fr.result;
    }

    fr.readAsText('filenames.txt');
    //var lines = text.split('\n');
    //songs = lines;

    //debug.innerText = lines[0];
}

function drawRedSquare() {
    var ctx = difficultyIcon.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0,0,20,20);
}

function drawGreySquare() {
    var ctx = difficultyIcon.getContext("2d");
    ctx.fillStyle = "#888888";
    ctx.fillRect(0,0,20,20);
}

function drawDifficultySquare(isDifficult) {
    var ctx = difficultyIcon.getContext("2d");
    if(difficultyArray[songIndex]) {
        ctx.fillStyle = "#FF0000";
    } else {
        ctx.fillStyle = "#888888";
    }
    ctx.fillRect(0,0,20,20);
}

function drawTimeLine(){
    var square = timeline.getContext("2d");
    var squareWidth = cover.width / numOfSlides;
    square.fillStyle = "#888888";
    square.clearRect(0, 0, cover.width, 20)
    for(var i = 0; i < numOfSlides; i++) {
        if(difficultyArray[i]) {
            square.fillStyle = difficultColor;
        } else {
            square.fillStyle = defaultColor;
        }
        square.fillRect(i * squareWidth, 0, squareWidth - 1, 20);

        
        if(i == songIndex) {
            square.fillStyle = currentColor;
            square.fillRect(i * squareWidth, 0, squareWidth - 1, 20);
            if(difficultyArray[i]) {
                square.fillStyle = difficultColor;
            } else {
                square.fillStyle = defaultColor;
            }
            square.fillRect(i * squareWidth + 3, 0 + 3, squareWidth - 1 - 6, 20 - 6);
        }
        //alert(i);
    }

}

function markAsDifficult() {
    difficultyArray[songIndex] = difficultyCheckbox.checked;
    refreshGraphics();
}

function chooseIndexOnTimeline(e) {
    clearTimeout(automaticTimeout);
    var cRect = timeline.getBoundingClientRect();
    var canvasX = Math.round(e.clientX - cRect.left);
    //var canvasY = Math.round(document.clientY - cRect.top);

    var newSongIndex = Math.floor(canvasX / (cover.width / numOfSlides));
    //console.log(canvasX);
    console.log(newSongIndex);

    songIndex = newSongIndex;

    loadSong(songs[songIndex]);
  
    playSong();
}

function setAutomaticPlay() {
    clearTimeout(automaticTimeout);
    isAutomaticPlay = automaticPlayCheckbox.checked;
    if(isAutomaticPlay) {
        playSong();
    }
    //console.log(isAutomaticPlay);
}

function refreshGraphics() {
    drawTimeLine();
    drawDifficultySquare(true);
    difficultyCheckbox.checked = difficultyArray[songIndex];
}

// Update song details
function loadSong(song) {
  title.innerText = song;
  audio.src = `${quizName}/audio/${song}.mp3`;
  if(isQuizAudioOnly) {
    cover.src = "default_image.png";
  } else {
    cover.src = `${quizName}/images/${song}.png`;
  }
  
  //if(cover.height == 0) {
      //console.log("height: " + cover.height);
  //    cover.src = "default_image.png";
  //}
  //console.log("height: " + cover.height);

  refreshGraphics();
}

// Play song
function playSong() {
  musicContainer.classList.add('play');
  //playBtn.querySelector('i.fas').classList.remove('fa-play');
  //playBtn.querySelector('i.fas').classList.add('fa-pause');

  audio.play();
}

// Pause song
function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');

  audio.pause();
}

// Previous song
function prevSong() {
  songIndex--;

  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }

  loadSong(songs[songIndex]);

  playSong();
}

// Next song
function nextSong() {
  songIndex++;

  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }

  loadSong(songs[songIndex]);

  playSong();
}

function nextSongAutomatic() {
    if(!isCancelAutomaticPlayTimer) {
        nextSong();
    }
}

function changeQuiz() {              ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    quizName = quizSelect.value;
    quizAmount = quizSelect.options[quizSelect.selectedIndex].getAttribute('data-amount');
    if(quizSelect.options[quizSelect.selectedIndex].getAttribute('data-has-images') == "1") {
        isQuizAudioOnly = false;
    } else {
        isQuizAudioOnly = true;
    }
    cover.src = `${quizName}/images/${songs[0]}.png`;
    refreshGraphics();

    createSongsList(quizAmount);
    songIndex = 0;
    difficultyArray.fill(false);
    
    /*
    if(cover.height == 0) {
        isQuizAudioOnly = true;
    } else {
        isQuizAudioOnly = false;
    }
    */
      //console.log("height: " + cover.height);
  //    cover.src = "default_image.png";

    loadSong(songs[0]);

    //console.log(quizSelect.value);
    //console.log(quizSelect.options[quizSelect.selectedIndex].getAttribute('data-amount'));
    //console.log(quizSelect.options[quizSelect.selectedIndex].text);
}

function onAudioEnd() {
    if(isAutomaticPlay) {
        let isReadyToNextSong = false
        isCancelAutomaticPlayTimer = false;
        automaticTimeout = setTimeout(nextSong, 3000);
        //while(isReadyToNextSong)

    }
}

function repeatAudio() {}

function clearTimerAndPrevSong() {
    isCancelAutomaticPlayTimer = true;
    clearTimeout(automaticTimeout);
    prevSong();
}
function clearTimerAndNextSong() {
    isCancelAutomaticPlayTimer = true;
    clearTimeout(automaticTimeout);
    nextSong();
}
function clearTimerAndPlaySong() {
    isCancelAutomaticPlayTimer = true;
    clearTimeout(automaticTimeout);
    playSong();
}

function keyboardInput(event) {
    if(event.keyCode == 37) { // left arrow
        //alert('Left was pressed');
        isCancelAutomaticPlayTimer = true;
        clearTimeout(automaticTimeout);
        prevSong();
    }
    else if(event.keyCode == 39) { // right arrow
        //alert('Right was pressed');
        isCancelAutomaticPlayTimer = true;
        clearTimeout(automaticTimeout);
        nextSong();
    } else if(event.keyCode == 13) {// enter is 13, but space is 32
        isCancelAutomaticPlayTimer = true;
        clearTimeout(automaticTimeout);
        playSong();
    }
}
/*
// Update progress bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

// Set progress bar
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

//get duration & currentTime for Time of song
function DurTime (e) {
	const {duration,currentTime} = e.srcElement;
	var sec;
	var sec_d;

	// define minutes currentTime
	let min = (currentTime==null)? 0:
	 Math.floor(currentTime/60);
	 min = min <10 ? '0'+min:min;

	// define seconds currentTime
	function get_sec (x) {
		if(Math.floor(x) >= 60){
			
			for (var i = 1; i<=60; i++){
				if(Math.floor(x)>=(60*i) && Math.floor(x)<(60*(i+1))) {
					sec = Math.floor(x) - (60*i);
					sec = sec <10 ? '0'+sec:sec;
				}
			}
		}else{
		 	sec = Math.floor(x);
		 	sec = sec <10 ? '0'+sec:sec;
		 }
	} 

	get_sec (currentTime,sec);

	// change currentTime DOM
	currTime.innerHTML = min +':'+ sec;

	// define minutes duration
	let min_d = (isNaN(duration) === true)? '0':
		Math.floor(duration/60);
	 min_d = min_d <10 ? '0'+min_d:min_d;


	 function get_sec_d (x) {
		if(Math.floor(x) >= 60){
			
			for (var i = 1; i<=60; i++){
				if(Math.floor(x)>=(60*i) && Math.floor(x)<(60*(i+1))) {
					sec_d = Math.floor(x) - (60*i);
					sec_d = sec_d <10 ? '0'+sec_d:sec_d;
				}
			}
		}else{
		 	sec_d = (isNaN(duration) === true)? '0':
		 	Math.floor(x);
		 	sec_d = sec_d <10 ? '0'+sec_d:sec_d;
		 }
	} 

	// define seconds duration
	
	get_sec_d (duration);

	// change duration DOM
	durTime.innerHTML = min_d +':'+ sec_d;
		
};
/*
// Event listeners
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');

  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Change song
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
*/
prevButton.addEventListener('click', clearTimerAndPrevSong);
nextButton.addEventListener('click', clearTimerAndNextSong);
repeatButton.addEventListener('click', clearTimerAndPlaySong);
changeQuizButton.addEventListener('click', changeQuiz);

// Time/song update
//audio.addEventListener('timeupdate', updateProgress);

// Click on progress bar
//progressContainer.addEventListener('click', setProgress);

// Song ends
audio.addEventListener('ended', onAudioEnd);

// Time of song
//audio.addEventListener('timeupdate',DurTime);

document.addEventListener('keydown', keyboardInput);
difficultyCheckbox.addEventListener('click', markAsDifficult);
automaticPlayCheckbox.addEventListener('click', setAutomaticPlay);
timeline.addEventListener('click', chooseIndexOnTimeline);