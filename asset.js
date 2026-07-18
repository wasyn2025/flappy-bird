import { drawBackground } from "./draw.js";

export function loadAudio(audio) {
    audio.hitGroundAudio = new Audio("./sounds/hit-ground.wav");
    audio.hitPipeAudio = new Audio("./sounds/hit-pipe.wav");
    audio.gameOverAudio = new Audio("./sounds/gameover.wav");
    audio.flapAudio = new Audio("./sounds/flap.wav");
    audio.scoreAudio = new Audio("./sounds/score.wav");
    audio.checkScoreAudio = new Audio("./sounds/checkpoint.mp3");
}

export function loadAsset(assets, onFinished) {
    let loadedAsset = 0;
    const totalAssets = Object.keys(assets).length;

    function assetLoaded() {
        loadAsset++;
        if(loadedAsset === totalAssets) {
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