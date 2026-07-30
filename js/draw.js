import { canvas, context, state, sounds, assets } from "./state.js";
import { pipeCollide, updateBirdVelocity, updateBirdRotation } from "./util.js";

// Draw the background flappy bird with the current position
export function drawBackground() {
    const scale = Math.max(
        canvas.width / assets.background.width,
        canvas.height / assets.background.height
    );
    const width = assets.background.width * scale;
    const height = assets.background.height * scale;
    const x = (canvas.width - width) / 2;
    const y = (canvas.height - height) / 2;

    context.drawImage(
        assets.background,
        state.background.positionX,
        0,
        canvas.width,
        canvas.height
    );

    context.drawImage(
        assets.background,
        state.background.positionX + canvas.width,
        0,
        canvas.width,
        canvas.height
    );
}

// Draw pipe objects with the updated position
export function drawPipe() {
    for (let i = 0; i < state.pipes.length; i++) {
        // pipeCollide(state.pipes[i]);

        // top pipe
        context.drawImage(
            assets.pipeTop,
            state.pipes[i].x,
            state.pipes[i].y,
            state.pipes[i].width,
            state.pipes[i].height
        );

        // bottom pipe
        context.drawImage(
            assets.pipeBottom,
            state.pipes[i].x,
            (state.pipes[i].height + state.pipes[i].gap),
            state.pipes[i].width,
            (canvas.height - 16) - (state.pipes[i].height + state.pipes[i].gap)
        );
    }
}

// Draw the ground object on the bottom of the canvas with the updated
// position
export function drawGround() {
    for (let x = state.ground.positionX; x < canvas.width + state.ground.width; x += state.ground.width) {
        context.drawImage(
            assets.ground,
            x,
            state.ground.positionY,
            state.ground.width,
            state.ground.height
        );
    }
}

// Draw the bird object with the updated position
export function drawBird() {
    context.save();

    context.translate(
        state.bird.positionX + state.bird.width / 2,
        state.bird.positionY + state.bird.height / 2
    );

    context.rotate(state.bird.rotation);

    context.drawImage(
        assets.bird,
        0,
        0,
        16,
        16,
        -24,
        -24,
        state.bird.width,
        state.bird.height
    );

    context.restore();
}

// Draw the score text with the updated score
export function drawScore() {
    context.font = "bold 48px 'Jersey 10'";
    context.textAlign = "center";
    context.fillStyle = "white";
    context.fillText(state.score, canvas.width / 2, 50);

    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.strokeText(
        state.score,
        canvas.width / 2,
        50
    );
}

export function drawShakeAnim() {
    if (!state.isShaking) {
        return;
    }

    const offsetX = (Math.random() - 0.5) * state.shakeIntensity;
    const offsetY = (Math.random() - 0.5) * state.shakeIntensity;
    context.translate(offsetX, offsetY);

    state.shakeDuration--;

    if (state.shakeDuration <= 0) {
        state.isShaking = false;
    }
}

export function drawCurrentGameOverState() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    state.flashAlpha -= 0.1;

    context.save();

    drawShakeAnim();
    drawBackground();
    drawPipe();
    drawBird();
    drawGround();
    drawScore();
    drawScreenFlash();

    context.restore();
}

function drawScreenFlash() {
    if (state.flashAlpha <= 0) return;

    context.globalAlpha = state.flashAlpha;
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

export function triggerScreenFlash() {
    if (state.flashAlpha > 0) {
        drawCurrentGameOverState();
        state.flashAnimationId = requestAnimationFrame(triggerScreenFlash);
    } else {
        cancelAnimationFrame(state.flashAnimationId);
    }
}

// Draw pause text when game paused
export function drawPauseText() {
    context.fillStyle = "rgba(0, 0, 0, 0.5)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = "bold 32px 'Jersey 10'";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.textBaseline = "middle";

    context.lineWidth = 3;
    context.strokeStyle = "black";
    context.strokeText(
        "GAME PAUSED",
        canvas.width / 2,
        canvas.height / 2
    )

    context.fillText("GAME PAUSED", canvas.width / 2, canvas.height / 2);
}

// draw countdown animation when user unpause the game
export function drawCountdown(countdown) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    if (state.delayPipeStart === false) drawPipe();
    drawGround();
    drawBird();
    drawScore();

    context.fillStyle = "rgba(0, 0, 0, 0.5)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = "bold 40px 'Jersey 10'";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.textBaseline = "middle";

    context.lineWidth = 3;
    context.strokeStyle = "black";
    context.strokeText(countdown, canvas.width / 2, canvas.height / 2);

    context.fillText(countdown, canvas.width / 2, canvas.height / 2);
}

export function drawBirdFalling() {
    if (state.bird.positionY <= (canvas.height - state.ground.height)) {
        updateBirdVelocity();
        updateBirdRotation();
        drawCurrentGameOverState();

        state.fallingAnimationId = requestAnimationFrame(drawBirdFalling);
    } else {
        cancelAnimationFrame(state.fallingAnimationId);
    }
}