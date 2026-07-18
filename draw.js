// Draw the background flappy bird with the current position
export function drawBackground(assets, canvas, context, background) {
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
        background.positionX,
        0,
        canvas.width,
        canvas.height
    );

    context.drawImage(
        assets.background,
        background.positionX + canvas.width,
        0,
        canvas.width,
        canvas.height
    );
}

// Draw the ground object on the bottom of the canvas with the updated
// position
export function drawGround(ground, canvas, context, assets) {
    for (let x = ground.x; x < canvas.width + ground.width; x += ground.width) {
        context.drawImage(
            assets.ground,
            x,
            ground.y,
            ground.width,
            ground.height
        );
    }
}

// Draw the bird object with the updated position
export function drawBird(context, assets, bird) {
    context.save();
    context.translate(bird.positionX + bird.width / 2, bird.positionY + bird.height / 2);
    context.rotate(bird.rotation);

    context.drawImage(
        assets.bird,
        0,
        0,
        16,
        16,
        -24,
        -24,
        bird.width,
        bird.height
    );

    context.restore();
}

// Draw pipe objects with the updated position
export function drawPipe(context, pipes, canvas, pipeTopAsset, pipeBottomAsset) {
    for (let i = 0; i < pipes.length; i++) {
        if (pipes[i].lastPipe === true) {
            context.fillStyle = "gold";
        } else {
            context.fillStyle = "green";
        }

        // top pipe
        context.drawImage(
            pipeTopAsset,
            pipes[i].x, 
            pipes[i].y, 
            pipes[i].width, 
            pipes[i].height
        );

        // bottom pipe
        context.drawImage(
            pipeBottomAsset,
            pipes[i].x,
            (pipes[i].height + pipes[i].gap),
            pipes[i].width,
            (canvas.height - 32) - (pipes[i].height + pipes[i].gap)
        );
    }
}

// Draw the score text with the updated score
export function drawScore(context, canvas, score) {
    context.font = "bold 40px Arial";
    context.textAlign = "center";
    context.fillStyle = "white";
    context.fillText(score, canvas.width / 2, 50);
}