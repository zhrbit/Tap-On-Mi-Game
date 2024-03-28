let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");
context.font = 'bold 30px sans-serif';
let scrollCounter, cameraY, current, mode, xSpeed;
let ySpeed = 5;
let height = 50;
let boxes = [];
let initialXSpeed = 2;
let speedDecrement = 0.1; 

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



function newBox() {
  boxes[current] = {
    x: 0,
    y: (current + 10) * height,
    width: boxes[current - 1].width
  };
}

// Array untuk menyimpan path gambar kustom Anda
let imagePaths = ['assets/b1.png', 'assets/b2.png', 'assets/b3.png', 'assets/b4.png', 'assets/b5.png', 'assets/b6.png', ]; // Ganti dengan path gambar Anda

// Array untuk menyimpan objek gambar
let images = [];

// Mengisi array images dengan objek gambar dari path gambar
for (let i = 0; i < imagePaths.length; i++) {
  let image = new Image();
  image.src = imagePaths[i];
  images.push(image);
}

// Indeks untuk melacak gambar mana yang akan digambar selanjutnya
let currentImageIndex = 0;

function drawNextImage(box) {
  let currentImage = images[currentImageIndex];
  context.drawImage(currentImage, box.x, 600 - box.y + cameraY, box.width, height);
  // Pindah ke gambar berikutnya dalam array, lakukan loop jika mencapai akhir array
  currentImageIndex = (currentImageIndex + 1) % images.length;
}


function animate() {
  if (mode != 'gameOver') {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillText('Score: ' + (current - 1).toString(), 5, 30);
    for (let n = 0; n < boxes.length; n++) {
      let box = boxes[n];
      // Panggil fungsi untuk menggambar gambar selanjutnya dengan parameter box
      drawNextImage(box);
    }
    context.fillStyle = '#296928';
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
        // Tambahkan kecepatan setiap kali poin bertambah
        xSpeed -= speedDecrement;
        current++;
        scrollCounter = height;
        newBox();
        // Putar audio saat blok jatuh
        document.getElementById('fallSound').play();
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
  document.getElementById("restartScreen").style.display = "block";
  document.getElementById("score").textContent = (current - 1).toString();
  updateAndDisplayHighScores(current - 1); // Update and display high scores
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

  // Hapus high scores dari penyimpanan lokal saat memulai permainan
  localStorage.removeItem('highScores');
}

// Initialize high scores array
let highScores = [];

function displayHighScores() {
    // Perbarui tampilan HTML dengan skor tertinggi
    let highScoreList = document.getElementById('highScores');
    highScoreList.innerHTML = '';
    highScores.forEach((item, index) => {
        let listItem = document.createElement('li');
        listItem.textContent = `Score: ${item.score}`;
        highScoreList.appendChild(listItem);
    });
}


function updateHighScores(score) {
    // Add the new score and play time to the high scores array
    highScores.push({score: score});
    // Sort the high scores by score in descending order
    highScores.sort((a, b) => b.score - a.score);
    // Limit the number of high scores to display
    highScores = highScores.slice(0, 3); // Display top 5 scores

    // Perbarui tampilan skor tertinggi
    displayHighScores();
}

// Function to save high scores to local storage
function saveHighScores() {
  localStorage.setItem('highScores', JSON.stringify(highScores));
}

// Function to load high scores from local storage
function loadHighScores() {
  let storedScores = localStorage.getItem('highScores');
  if (storedScores) {
      highScores = JSON.parse(storedScores);
  }
}

// Function to update and display high scores
function updateAndDisplayHighScores(score) {
  updateHighScores(score);
  displayHighScores();
  saveHighScores();
}

