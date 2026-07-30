import { canvas, context, state, sounds, assets, CANVAS_WIDTH, CANVAS_HEIGHT, TIMEOUT_COUNTDOWN } from "./state.js";
import * as Draw from "./draw.js";
import * as Pipe from "./pipe.js";

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
            state.pipeMoveSpeed = state.pipeMoveSpeed === 3.6 ?
                Number((state.pipeMoveSpeed + 0.2).toFixed(1)) :
                state.pipeMoveSpeed;
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
        if (state.pipes[i].x < (canvas.width / 2) && state.pipes[i].pipeMove === false) {
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
    const aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
    let width = window.innerHeight * aspect;
    let height = window.innerHeight;

    if (width > window.innerWidth) {
        width = window.innerWidth;
        height = width / aspect;
    }

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
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
        Draw.n(state.countdown);

        state.resumeIntervalId = setInterval(() => {
            state.countdown--;

            if (state.countdown === 0) {
                clearInterval(state.resumeIntervalId);
                requestAnimationFrame(startGame);

                state.resumeIntervalId = false;
                state.isPaused = false;
                state.countdown = TIMEOUT_COUNTDOWN;

                return;
            }

            Draw.drawCountdown(state.countdown);
        }, 1000);

        return;
    }
}

// function that will restart all the related state variable and stop
// startGame, clear delayPipeStartId, and check a new highscore when
// the game is over
export function handleGameOver() {
    cancelAnimationFrame(state.startGameAnimationId);
    clearTimeout(state.delayPipeStartId);

    state.highscore = state.score > state.highscore ?
        state.score :
        state.highscore

    localStorage.setItem("highscore", state.highscore);

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