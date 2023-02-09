const cvs = document.querySelector('#canvas');
const ctx = cvs.getContext('2d');
const jumpButton = document.querySelector('.jump-btn');
const highScoreSpan = document.querySelector('#high-score');
const scoreSpan = document.querySelector('#score');
const highScore = localStorage.getItem('highScore');

let SCORE = 0;

const BGImage = new Image();
BGImage.src = '/static/bg.png';

const HEROImage = new Image();
HEROImage.src = '/static/hero.png';

const ENTITYImage = new Image();
ENTITYImage.src = '/static/entity.png';

const BAD_ENTITYImage = new Image();
BAD_ENTITYImage.src = '/static/bad-entity.png';

let IS_START = true;

const SPEED = 1;

const WORLD_WIDTH = 300;
const WORLD_HEIGHT = 350;
ctx.canvas.width = WORLD_WIDTH;
ctx.canvas.height = WORLD_HEIGHT;

const GAP_VERTICAL = WORLD_HEIGHT / 10;

const HERO_SIZE = 30;
let HERO_POS_X = 25;
let HERO_POS_Y = (WORLD_HEIGHT - HERO_SIZE) / 2;

const ENTITY_SIZE = 20;

const BOTTOM_BORDER = WORLD_HEIGHT - HERO_SIZE;
const TOP_BORDER = 0;

let JUMP_POWER = 10;
const BASE_GRAVITY = 1.5;
const MIN_GRAVITY = BASE_GRAVITY - JUMP_POWER;
let GRAVITY = BASE_GRAVITY;

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomEntityY() {
  return randomIntFromInterval(
    0 + GAP_VERTICAL,
    WORLD_HEIGHT - ENTITY_SIZE - GAP_VERTICAL
  );
}

function randomBadEntity() {
  const random = randomIntFromInterval(0, 10);
  return random === 3;
}

let ENTITIES = [];

function createEntity({
  x = WORLD_WIDTH + WORLD_WIDTH,
  y = 0,
  width = ENTITY_SIZE,
  height = ENTITY_SIZE,
}) {
  ENTITIES.push({
    x,
    y,
    width,
    height,
    isBad: randomBadEntity(),
  });
}

function frame() {
  if (GRAVITY < BASE_GRAVITY) GRAVITY += 0.5;
  HERO_POS_Y += GRAVITY;

  checkWorldCollision();
  drawBg();
  drawHero();
  drawAndMoveEntities();

  IS_START && requestAnimationFrame(frame);
}

function drawAndMoveEntities() {
  ENTITIES = [...ENTITIES]
    .map((entity) => {
      ctx.drawImage(
        entity.isBad ? BAD_ENTITYImage : ENTITYImage,
        entity.x,
        entity.y,
        entity.width,
        entity.height
      );

      return { ...entity, x: entity.x - SPEED };
    })
    .filter((entity) => {
      const isCollect = checkCollisionWithHero(entity);

      if (isCollect) {
        if (entity.isBad) {
          decreaseScore();
        } else {
          increaseScore();
        }

        return false;
      }

      return true;
    });
}

function increaseScore() {
  SCORE += 1;

  if (SCORE > highScore) {
    localStorage.setItem('highScore', SCORE);
    highScoreSpan.textContent = SCORE;
  }

  scoreSpan.textContent = SCORE;
}

function decreaseScore() {
  SCORE -= 3;

  if (SCORE > highScore) {
    localStorage.setItem('highScore', SCORE);
    highScoreSpan.textContent = SCORE;
  }

  scoreSpan.textContent = SCORE;
}

function drawHero() {
  ctx.drawImage(
    HEROImage,
    HERO_POS_X,
    HERO_POS_Y,
    HERO_SIZE,
    HERO_SIZE
  );
}

function checkCollisionWithHero({ x, y, width, height }) {
  if (
    HERO_POS_X < x + width &&
    HERO_POS_X + HERO_SIZE > x &&
    HERO_POS_Y < y + height &&
    HERO_SIZE + HERO_POS_Y > y
  ) {
    console.log('Collision!');
    return true;
  }
}

function drawBg() {
  ctx.drawImage(BGImage, 0, 0, WORLD_WIDTH, WORLD_HEIGHT);
}

function checkWorldCollision() {
  if (HERO_POS_Y > BOTTOM_BORDER) {
    HERO_POS_Y = BOTTOM_BORDER;
  }

  if (HERO_POS_Y < TOP_BORDER) {
    HERO_POS_Y = TOP_BORDER;
    GRAVITY = BASE_GRAVITY;
  }
}

function jump() {
  !IS_START && location.reload();

  GRAVITY = MIN_GRAVITY;
}

function main() {
  highScoreSpan.textContent = highScore || 0;
  jumpButton.innerHTML = 'jump';

  frame();

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') jump();
  });
  jumpButton.addEventListener('click', jump);

  document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyF') createEntity({ y: randomEntityY() });
  });

  setInterval(() => {
    createEntity({ y: randomEntityY() });
  }, 250);
}

main();
