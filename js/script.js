import * as Draw from "./draw.js";
import * as Pipe from "./pipe.js";
import * as Asset from "./asset.js";
import * as Util from "./util.js";
import { canvas, context, state, sounds, assets } from "./state.js";

document.addEventListener("DOMContentLoaded", () => {
    Asset.loadAsset(() => {
        state.isAssetLoaded = true;
        Asset.loadAudio();
    });

    Util.runBackground();
    state.getHighscore();

    window.addEventListener("keydown", (event) => {
        switch (event.code) {
            case "Space":
                Util.flap(startGame);
                break;

            case "KeyP":
                if (state.isStart === true) Util.pauseGame(startGame);
                break;

            case "KeyR":
                if (state.isStart === true) Util.restartGame();
                break;
        }
    });

    canvas.addEventListener("mousedown", (event) => {
        if (event.button === 0) {
            Util.flap(startGame);
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