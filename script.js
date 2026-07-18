import * as Draw from "./draw.js";
import * as Pipe from "./pipe.js";
import * as Asset from "./asset.js";
import * as Util from "./util.js";

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
context.imageSmoothingEnabled = false;
canvas.width = 400;
canvas.height = 650;

let isStart = false;
let isGameOver = false;
let gameOverReason = "";
let gameOverDelay = false;
let score = 0;
let highscore = 0;

const pipes = [];
const minPipeHeight = 20;
const pipeGap = 140;
const pipeWidth = 70;
const pipeMoveSpeed = 2.8;
const maxPipeHeight = canvas.height - pipeGap - minPipeHeight;
const pipeDistance = (canvas.width / 2) <= 300 ? (canvas.width / 2) - 50 : (canvas.width / 2) + 100;
const pipeSpawnRange = [pipeDistance - (pipeMoveSpeed + 2), pipeDistance];
const pipeSpawnPosition = canvas.width + (pipeWidth * 2);
const pipeHitSensitivity = 10;
let pipeGenerated = 0;

const audio = {
    flapAudio: null,
    hitGroundAudio: null,
    hitPipeAudio: null,
    gameOverAudio: null,
    scoreAudio: null,
    checkScoreAudio: null,
}

const bird = {
    positionX: 100,
    positionY: 50,
    velocityY: 0,
    gravity: 0.6,
    rotation: 0,
    width: 48,
    height: 48
}

let loadedAssets = 0;
let isAssetLoaded = false;
const background = { positionX: 0, speed: 1 }
const ground = {
    x: 0,
    y: canvas.height - 32,
    width: 64,
    height: 64,
    speed: 1
};

const assets = {
    bird: new Image(),
    background: new Image(),
    ground: new Image(),
    pipeTop: new Image(),
    pipeBottom: new Image()
}

document.addEventListener("DOMContentLoaded", () => {
    Asset.loadAsset(assets, () => {
        isAssetLoaded = true;

        Draw.drawBackground(assets, canvas, context, background);
        Draw.drawGround(ground, canvas, context, assets);
        Draw.drawScore(context, canvas, score);
        Asset.loadAudio(audio);

        context.drawImage(
            assets.bird,
            0,
            0,
            16,
            16,
            bird.positionX,
            100,
            bird.width,
            bird.height
        );
    });

    window.addEventListener("keydown", (event) => {
        if (gameOverDelay === false && isAssetLoaded === true) {
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

    Pipe.clearPipes(pipes);
    Pipe.generatePipes(pipes, canvas, pipeWidth, pipeGap, minPipeHeight, maxPipeHeight);
    startGame();
}

function startGame() {
    if (isGameOver === false) {
        updateGame();
        drawGame();

        requestAnimationFrame(startGame);
    } else {
        highscore = score > highscore ? score : highscore;
        pipeGenerated = 0;
        isStart = false;
        gameOverDelay = true;
        gameOverReason === "pipe" ?
            audio.hitPipeAudio.cloneNode().play() :
            audio.hitGroundAudio.cloneNode().play();

        setTimeout(() => audio.gameOverAudio.cloneNode().play(), 450);
        setTimeout(() => gameOverDelay = false, 1000);
    }
}

function updateGame() {
    if (isGameOver === false) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        Util.moveBackground(background, -canvas.width);
        Util.moveGround(ground);
        Util.updateBirdMove(bird);

        for (let i = 0; i < pipes.length; i++) {
            if (pipes[i].x > pipeSpawnRange[0] && pipes[i].x < pipeSpawnRange[1]) {
                Pipe.generatePipes(pipes, canvas, pipeWidth, pipeGap, minPipeHeight, maxPipeHeight);
                pipeGenerated++;

                if (pipeGenerated >= (highscore - 1) && pipeGenerated < highscore) {
                    pipes[i + 1].lastPipe = true;
                }
            }

            if (pipes[i].x + pipes[i].width < 0) {
                pipes.splice(i, 1);
            }

            [isGameOver, gameOverReason] = Util.isColliding(
                bird, pipes[i],
                pipeHitSensitivity,
                isGameOver,
                gameOverReason,
                canvas.height
            );
            score = Util.isBirdPassed(bird, pipes[i], score, audio);

            pipes[i].x -= pipeMoveSpeed;
        }
    }
}

function drawGame() {
    Draw.drawBackground(assets, canvas, context, background);
    Draw.drawPipe(context, pipes, canvas, assets.pipeTop, assets.pipeBottom);
    Draw.drawGround(ground, canvas, context, assets);
    Draw.drawBird(context, assets, bird);
    Draw.drawScore(context, canvas, score);
}