import {state, sounds, assets} from "./state.js";

export function loadAudio() {
    sounds.hitGround = new Audio("./sounds/hit-ground.wav");
    sounds.hitPipe = new Audio("./sounds/hit-pipe.wav");
    sounds.gameOver = new Audio("./sounds/gameover.wav");
    sounds.flap = new Audio("./sounds/flap.wav");
    sounds.score = new Audio("./sounds/score.wav");
    sounds.checkpoint = new Audio("./sounds/checkpoint.mp3");
}

// perbaiki masalah onFinished() callback yang dijalankan berulang kali
export function loadAsset(onFinished) {
    let loadedAsset = 0;
    const totalAssets = Object.keys(assets).length;

    function assetLoaded() {
        state.loadAsset++;
        if(state.loadedAsset === totalAssets) {
            onFinished();
        }
    }

    for(const key in assets) {
        assets[key].onload = onFinished;
    }

    assets.bird.src = "./asset/bird.png";
    assets.background.src = "./asset/background3.png";
    assets.ground.src = "./asset/ground.png";
    assets.pipeTop.src = "./asset/pipe-top.png";
    assets.pipeBottom.src = "./asset/pipe-bottom.png";
}