<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tap-On Mi Game</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="game-wrapper">
        <div id="splashScreen" class="splash">
            <h1 class="splash-title">Welcome to Tap-On Mi Game</h1>
            <button class="start-btn" onclick="startGame()">Start Game</button>
        </div>
        <div id="gameContainer" class="container" style="display: none;">
            <h1 class="title">Tap-On Mi Game</h1>
            <canvas id="myCanvas" width="600" height="400"></canvas>
        </div>
        <div id="restartScreen" class="restart-screen" style="display: none;">
            <h1 class="restart-title">Game Over</h1>
            <p class="restart-message">Your Score: <span id="score"></span></p>
            <p class="play-time" id="playTime"></p> <!-- Added play time display -->
            <button class="restart-btn" onclick="restart()">Restart</button>
            <div id="highScoreList">
                <h2>High Scores</h2>
                <ol id="highScores">
                    <!-- High score items will be dynamically added here -->
                </ol>
            </div>
        </div>
    </div>
    
    <script src="script.js"></script>
</body>
</html>
