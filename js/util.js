import { canvas, context, state, sounds, assets } from "./state.js";

// Check whether the the bird hit a pipe
export function isColliding(pipe) {
    const birdRect = {
        x: state.bird.positionX,
        y: state.bird.positionY,
        width: state.bird.width,
        height: state.bird.height
    };

    if (state.bird.positionY >= (canvas.height - 80)) {
        state.isGameOver = true;
        state.gameOverReason = "ground";
    }

    if (
        birdRect.x < (pipe.x + pipe.width) - state.pipeHitSensitivity &&
        (birdRect.x + birdRect.width) - state.pipeHitSensitivity > pipe.x &&
        (birdRect.y < (pipe.y + pipe.height) - state.pipeHitSensitivity || birdRect.y + birdRect.height > (pipe.y + pipe.height + pipe.gap) + state.pipeHitSensitivity)
    ) {
        state.isGameOver = true;
        state.gameOverReason = "pipe";
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