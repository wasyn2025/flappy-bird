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

function startGame() {
    if (state.isGameOver === false) {
        updateGame();
        drawGame();

        requestAnimationFrame(startGame);
    } else {
        state.highscore = state.score > state.highscore ?
            state.score :
            state.highscore;

        state.pipeGenerated = 0;
        state.isStart = false;
        state.gameOverDelay = true;
        state.gameOverReason === "pipe" ?
            sounds.hitPipe.cloneNode().play() :
            sounds.hitGround.cloneNode().play();

        setTimeout(() => sounds.gameOver.cloneNode().play(), 450);
        setTimeout(() => state.gameOverDelay = false, 2000);
    }
}

function updateGame() {
    if (state.isGameOver === false) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        Util.moveBackground();
        Util.moveGround();
        Util.updateBirdMove();

        for (let i = 0; i < state.pipes.length; i++) {
            if (state.pipes[i].x > state.pipeSpawnRange[0] && state.pipes[i].x < state.pipeSpawnRange[1]) {
                Pipe.generatePipes();
                state.pipeGenerated++;

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