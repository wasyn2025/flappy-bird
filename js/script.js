import * as Draw from "./draw.js";
import * as Pipe from "./pipe.js";
import * as Asset from "./asset.js";
import * as Util from "./util.js";
import { canvas, context, state, sounds, assets } from "./state.js";

function flap() {
    if (state.gameOverDelay === true || state.isAssetLoaded === false) {
        return;
    }

    if (state.isStart === false) {
        cancelAnimationFrame(state.fallingAnimationId);
        cancelAnimationFrame(state.backgroundAutoRunId);

        state.delayPipeStartId = setTimeout(() => state.delayPipeStart = false, 1500);

        sounds.flap.cloneNode().play();
        state.isStart = true;
        state.isGameOver = false;
        state.score = 0;
        state.bird.velocityY = -5;
        state.bird.positionY = 100;

        Pipe.clearPipes();
        Pipe.generatePipes();
        startGame();

        return;
    }

    sounds.flap.cloneNode().play();
    state.bird.velocityY = -10;
}

document.addEventListener("DOMContentLoaded", () => {
    Asset.loadAsset(() => {
        state.isAssetLoaded = true;
        Asset.loadAudio();
    });

    Util.runBackground();

    window.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
            flap();
        }
    });

    canvas.addEventListener("mousedown", (event) => {
        if (event.button === 0) {
            flap();
        }
    })
});

function startGame() {
    if (state.isGameOver === false) {
        updateGame();
        drawGame();
        Util.groundCollide();

        state.startGameAnimationId = requestAnimationFrame(startGame);
    } else {
        cancelAnimationFrame(state.startGameAnimationId);
        clearTimeout(state.delayPipeStartId);

        state.highscore = state.score > state.highscore ?
            state.score :
            state.highscore;

        state.delayPipeStart = true;
        state.pipeGenerated = 0;
        state.pipeMoveSpeed = 2.8;
        state.isStart = false;
        state.gameOverDelay = true;
        state.flashAlpha = 1;
        state.isShaking = true;
        state.shakeDuration = 15;
        state.shakeIntensity = 6;

        state.gameOverReason === "pipe" ?
            sounds.hitPipe.cloneNode().play() :
            sounds.hitGround.cloneNode().play();

        setTimeout(() => sounds.gameOver.cloneNode().play(), 450);
        setTimeout(() => state.gameOverDelay = false, 2000);

        if (state.gameOverReason === "pipe") {
            state.difference = state.bird.positionY;
            state.bird.velocityY = 0;

            setTimeout(drawBirdFalling, 100);
        } else {
            Draw.triggerScreenFlash();
        }
    }
}

function updateGame() {
    if (state.isGameOver === false) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        Util.moveBackground();
        Util.moveGround();
        Util.updateBirdVelocity();
        Util.updateBirdRotation();

        if (state.delayPipeStart === false) Util.handlePipe();
    }
}

function drawGame() {
    Draw.drawBackground();
    if (state.delayPipeStart === false) Draw.drawPipe();
    Draw.drawGround();
    Draw.drawBird();
    Draw.drawScore();
}

function drawBirdFalling() {
    if (state.bird.positionY <= (canvas.height - 32 - state.bird.height)) {
        Util.updateBirdVelocity();
        Util.updateBirdRotation();
        Draw.drawCurrentGameOverState();

        state.fallingAnimationId = requestAnimationFrame(drawBirdFalling);
    } else {
        cancelAnimationFrame(state.fallingAnimationId);
    }
}