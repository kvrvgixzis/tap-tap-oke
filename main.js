const cvs = document.querySelector('#canvas');
const ctx = cvs.getContext('2d');
const jumpButton = document.querySelector('.jump-btn');
const highScoreSpan = document.querySelector('#high-score');
const highScore = localStorage.getItem('highScore');

let IS_START = true;

const WORLD_WIDTH = 300;
const WORLD_HEIGHT = 350;
ctx.canvas.width = WORLD_WIDTH;
ctx.canvas.height = WORLD_HEIGHT;

const BG_COLOR = 'lightgray';
const FG_SIZE = 32;

const HERO_SIZE = 50;
const HERO_COLOR = 'black';
let HERO_POS_X = 50;
let HERO_POS_Y = WORLD_HEIGHT - HERO_SIZE - FG_SIZE;

const BOTTOM_BORDER = WORLD_HEIGHT - HERO_SIZE;
const TOP_BORDER = 0;

let JUMP_POWER = 18;
const BASE_GRAVITY = 4;
let GRAVITY = BASE_GRAVITY;

function frame() {
  if (GRAVITY < BASE_GRAVITY) GRAVITY++;
  HERO_POS_Y += GRAVITY;

  checkWorldCollision();
  drawBg();
  drawHero();

  IS_START && requestAnimationFrame(frame);
}

function drawHero() {
  ctx.fillStyle = HERO_COLOR;
  ctx.fillRect(HERO_POS_X, HERO_POS_Y, HERO_SIZE, HERO_SIZE);
}

function drawBg() {
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
}

function checkWorldCollision() {
  if (HERO_POS_Y > BOTTOM_BORDER) {
    HERO_POS_Y = BOTTOM_BORDER;
  }

  if (HERO_POS_Y < TOP_BORDER) {
    HERO_POS_Y = TOP_BORDER;
  }
}

function jump() {
  !IS_START && location.reload();

  GRAVITY -= JUMP_POWER;
}

function main() {
  highScoreSpan.innerHTML = highScore || 0;
  jumpButton.innerHTML = 'jump';

  frame();

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') jump();
  });
  jumpButton.addEventListener('click', jump);
}

main();
