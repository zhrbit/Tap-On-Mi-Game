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
      context.fillStyle = 'rgb(' + n * 16 + ',' + n * 16 + ',' + n * 16 + ')';
      context.fillRect(box.x, 600 - box.y + cameraY, box.width, height);
    }
    context.fillStyle = 'blue';
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
  window.requestAnimationFrame(animate);
}

function gameOver() {
  mode = 'gameOver';
  document.getElementById("restartScreen").style.display = "block"; // Menampilkan layar restart saat game over
  document.getElementById("score").textContent = (current - 1).toString(); // Menampilkan skor pada layar restart
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

function startGame() {
  document.getElementById("splashScreen").style.display = "none";
  document.getElementById("gameContainer").style.display = "block";
  restart();
  animate();
}

// Initialize high scores array
let highScores = [];

function updateHighScores(score) {
    // Add the new score to the high scores array
    highScores.push(score);
    // Sort the high scores in descending order
    highScores.sort((a, b) => b - a);
    // Limit the number of high scores to display
    highScores = highScores.slice(0, 5); // Display top 5 scores

    // Update the high scores list in the HTML
    let highScoreList = document.getElementById('highScores');
    highScoreList.innerHTML = '';
    highScores.forEach((score, index) => {
        let listItem = document.createElement('li');
        listItem.textContent = `${score}`;
        highScoreList.appendChild(listItem);
    });
}

function gameOver() {
    mode = 'gameOver';
    document.getElementById("restartScreen").style.display = "block";
    document.getElementById("score").textContent = (current - 1).toString();
    
    // Update high scores when the game is over
    updateHighScores(current - 1);
}
