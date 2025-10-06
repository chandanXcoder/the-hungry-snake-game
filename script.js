const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let direction = 'RIGHT';
let food = { x: 15, y: 15 };
let score = 0;
let powerUp = { x: 5, y: 5 };
let poison = { x: 8, y: 8 };
let powerUpActive = false;
let powerUpTimer = 0;

const emojis = {
  head: '🐸',
  body: '🟩',
  food: ['🍎', '🍌', '🍇', '🍉'],
  star: '⭐',
  poison: '☠️'
};

function randomPosition() {
  return {
    x: Math.floor(Math.random() * (canvas.width / gridSize)),
    y: Math.floor(Math.random() * (canvas.height / gridSize))
  };
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
  if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
});

function drawEmoji(text, x, y) {
  ctx.font = `${gridSize}px Arial`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(text, x * gridSize, y * gridSize);
}

function drawGame() {
  ctx.fillStyle = '#1e1e1e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const fruitEmoji = emojis.food[score % emojis.food.length];
  drawEmoji(fruitEmoji, food.x, food.y);
  drawEmoji(emojis.star, powerUp.x, powerUp.y);
  drawEmoji(emojis.poison, poison.x, poison.y);

  const head = { ...snake[0] };
  if (direction === 'UP') head.y--;
  if (direction === 'DOWN') head.y++;
  if (direction === 'LEFT') head.x--;
  if (direction === 'RIGHT') head.x++;

  if (
    head.x < 0 || head.x >= canvas.width / gridSize ||
    head.y < 0 || head.y >= canvas.height / gridSize ||
    snake.some((segment, i) => i !== 0 && segment.x === head.x && segment.y === head.y)
  ) {
    playGameOverSound();
    alert('Game Over! Score: ' + score);
    resetGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = randomPosition();
    playEatSound();
  } else if (head.x === powerUp.x && head.y === powerUp.y) {
    score += 5;
    powerUpActive = true;
    powerUpTimer = 100;
    powerUp = randomPosition();
  } else if (head.x === poison.x && head.y === poison.y) {
    score = Math.max(0, score - 3);
    snake.pop();
    poison = randomPosition();
  } else {
    snake.pop();
  }

  if (powerUpActive) {
    powerUpTimer--;
    if (powerUpTimer <= 0) {
      powerUpActive = false;
    }
  }

  snake.forEach((segment, index) => {
    const emoji = index === 0 ? emojis.head : emojis.body;
    drawEmoji(emoji, segment.x, segment.y);
  });

  ctx.fillStyle = '#fff';
  ctx.font = '16px Comic Sans MS';
  ctx.fillText('Score: ' + score, 10, canvas.height - 20);
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = 'RIGHT';
  score = 0;
  food = randomPosition();
  powerUp = randomPosition();
  poison = randomPosition();
  powerUpActive = false;
  clearInterval(gameInterval);
  gameInterval = setInterval(drawGame, parseInt(speedInput.value));
}

// Controls
const speedInput = document.getElementById('speed');
let gameInterval = setInterval(drawGame, parseInt(speedInput.value));

speedInput.addEventListener('change', () => {
  const speed = parseInt(speedInput.value);
  if (!isNaN(speed) && speed >= 50 && speed <= 1000) {
    clearInterval(gameInterval);
    gameInterval = setInterval(drawGame, speed);
  }
});

// Volume control
const volumeInput = document.getElementById('volume');
const bgMusic = document.getElementById('bg-music');
const eatSound = document.getElementById('eat-sound');
const gameoverSound = document.getElementById('gameover-sound');

volumeInput.addEventListener('input', () => {
  const vol = parseFloat(volumeInput.value);
  [bgMusic, eatSound, gameoverSound].forEach(audio => {
    audio.volume = vol;
  });
});

document.body.addEventListener('click', () => {
  if (bgMusic.paused) bgMusic.play();
});

window.addEventListener('load', () => {
  bgMusic.volume = parseFloat(volumeInput.value);
  bgMusic.play().catch(() => {
    console.log('Autoplay prevented. User interaction required.');
  });
});

function playEatSound() {
  eatSound.currentTime = 0;
  eatSound.play();
}

function playGameOverSound() {
  gameoverSound.currentTime = 0;
  gameoverSound.play(1);
}

function changeDirection(dir) {
  switch (dir) {
    case "up": /* move up */ break;
    case "down": /* move down */ break;
    case "left": /* move left */ break;
    case "right": /* move right */ break;
  }
}

function changeDirection(dir) {
  if (dir === 'up' && direction !== 'DOWN') direction = 'UP';
  else if (dir === 'down' && direction !== 'UP') direction = 'DOWN';
  else if (dir === 'left' && direction !== 'RIGHT') direction = 'LEFT';
  else if (dir === 'right' && direction !== 'LEFT') direction = 'RIGHT';
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // पहली बार call करें

canvas.addEventListener("touchstart", handleTouchStart);
canvas.addEventListener("touchmove", handleTouchMove);
