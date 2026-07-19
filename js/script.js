import * as Draw from "./draw.js";
import * as Pipe from "./pipe.js";
import * as Asset from "./asset.js";
import * as Util from "./util.js";
import { canvas, context, state, sounds, assets } from "./state.js";

document.addEventListener("DOMContentLoaded", () => {
    Asset.loadAsset(() => {
        state.isAssetLoaded = true;

        Draw.drawBackground();
        Draw.drawGround();
        Draw.drawScore();
        Asset.loadAudio();

        context.drawImage(
            assets.bird,
            0,
            0,
            16,
            16,
            state.bird.positionX,
            100,
            state.bird.width,
            state.bird.height
        );
    });

    window.addEventListener("keydown", (event) => {
        if (state.gameOverDelay === false && state.isAssetLoaded === true) {
            if (event.code === "Space" && state.isStart === false) {
                sounds.flap.cloneNode().play();
                state.isStart = true;
                state.isGameOver = false;
                state.score = 0;
                state.bird.velocityY = -5;
                state.bird.positionY = 100;

                cancelAnimationFrame(state.fallingAnimationId);

                Pipe.clearPipes();
                Pipe.generatePipes();
                startGame();

                return;
            }

            if (event.code === "Space") {
                sounds.flap.cloneNode().play();
                state.bird.velocityY = -10;

                return;
            }
        }
    });
});


let fuckingCancelTheAnimation;

function startGame() {
    if (state.isGameOver === false) {
        updateGame();
        drawGame();

        fuckingCancelTheAnimation = requestAnimationFrame(startGame);
    } else {
        cancelAnimationFrame(fuckingCancelTheAnimation);

        state.highscore = state.score > state.highscore ?
            state.score :
            state.highscore;

        state.pipeGenerated = 0;
        state.pipeMoveSpeed = 2.8;
        state.isStart = false;
        state.gameOverDelay = true;
        state.gameOverReason === "pipe" ?
            sounds.hitPipe.cloneNode().play() :
            sounds.hitGround.cloneNode().play();

        setTimeout(() => sounds.gameOver.cloneNode().play(), 450);
        setTimeout(() => state.gameOverDelay = false, 2000);

        if (state.gameOverReason === "pipe") {
            state.difference = state.bird.positionY;
            state.bird.velocityY = 0;
            state.isShaking = true;
            state.shakeDuration = 15;
            state.shakeIntensity = 15,

            setTimeout(drawBirdFalling, 100);
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

        for (let i = 0; i < state.pipes.length; i++) {
            if (state.pipes[i].x < (canvas.width / 2 - 50) && state.pipes[i].pipeMove === false) {
                Pipe.generatePipes();

                state.pipeGenerated++;
                state.pipes[i].pipeMove = true;

                if (state.pipeGenerated >= (state.highscore - 1) && state.pipeGenerated < state.highscore) {
                    state.pipes[i + 1].lastPipe = true;
                }
            }

            if (state.pipes[i].x + state.pipes[i].width < 0) {
                state.pipes.splice(i, 1);
            }

            Util.isColliding(state.pipes[i]);
            Util.isBirdPassed(state.pipes[i]);

            state.pipes[i].x -= state.pipeMoveSpeed;
        }
    }
}

function drawGame() {
    Draw.drawBackground();
    Draw.drawPipe();
    Draw.drawGround();
    Draw.drawBird();
    Draw.drawScore();
}

function drawBirdFalling() {
    if (state.bird.positionY <= (canvas.height - 32 - state.bird.height)) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.save();

        Util.updateBirdVelocity();
        Util.updateBirdRotation();

        Draw.drawShakeAnim();
        Draw.drawBackground();
        Draw.drawPipe();
        Draw.drawGround();
        Draw.drawBird();
        Draw.drawScore();

        context.restore();

        state.fallingAnimationId = requestAnimationFrame(drawBirdFalling);
    } else {
        cancelAnimationFrame(state.fallingAnimationId);
    }
}