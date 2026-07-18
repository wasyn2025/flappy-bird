export function clearPipes(pipes) {
    pipes.length = 0;
}

export function generatePipes(pipes, canvas, pipeWidth, pipeGap, minPipeHeight, maxPipeHeight) {
    const pipeHeight = Math.floor(
        Math.random() * (maxPipeHeight - minPipeHeight) + minPipeHeight
    );

    pipes.push({
        x: canvas.width,
        y: 0,
        width: pipeWidth,
        height: pipeHeight,
        gap: pipeGap,
        passed: false,
        lastPipe: false,
    });
}