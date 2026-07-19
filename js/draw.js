import { canvas, context, state, sounds, assets } from "./state.js";


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
        if (state.pipes[i].lastPipe === true) {
            context.fillStyle = "gold";
        } else {
            context.fillStyle = "green";
        }

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
            (canvas.height - 32) - (state.pipes[i].height + state.pipes[i].gap)
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
    context.font = "bold 40px Arial";
    context.textAlign = "center";
    context.fillStyle = "white";
    context.fillText(state.score, canvas.width / 2, 50);
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