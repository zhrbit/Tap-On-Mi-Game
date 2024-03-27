let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");
context.font = 'bold 30px sans-serif';
let scrollCounter, cameraY, current, mode, xSpeed;
let ySpeed = 5;
let height = 50;
let boxes = [];

// Atur kotak pertama berada di tengah
let initialBoxWidth = 200;
let initialBoxX = (canvas.width - initialBoxWidth) / 2;
boxes[0] = {
  x: initialBoxX,
  y: 300,
  width: initialBoxWidth
};
let debris = {
  x: 0,
  width: 0
};

// Tambahkan variabel untuk mengontrol kecepatan kotak
let initialXSpeed = 2;
let speedDecrement = 0.1; // Penurunan kecepatan setiap kali poin bertambah

function newBox() {
  boxes[current] = {
    x: 0,
    y: (current + 10) * height,
    width: boxes[current - 1].width
  };
}


function animate() {
  if (mode != 'gameOver') {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillText('Score: ' + (current - 1).toString(), 5, 30);
    for (let n = 0; n < boxes.length; n++) {
      let box = boxes[n];
      // Buat objek gambar baru
      let image = new Image();
      // Tentukan path gambar kustom Anda
      image.src = 'assets/b1.png'; // Ganti dengan path gambar Anda
      // Gambar gambar di atas kanvas
      context.drawImage(image, box.x, 600 - box.y + cameraY, box.width, height);
    }
   
  }
  window.requestAnimationFrame(animate);
    context.fillStyle = '#3C7FC0';
    context.fillRect(debris.x, 600 - debris.y + cameraY, debris.width, height);
    if (mode == 'bounce') {
      boxes[current].x = boxes[current].x + xSpeed;
      if (xSpeed > 0 && boxes[current].x + boxes[current].width > canvas.width)
        xSpeed = -xSpeed;
      if (xSpeed < 0 && boxes[current].x < 0)
        xSpeed = -xSpeed;
    }
    if (mode == 'fall') {
      boxes[current].y = boxes[current].y - ySpeed;
      if (boxes[current].y == boxes[current - 1].y + height) {
        mode = 'bounce';
        let difference = boxes[current].x - boxes[current - 1].x;
        if (Math.abs(difference) >= boxes[current].width) {
          gameOver();
        }
        debris = {
          y: boxes[current].y,
          width: difference
        };
        if (boxes[current].x > boxes[current - 1].x) {
          boxes[current].width = boxes[current].width - difference;
          debris.x = boxes[current].x + boxes[current].width;
        } else {
          debris.x = boxes[current].x - difference;
          boxes[current].width = boxes[current].width + difference;
          boxes[current].x = boxes[current - 1].x;
        }
        // Kurangi kecepatan setiap kali poin bertambah
        xSpeed -= speedDecrement;
        current++;
        scrollCounter = height;
        newBox();
      }
    }
    debris.y = debris.y - ySpeed;
    if (scrollCounter) {
      cameraY++;
      scrollCounter--;
    }
  }

function gameOver() {
  mode = 'gameOver';
  document.getElementById("restartScreen").style.display = "block";
  document.getElementById("score").textContent = (current - 1).toString();
  endTime = new Date(); // Record end time when game ends
  displayPlayTime(); // Panggil fungsi untuk menampilkan waktu bermain
  // Update high scores when the game is over
  updateHighScores(current - 1, endTime - startTime); // Mengirimkan durasi permainan ke fungsi updateHighScores()
}


function restart() {
  boxes.splice(1, boxes.length - 1);
  mode = 'bounce';
  cameraY = 0;
  scrollCounter = 0;
  xSpeed = initialXSpeed; // Kembalikan kecepatan awal
  current = 1;
  newBox();
  debris.y = 0;
  document.getElementById("restartScreen").style.display = "none"; // Menyembunyikan layar restart saat permainan di-restart
}

canvas.onpointerdown = function() {
  if (mode == 'gameOver') {
    restart();
  } else {
    if (mode == 'bounce')
      mode = 'fall';
  }
};

restart();
animate();

let startTime; // Variable to store start time
let endTime; // Variable to store end time

function startGame() {
    startTime = new Date(); // Record start time when game starts
    document.getElementById("splashScreen").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";
    restart();
    animate();
}


function displayPlayTime() {
    let duration = endTime - startTime; // Calculate duration in milliseconds
    let seconds = Math.floor(duration / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;
    document.getElementById("playTime").textContent = `Play Time: ${minutes} minutes ${seconds} seconds`;
}


// Initialize high scores array
let highScores = [];


function updateHighScores(score, playTime) {
    // Add the new score and play time to the high scores array
    highScores.push({score: score, playTime: playTime});
    // Sort the high scores by score in descending order
    highScores.sort((a, b) => b.score - a.score);
    // Limit the number of high scores to display
    highScores = highScores.slice(0, 5); // Display top 5 scores

    // Update the high scores list in the HTML
    let highScoreList = document.getElementById('highScores');
    highScoreList.innerHTML = '';
    highScores.forEach((item, index) => {
        let listItem = document.createElement('li');
        listItem.textContent = ` Score: ${item.score}, Play Time: ${formatPlayTime(item.playTime)}`;
        highScoreList.appendChild(listItem);
    });
}

// Function to format play time (in milliseconds) as minutes and seconds
function formatPlayTime(playTime) {
    let seconds = Math.floor(playTime / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;
    return `${minutes} minutes ${seconds} seconds`;
}


function gameOver() {
  mode = 'gameOver';
  document.getElementById("restartScreen").style.display = "block";
  document.getElementById("score").textContent = (current - 1).toString();
  endTime = new Date(); // Record end time when game ends
  displayPlayTime();
  // Update high scores when the game is over
  updateHighScores(current - 1);
}