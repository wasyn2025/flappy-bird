const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
canvas.width = 300;
canvas.height = 550;
canvas.style.border = "2px solid black";
canvas.style.margin = "30px auto";
canvas.style.display = "block";

let gameOverAudio = null;
let birdPositionY = 0;
let isStart = false;
const pipes = [];
const minPipeHeight = 20;
const pipeGap = 155;
const pipeWidth = 70;
const maxPipeHeight = canvas.height - pipeGap - minPipeHeight;

const bird = {
    positionX: 100,
    positionY: 50,
    flapAudio: null,
    hitGroundAudio: null,
    velocityY: 0,
    gravity: 0.6,
}

document.addEventListener("DOMContentLoaded", () => {
    context.fillStyle = "green";
    context.fillRect(bird.positionX, 100, 50, 50);

    loadAudio();

    window.addEventListener("keydown", (event) => {
        if (event.code === "Space" && isStart === false) {
            bird.flapAudio.cloneNode().play();
            context.fillStyle = "blue";
            isStart = true;
            bird.velocityY = -5;
            bird.positionY = 100;
            clearPipes();
            generatePipes();
            startGame();

            return;
        }

        if (event.code === "Space") {
            bird.flapAudio.cloneNode().play();
            bird.velocityY = -10;

            return;
        }

    });
});

function startGame() {
    if (bird.positionY >= (canvas.height - 50)) {
        bird.hitGroundAudio.cloneNode().play();
        setTimeout(() => gameOverAudio.cloneNode().play(), 450);

        isStart = false;
        context.fillStyle = "red";
        context.fillRect(bird.positionX, bird.positionY, 50, 50);

        return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    bird.velocityY += bird.gravity;
    bird.positionY += bird.velocityY;

    pipes[0].x -= 3;

    if (pipes[0].x + pipes[0].width < 0) {
        pipes.shift();
        generatePipes();
    }

    context.fillRect(bird.positionX, bird.positionY, 50, 50);
    context.fillRect(pipes[0].x, pipes[0].y, pipes[0].width, pipes[0].height); // pipe atas
    context.fillRect(
        pipes[0].x,
        (pipes[0].height + pipes[0].gap),
        pipes[0].width,
        canvas.height - (pipes[0].height + pipes[0].gap)
    ); //  pipe bawah

    requestAnimationFrame(startGame);
}

function generatePipes() {
    const pipeHeight = Math.floor(
        Math.random() * (maxPipeHeight - minPipeHeight) + minPipeHeight
    );

    pipes.push({
        x: canvas.width,
        y: 0,
        width: pipeWidth,
        height: pipeHeight,
        gap: pipeGap,
    });
}

function clearPipes() {
    pipes.length = 0;
}

function loadAudio() {
    bird.hitGroundAudio = new Audio("./sounds/hit-ground.wav");
    bird.flapAudio = new Audio("./sounds/bird-flap.wav");
    gameOverAudio = new Audio("./sounds/gameover.wav");
}