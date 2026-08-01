import { canvas, context, state, sounds, assets } from "./state.js";
import * as Draw from "./draw.js";
import * as Pipe from "./pipe.js";
import * as config from "./config.js";

// Check whether the the bird hit a pipe
export function pipeCollide(pipe) {
    const birdRect = {
        x: state.bird.positionX,
        y: state.bird.positionY,
        width: state.bird.width,
        height: state.bird.height
    };

    if (
        birdRect.x < (pipe.x + pipe.width) - state.pipeHitSensitivity &&
        (birdRect.x + birdRect.width) - state.pipeHitSensitivity > pipe.x &&
        (birdRect.y < (pipe.y + pipe.height) - state.pipeHitSensitivity || birdRect.y + birdRect.height > (pipe.y + pipe.height + pipe.gap) + state.pipeHitSensitivity)
    ) {
        state.isGameOver = true;
        state.gameOverReason = "pipe";
    }
}

// Check whether the the bird hit a pipe
export function groundCollide() {
    if (state.bird.positionY >= (canvas.height - state.ground.height)) {
        state.isGameOver = true;
        state.gameOverReason = "ground";
    }
}

// Check wheterher the bird object passed a pipe
export function isBirdPassed(pipe) {
    if (pipe.x + pipe.width < state.bird.positionX && pipe.passed === false) {
        state.score++;

        if (state.score % 10 === 0) {
            sounds.checkpoint.cloneNode().play();

            if (state.pipeMoveSpeed <= 4.0) {
                state.pipeMoveSpeed = Number((state.pipeMoveSpeed + 0.2).toFixed(1));
                state.pipeDistance = state.pipeDistance !== config.DEFAULT_MAX_PIPE_DISTANCE ?
                    state.pipeDistance += config.DEFAULT_PIPE_DISTANCE :
                    state.pipeDistance
            }
        } else {
            sounds.score.cloneNode().play();
        }

        pipe.passed = true;
    }
}

// Update background x position in canvas
export function moveBackground() {
    state.background.positionX -= state.background.speed;
    if (state.background.positionX <= -canvas.width) {
        state.background.positionX = 0;
    }
}

// Update ground x position in canvas
export function moveGround() {
    state.ground.positionX -= state.ground.speed;
    if (state.ground.positionX <= -state.ground.width) {
        state.ground.positionX = 0;
    }
}

// Update bird falling (position Y)
export function updateBirdVelocity() {
    state.bird.velocityY += state.bird.gravity;
    state.bird.positionY += state.bird.velocityY;
}

// Update bird rotation
export function updateBirdRotation() {
    if (state.bird.velocityY < 0) {
        state.bird.rotation = -0.3;
    } else {
        state.bird.rotation += 0.03;
        state.bird.rotation = state.bird.rotation > 1.2 ? 1.2 : state.bird.rotation;
    }
}

// handle pipe generation, check pipe passed bird, and moving pipes
export function handlePipe() {
    for (let i = 0; i < state.pipes.length; i++) {
        if (state.pipes[i].x < (canvas.width / 2 - state.pipeDistance) && state.pipes[i].pipeMove === false) {
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

        isBirdPassed(state.pipes[i]);

        state.pipes[i].x -= state.pipeMoveSpeed;
    }
}

// Run background automatically at start menu
export function runBackground() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    moveBackground();
    moveGround();

    Draw.drawBackground();
    Draw.drawGround();

    state.backgroundAutoRunId = requestAnimationFrame(runBackground);
}

export function hideStartMenu() {
    document.querySelector("div.startContainer").style.opacity = 0;
}

export function resizeCanvas() {
    const aspect = config.CANVAS_WIDTH / config.CANVAS_HEIGHT;
    let width = window.innerHeight * aspect;
    let height = window.innerHeight;

    if (width > window.innerWidth) {
        width = window.innerWidth;
        height = width / aspect;
    }

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    canvas.width = config.CANVAS_WIDTH;
    canvas.height = config.CANVAS_HEIGHT;
}

// will pause the game and display pause and countdown interface
export function pauseGame(startGame) {
    if (state.isPaused === false) {
        state.isPaused = true;
        Draw.drawPauseText();
        cancelAnimationFrame(state.startGameAnimationId);

        return;
    }

    if (state.resumeIntervalId === false) {
        Draw.drawCountdown(state.countdown);

        state.resumeIntervalId = setInterval(() => {
            state.countdown--;

            if (state.countdown === 0) {
                clearInterval(state.resumeIntervalId);
                requestAnimationFrame(startGame);

                state.resumeIntervalId = false;
                state.isPaused = false;
                state.countdown = config.TIMEOUT_COUNTDOWN;

                return;
            }

            Draw.drawCountdown(state.countdown);
        }, 1000);

        return;
    }
}

