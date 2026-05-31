const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 550;

let isStart = false;
const pipes = [];
const minPipeHeight = 20;
const pipeGap = 155;
const pipeWidth = 70;
const maxPipeHeight = canvas.height - pipeGap - minPipeHeight;
const pipeDistance = (canvas.width / 2) <= 300 ? (canvas.width / 2) - 50 : (canvas.width / 2) + 100;
const pipeMoveSpeed = 2.5;
const pipeSpawnRange = [pipeDistance - (pipeMoveSpeed + 2), pipeDistance];

const bird = {
    positionX: 100,
    positionY: 50,
    flapAudio: null,
    hitGroundAudio: null,
    gameOverAudio: null,
    velocityY: 0,
    gravity: 0.6,
}

document.addEventListener("DOMContentLoaded", () => {
    context.fillStyle = "green";
    context.fillRect(bird.positionX, 100, 50, 50);

    loadAudio();

    window.addEventListener("keydown", (event) => {
        if (event.code === "Space" && isStart === false) {
            prepareGame();

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
        setTimeout(() => bird.gameOverAudio.cloneNode().play(), 450);

        isStart = false;
        context.fillStyle = "red";
        context.fillRect(bird.positionX, bird.positionY, 50, 50);

        return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    bird.velocityY += bird.gravity;
    bird.positionY += bird.velocityY;

    context.fillRect(bird.positionX, bird.positionY, 50, 50);

    for (let i = 0; i < pipes.length; i++) {
        if (pipes[i].x > pipeSpawnRange[0] && pipes[i].x < pipeSpawnRange[1]) {
            generatePipes();
        }

        if (pipes[i].x + pipes[i].width < 0) {
            pipes.splice(i, 1);
        }

        if (isColliding(pipes[i])) {
            isStart = false;
            bird.gameOverAudio.cloneNode().play();
            context.fillStyle = "red";
            context.fillRect(bird.positionX, bird.positionY, 50, 50)

            return;
        }

        pipes[i].x -= pipeMoveSpeed;

        context.fillRect(pipes[i].x, pipes[i].y, pipes[i].width, pipes[i].height); // pipe atas
        context.fillRect(
            pipes[i].x,
            (pipes[i].height + pipes[i].gap),
            pipes[i].width,
            canvas.height - (pipes[i].height + pipes[i].gap)
        ); //  pipe bawah
    }

    requestAnimationFrame(startGame);
}

function isColliding(pipe) {
    const birdRect = {
        x: bird.positionX,
        y: bird.positionY,
        width: 50,
        height: 50
    };

    return (
        birdRect.x < pipe.x + pipe.width &&
        birdRect.x + birdRect.width > pipe.x &&
        (birdRect.y < pipe.y + pipe.height || birdRect.y + birdRect.height > pipe.y + pipe.height + pipe.gap)
    );
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
    bird.gameOverAudio = new Audio("./sounds/gameover.wav");
}

function prepareGame() {
    bird.flapAudio.cloneNode().play();
    context.fillStyle = "blue";
    isStart = true;
    bird.velocityY = -5;
    bird.positionY = 100;

    clearPipes();
    generatePipes();
    startGame();
}