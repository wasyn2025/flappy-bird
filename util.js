// Check whether the the bird hit a pipe
export function isColliding(bird, pipe, pipeHitSensitivity, isGameOver, gameOverReason, canvasHeight) {
    const birdRect = {
        x: bird.positionX,
        y: bird.positionY,
        width: bird.width,
        height: bird.height
    };

    if (bird.positionY >= (canvasHeight - 85)) {
        isGameOver = true;
        gameOverReason = "ground";
    }

    if (
        birdRect.x < (pipe.x + pipe.width) - pipeHitSensitivity &&
        (birdRect.x + birdRect.width) - pipeHitSensitivity > pipe.x &&
        (birdRect.y < (pipe.y + pipe.height) - pipeHitSensitivity || birdRect.y + birdRect.height > (pipe.y + pipe.height + pipe.gap) + pipeHitSensitivity)
    ) {
        isGameOver = true;
        gameOverReason = "pipe";
    }

    return [isGameOver, gameOverReason];
}

// Check wheterher the bird object passed a pipe
export function isBirdPassed(bird, pipe, score, audio) {
    if (pipe.x + pipe.width < bird.positionX && pipe.passed === false) {
        score++;

        if (score % 10 === 0) {
            audio.checkScoreAudio.cloneNode().play();
        } else {
            audio.scoreAudio.cloneNode().play();
        }

        pipe.passed = true;

        return score;
    }

    return score;
}

// Update background x position in canvas
export function moveBackground(background, canvasWidth) {
    background.positionX -= background.speed;
    if (background.positionX <= canvasWidth) {
        background.positionX = 0;
    }
}

// Update ground x position in canvas
export function moveGround(ground) {
    ground.x -= ground.speed;
    if (ground.x <= -ground.width) {
        ground.x = 0;
    }
}

// Update bird positionY in canvas
export function updateBirdMove(bird) {
    bird.velocityY += bird.gravity;
    bird.positionY += bird.velocityY;

    if (bird.velocityY < 0) {
        bird.rotation = -0.3;
    } else {
        bird.rotation += 0.03;
        bird.rotation = bird.rotation > 1.2 ? 1.2 : bird.rotation;
    }
}