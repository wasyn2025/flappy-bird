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
        Util.hideStartMenu();
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

    if (state.isPaused === false) {
        sounds.flap.cloneNode().play();
        state.bird.velocityY = -10;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    Asset.loadAsset(() => {
        state.isAssetLoaded = true;
        Asset.loadAudio();
    });

    Util.runBackground();
    state.getHighscore();

    window.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
            flap();
        }

        if (event.code === "KeyP" && state.isStart === true) {
            Util.pauseGame(startGame);
        }
    });

    canvas.addEventListener("mousedown", (event) => {
        if (event.button === 0) {
            flap();
        }
    });
});

function startGame() {
    if (state.isGameOver === false) {
        updateGame();
        drawGame();
        Util.groundCollide();

        state.startGameAnimationId = requestAnimationFrame(startGame);
    } else {
        Util.handleGameOver();
    }
}

function updateGame() {
    if (state.isGameOver === false && state.isPaused === false) {
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