// function that will restart all the related state variable and stop
// startGame, clear delayPipeStartId, and check the new high score
export function handleGameOver() {
    cancelAnimationFrame(state.startGameAnimationId);
    clearTimeout(state.delayPipeStartId);

    state.highscore = state.score > state.highscore ?
        state.score :
        state.highscore

    localStorage.setItem("highscore", state.highscore);

    state.isStart = config.IS_START;
    state.startGameAnimationId = config.DEFAULT_START_GAME_ANIMATION_ID;
    state.gameOverDelay = true;

    state.delayPipeStart = config.DEFAULT_IS_DELAY_PIPE_START;
    state.pipeGenerated = config.DEFAULT_PIPE_GENERATED;
    state.pipeMoveSpeed = config.PIPE_MOVE_SPEED;
    state.pipeDistance = config.DEFAULT_PIPE_DISTANCE;

    state.isShaking = true;

    state.flashAlpha = 0.8;

    state.gameOverReason === config.GAMEOVER_REASON[0] ?
        sounds.hitPipe.cloneNode().play() :
        sounds.hitGround.cloneNode().play();

    setTimeout(() => sounds.gameOver.cloneNode().play(), 450);
    setTimeout(() => state.gameOverDelay = config.IS_GAMEOVER_DELAY, config.GAMEOVER_DELAY);

    if (state.gameOverReason === config.GAMEOVER_REASON[0]) {
        state.bird.velocityY = config.BIRD_VELOCITY;

        setTimeout(Draw.drawBirdFalling, 100);
    } else {
        Draw.triggerScreenFlash();
    }
}

export function flap(startGame) {
    if (state.gameOverDelay === true || state.isAssetLoaded === false) {
        return;
    }

    if (state.isStart === false) {
        hideStartMenu();
        cancelAnimationFrame(state.fallingAnimationId);
        cancelAnimationFrame(state.backgroundAutoRunId);

        state.delayPipeStartId = setTimeout(() => state.delayPipeStart = false, 2000);

        sounds.flap.cloneNode().play();
        state.isStart = true;
        state.pipeGenerated = config.DEFAULT_PIPE_GENERATED;
        state.isGameOver = config.IS_GAMEOVER;
        state.score = config.DEFAULT_SCORE;
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

export function restartGame() {
    cancelAnimationFrame(state.startGameAnimationId);
    cancelAnimationFrame(state.backgroundAutoRunId);
    clearInterval(state.resumeIntervalId);
    clearTimeout(state.delayPipeStartId);

    document.querySelector("div.startContainer").style.opacity = 1;

    state.score = config.DEFAULT_SCORE;
    state.isStart = config.IS_START;
    state.isGameOver = config.IS_GAMEOVER;
    state.isPaused = config.IS_PAUSED;
    state.resumeIntervalId = config.DEFAULT_RESUME_INTERVAL_ID;
    state.countdown = config.TIMEOUT_COUNTDOWN;
    state.gameOverDelay = true;
    state.gameOverReason = config.GAMEOVER_REASON[3];

    state.pipes = [];
    state.delayPipeStart = config.DEFAULT_IS_DELAY_PIPE_START;
    state.delayPipeStartId = config.DEFAULT_DELAY_PIPE_START_ID;
    state.pipeGenerated = config.DEFAULT_PIPE_GENERATED;
    state.pipeMoveSpeed = config.PIPE_MOVE_SPEED;
    state.pipeDistance = config.DEFAULT_PIPE_DISTANCE;

    state.bird.positionX = config.BIRD_POSITION_X;
    state.bird.positionY = config.BIRD_POSITION_Y;
    state.bird.velocityY = config.BIRD_VELOCITY;
    state.bird.rotation = config.BIRD_ROTATION;

    state.background.positionX = config.BACKGROUND_POSITION_X;
    state.fallingAnimationId = config.DEFAULT_BACKGROUND_AUTO_RUN_ID;
    state.delayPipeStartId = config.DEFAULT_DELAY_PIPE_START_ID;

    state.ground.positionX = config.GROUND_POSITION_X;
    state.ground.positionY = config.GROUND_POSITION_Y;

    setTimeout(() => state.gameOverDelay = config.IS_GAMEOVER_DELAY, config.GAMEOVER_DELAY);

    context.clearRect(0, 0, canvas.width, canvas.height);
    Draw.drawBackground();
    Draw.drawGround();
    runBackground();
}