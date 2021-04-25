const canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

const bird = new Image();
const background = new Image();
const foreground = new Image();
const pipeBottom = new Image();
const pipeUp = new Image();
const homePage = new Image();
const losePage = new Image();

const flyAudio = new Audio();
const scoreAudio = new Audio();

bird.src = "img/bird.png";
background.src = "img/background.png";
foreground.src = "img/foreground.png";
pipeBottom.src = "img/pipeBottom.png";
pipeUp.src = "img/pipeUp.png";
homePage.src = "img/homePage.jpg";
losePage.src = "img/losePage.jpg";

flyAudio.src = "audio/fly.mp3";
scoreAudio.src = "audio/score.mp3";

document.addEventListener("keydown", keyDown);

function keyDown() {
   yBirdPosition -= 40;
   flyAudio.play();
   if (isStopped) {
      isStopped = false;
      draw();
   }
}

const pipes = [];

pipes[0] = {
   x: canvas.clientWidth,
   y: 0,
}

const gap = 90;
const xBirdPosition = 10;
let yBirdPosition = 190;
const gravity = 2;
let score = 0;
let isStopped = true;

function draw() {
   context.drawImage(background, 0, 0);
   for (let i = 0; i < pipes.length; ++i) {
      context.drawImage(pipeUp, pipes[i].x, pipes[i].y);
      context.drawImage(pipeBottom, pipes[i].x, pipeUp.height + gap + pipes[i].y);

      --pipes[i].x;

      if (pipes[i].x === 125) {
         console.log("new");
         pipes.push({
            x: canvas.width,
            y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height,
         });
      }

      if (xBirdPosition + bird.width - 5 >= pipes[i].x
         && xBirdPosition <= pipes[i].x + pipeUp.width - 5
         && (yBirdPosition <= pipes[i].y + pipeUp.height - 5
            || yBirdPosition + bird.height - 5 >= pipes[i].y + pipeUp.height + gap)
         || yBirdPosition + bird.height - 5 >= canvas.height - foreground.height) {

         yBirdPosition = 190;
         init();
         return;

      }

      if (pipes[i].x === 5) {
         ++score;
         scoreAudio.play();
      }
   }

   context.drawImage(foreground, 0, canvas.height - foreground.height);
   context.drawImage(bird, xBirdPosition, yBirdPosition);


   context.fillText("Your score: " + score, 10, canvas.height - 20);

   yBirdPosition += gravity;
   requestAnimationFrame(draw);
}

function showLosePage() {
   location.reload();
   context.drawImage(losePage, 0, 0);

   isStopped = true;
}

function init() {

   isStopped = true;
   context.drawImage(homePage, 0, 0);
   context.fillStyle = "#000";
   context.font = "24px Verdana";
   context.fillText("Your score: " + score, 60, canvas.height - 50);
   score = 0;
   pipes.length = 0;
   pipes.push({
      x: canvas.clientWidth,
      y: 0,
   });
}
window.onload = init;