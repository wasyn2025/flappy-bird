import { canvas, context, state, sounds, assets } from "./state.js";
import { drawBackground, drawGround } from "./draw.js";
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
    if (state.bird.positionY >= (canvas.height - 80)) {
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

        isBirdPassed(state.pipes[i]);

        state.pipes[i].x -= state.pipeMoveSpeed;
    }
}

// Run background automatically at start menu
export function runBackground() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    moveBackground();
    moveGround();

    drawBackground();
    drawGround();

    // context.drawImage(
    //     assets.bird,
    //     0,
    //     0,
    //     16,
    //     16,
    //     state.bird.positionX,
    //     100,
    //     state.bird.width,
    //     state.bird.height
    // );

    state.backgroundAutoRunId = requestAnimationFrame(runBackground);
}