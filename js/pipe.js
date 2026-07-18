import { canvas, context, state, sounds, assets } from "./state.js";

export function clearPipes() {
    state.pipes.length = 0;
}

export function generatePipes() {
    const pipeHeight = Math.floor(
        Math.random() * (state.maxPipeHeight - state.minPipeHeight) + state.minPipeHeight
    );

    state.pipes.push({
        x: canvas.width,
        y: 0,
        width: state.pipeWidth,
        height: pipeHeight,
        gap: state.pipeGap,
        passed: false,
        lastPipe: false,
        pipeMove: false,
    });
}