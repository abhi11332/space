const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("start-screen");
const gameOverScreen = document.getElementById("game-over");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const highscoreEl = document.getElementById("highscore");
const finalScoreEl = document.getElementById("final-score");

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const restartBtn = document.getElementById("restart-btn");
const playAgainBtn = document.getElementById("play-again");
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");

let player, obstacles, score, level, gameOver, paused, speed;
let highscore = localStorage.getItem("space_dodger_highscore") || 0;
highscoreEl.textContent = highscore;

function init() {
  player = { x: canvas.width / 2 - 15, y: canvas.height - 50, size: 30 };
  obstacles = [];
  score = 0;
  level = 1;
  speed = 2;
  gameOver = false;
  paused = false;
}

function drawPlayer() {
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

function drawObstacles() {
  ctx.fillStyle = "#e63946";
  for (let obs of obstacles) {
    ctx.fillRect(obs.x, obs.y, obs.size, obs.size);
  }
}

function updateObstacles() {
  for (let obs of obstacles) {
    obs.y += speed;
  }
  obstacles = obstacles.filter(obs => obs.y < canvas.height);
  if (Math.random() < 0.03 + level * 0.005) {
    obstacles.push({
      x: Math.random() * (canvas.width - 30),
      y: -30,
      size: 30,
    });
  }
}

function detectCollision() {
  for (let obs of obstacles) {
    if (
      player.x < obs.x + obs.size &&
      player.x + player.size > obs.x &&
      player.y < obs.y + obs.size &&
      player.y + player.size > obs.y
    ) {
      gameOver = true;
    }
  }
}

function updateScore() {
  score++;
  if (score % 500 === 0) {
    level++;
    speed += 0.5;
  }
}

function drawHUD() {
  scoreEl.textContent = score;
  levelEl.textContent = level;
}

function gameLoop() {
  if (gameOver || paused) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  updateObstacles();
  drawObstacles();
  detectCollision();
  updateScore();
  drawHUD();

  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  } else {
    endGame();
  }
}

function endGame() {
  finalScoreEl.textContent = score;
  gameOverScreen.classList.add("active");
  if (score > highscore) {
    localStorage.setItem("space_dodger_highscore", score);
    highscoreEl.textContent = score;
  }
}

function movePlayer(dir) {
  const step = 20;
  player.x += dir * step;
  if (player.x < 0) player.x = 0;
  if (player.x > canvas.width - player.size) player.x = canvas.width - player.size;
}

// 🎮 Controls
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" || e.key === "a") movePlayer(-1);
  if (e.key === "ArrowRight" || e.key === "d") movePlayer(1);
});

leftBtn.addEventListener("click", () => movePlayer(-1));
rightBtn.addEventListener("click", () => movePlayer(1));

pauseBtn.addEventListener("click", () => {
  paused = !paused;
  if (!paused) gameLoop();
});

restartBtn.addEventListener("click", () => {
  init();
  gameLoop();
});

startBtn.addEventListener("click", () => {
  startScreen.classList.remove("active");
  init();
  gameLoop();
});

playAgainBtn.addEventListener("click", () => {
  gameOverScreen.classList.remove("active");
  init();
  gameLoop();
});
