// canvas setup
const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 600;

// game state
let isStart = false;
let isGameOver = false;
let gameOverReason = "";
let gameOverDelay = false;
let score = 0;
let highscore = 2;

// pipe stuff
const pipes = [];
const minPipeHeight = 20;
const pipeGap = 160;
const pipeWidth = 70;
const maxPipeHeight = canvas.height - pipeGap - minPipeHeight;
const pipeDistance = (canvas.width / 2) <= 300 ? (canvas.width / 2) - 50 : (canvas.width / 2) + 100;
const pipeMoveSpeed = 2.5;
const pipeSpawnRange = [pipeDistance - (pipeMoveSpeed + 2), pipeDistance];
const pipeSpawnPosition = canvas.width + (pipeWidth * 2);
let pipeGenerated = 0;

// audio collection
const audio = {
    flapAudio: null,
    hitGroundAudio: null,
    hitPipeAudio: null,
    gameOverAudio: null,
    scoreAudio: null,
}

// bird stuff
const bird = {
    positionX: 100,
    positionY: 50,
    velocityY: 0,
    gravity: 0.6,
}

document.addEventListener("DOMContentLoaded", () => {
    context.fillStyle = "green";
    context.fillRect(bird.positionX, 100, 50, 50);

    loadAudio();
    drawScore();

    window.addEventListener("keydown", (event) => {
        if (gameOverDelay === false) {
            if (event.code === "Space" && isStart === false) {
                prepareGame();

                return;
            }

            if (event.code === "Space") {
                audio.flapAudio.cloneNode().play();
                bird.velocityY = -10;

                return;
            }
        }
    });
});

function prepareGame() {
    audio.flapAudio.cloneNode().play();
    isStart = true;
    isGameOver = false;
    score = 0;
    bird.velocityY = -5;
    bird.positionY = 100;

    clearPipes();
    generatePipes();
    startGame();
}

function clearPipes() {
    pipes.length = 0;
}

function generatePipes() {
    const pipeHeight = Math.floor(
        Math.random() * (maxPipeHeight - minPipeHeight) + minPipeHeight
    );

    pipes.push({
        x: pipeSpawnPosition,
        y: 0,
        width: pipeWidth,
        height: pipeHeight,
        gap: pipeGap,
        passed: false,
        lastPipe: false,
    });
}

function startGame() {
    if (isGameOver === false) {
        if (bird.positionY >= (canvas.height - 50)) {
            isGameOver = true;
            gameOverReason = "ground";
        }

        updateGame();
        drawGame();

        requestAnimationFrame(startGame);
    } else {
        highScore = score;
        isStart = false;
        gameOverDelay = true;
        gameOverReason === "pipe" ?
            audio.hitPipeAudio.cloneNode().play() :
            audio.hitGroundAudio.cloneNode().play();

        setTimeout(() => audio.gameOverAudio.cloneNode().play(), 450);
        setTimeout(() => gameOverDelay = false, 1000);

        context.fillStyle = "red";
        context.fillRect(bird.positionX, bird.positionY, 50, 50);
    }
}

function updateGame() {
    if (isGameOver === false) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        bird.velocityY += bird.gravity;
        bird.positionY += bird.velocityY;

        for (let i = 0; i < pipes.length; i++) {
            if (pipes[i].x > pipeSpawnRange[0] && pipes[i].x < pipeSpawnRange[1]) {
                generatePipes();
                pipeGenerated++;
            }

            if (pipes[i].x + pipes[i].width < 0) {
                pipes.splice(i, 1);
            }

            if (isColliding(pipes[i])) {
                isGameOver = true;
                gameOverReason = "pipe";
            }

            if (checkScore(pipes[i]) === true) {
                audio.scoreAudio.cloneNode().play();
                pipes[i].passed = true;
                score++;

                if(score >= (highscore - 1) && score < highscore) {
                    pipes[i + 1].lastPipe = true;
                }
            }

            pipes[i].x -= pipeMoveSpeed;
        }
    }
}

function drawGame() {
    drawBird();
    drawPipe();
    drawScore();
}

function drawBird() {
    context.fillStyle = "yellow";
    context.fillRect(bird.positionX, bird.positionY, 50, 50);
}

function drawPipe() {
    for (let i = 0; i < pipes.length; i++) {
        if(pipes[i].lastPipe === true) {
            context.fillStyle = "blue";
        } else {
            context.fillStyle = "green";
        }

        context.fillRect(pipes[i].x, pipes[i].y, pipes[i].width, pipes[i].height); // pipe atas
        context.fillRect(
            pipes[i].x,
            (pipes[i].height + pipes[i].gap),
            pipes[i].width,
            canvas.height - (pipes[i].height + pipes[i].gap)
        ); //  pipe bawah
    }
}

function drawScore() {
    context.font = "40px Arial";
    context.textAlign = "center";
    context.fillStyle = "black";
    context.fillText(score, canvas.width / 2, 50);

    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.strokeText(score, canvas.width / 2, 50);
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

function checkScore(pipe) {
    if (pipe.x + pipe.width < bird.positionX && pipe.passed === false) {
        return true;
    }
}

function loadAudio() {
    audio.hitGroundAudio = new Audio("./sounds/hit-ground.wav");
    audio.hitPipeAudio = new Audio("./sounds/hit-pipe.wav");
    audio.gameOverAudio = new Audio("./sounds/gameover.wav");
    audio.flapAudio = new Audio("./sounds/bird-flap.wav");
    audio.scoreAudio = new Audio("./sounds/score.wav");
}