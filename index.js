let score = 0;
let timeLeft = 30;
let comboStreak = 0;
let moleTimer = null;
let countdownTimer = null;

//sounds
const whackSound = new Audio("sounds/whack.mp3");
const boomSound = new Audio("sounds/boom.mp3");
const missSound = new Audio("sounds/miss.mp3");
const startSound = new Audio("sounds/start.mp3");
const gameOverSound = new Audio("sounds/gameover.mp3");

const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const holes = document.querySelectorAll(".hole");
const gamePad = document.getElementById("whack-a-mole");

const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");

function startGame() {
  if (moleTimer || countdownTimer) return; // ✅ prevent duplicate start
  startSound.play();
  moleTimer = setInterval(() => {
    // Remove all moles and bombs before placing new one
    holes.forEach((hole) => hole.classList.remove("mole", "bomb"));

    const randomIndex = Math.floor(Math.random() * holes.length);
    const randomHole = holes[randomIndex];

    // 80% chance of mole, 20% chance of bomb
    if (Math.random() < 0.2) {
      randomHole.classList.add("bomb");
    } else {
      randomHole.classList.add("mole");
    }
    setTimeout(() => randomHole.classList.remove("mole", "bomb"), 1000);
  }, 1000);

  countdownTimer = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = `Time: ${timeLeft}`;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  startBtn.disabled = true;
  pauseBtn.disabled = false;
  resetBtn.disabled = false;
}

function pauseGame() {
  clearInterval(moleTimer);
  clearInterval(countdownTimer);
  moleTimer = null;
  countdownTimer = null;

  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function resetGame() {
  clearInterval(moleTimer);
  clearInterval(countdownTimer);
  moleTimer = null;
  countdownTimer = null;

  holes.forEach((hole) => hole.classList.remove("mole", "bomb"));

  score = 0;
  timeLeft = 30;
  comboStreak = 0;
  scoreDisplay.innerText = score;
  timerDisplay.innerText = `Time: ${timeLeft}`;

  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resetBtn.disabled = true;
}

function endGame() {
  clearInterval(moleTimer);
  clearInterval(countdownTimer);
  moleTimer = null;
  countdownTimer = null;

  holes.forEach((hole) => hole.classList.remove("mole", "bomb"));
  gameOverSound.play();
  // Show cartoon score modal
  const modal = document.getElementById("score-modal");
  const finalScore = document.getElementById("final-score");
  finalScore.innerText = score;
  modal.classList.remove("hidden");

  // Disable buttons
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resetBtn.disabled = true;
}

gamePad.addEventListener("click", (e) => {
  const target = e.target;

  if (target.classList.contains("mole")) {
    target.classList.remove("mole");
    comboStreak++;
    score += comboStreak >= 3 ? 3 : 1;
    whackSound.play();
  } else if (target.classList.contains("bomb")) {
    target.classList.remove("bomb");
    comboStreak = 0;
    score -= 3;
    boomSound.play();
    if (score < 0) score = 0;
  } else if (target.classList.contains("hole")) {
    if (score > 0) score--;
    comboStreak = 0;
    missSound.play();
  }

  scoreDisplay.innerText = score;
});

// Button events
startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", pauseGame);
resetBtn.addEventListener("click", resetGame);

// Initial state
pauseBtn.disabled = true;
resetBtn.disabled = true;

document.getElementById("play-again").addEventListener("click", () => {
  document.getElementById("score-modal").classList.add("hidden");
  resetGame();
});
