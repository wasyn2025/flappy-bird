import { resizeCanvas } from "./util.js";

export const canvas = document.getElementById("game");
export const context = canvas.getContext("2d");
export const CANVAS_WIDTH = 370;
export const CANVAS_HEIGHT = 600;

resizeCanvas();

export const state = {
    isStart: false,
    isGameOver: false,
    gameOverReason: "",
    gameOverDelay: false,
    score: 0,
    highscore: Number(localStorage.getItem("highscore")) || 0,

    getHighscore: () => {
        document.querySelector("#highscore").textContent = state.highscore;
    },

    pipes: [],
    minPipeHeight: 20,
    pipeGap: 160,
    pipeWidth: 64,
    pipeMoveSpeed: 2.8,
    pipeHitSensitivity: 10,
    pipeGenerated: 0,
    _pipeSpawnRange: 0,
    delayPipeStartId: null,
    delayPipeStart: true,

    get maxPipeHeight() {
        return canvas.height - this.pipeGap - this.minPipeHeight;
    },

    get pipeDistance() {
        return (canvas.width / 2) <= 300 ?
            (canvas.width / 2) - 50 :
            (canvas.width / 2) + 100;
    },

    get pipeSpawnPosition() {
        return canvas.width + (this.pipeWidth * 2)
    },

    // bird state
    bird: {
        positionX: 100,
        positionY: 50,
        velocityY: 0,
        gravity: 0.6,
        rotation: 0,
        width: 38,
        height: 38
    },

    // bird falling animation state
    fallingAnimationId: null,
    _difference: 0,

    get difference() {
        return this._difference;
    },

    set difference(birdPositionY) {
        this._difference = Math.round((canvas.height - 32) - birdPositionY);
    },

    // camera shake state animation
    isShaking: false,
    shakeDuration: 0,
    shakeIntensity: 0,

    // asset state
    loadedAsset: 0,
    isAssetLoaded: false,

    // background and ground state
    background: { positionX: 0, speed: 1 },
    ground: {
        positionX: 0,
        positionY: canvas.height - 16,
        width: 48,
        height: 48,
        speed: 1
    },

    // flicker state
    flashAlpha: 0,
    flashAnimationId: null,

    // background auto run state
    backgroundAutoRunId: null,
};

// sound storage
export const sounds = {
    flap: null,
    hitGround: null,
    hitPipe: null,
    gameOver: null,
    score: null,
    checkpoint: null,
    whoosh: null,
};

// asset storage
export const assets = {
    bird: new Image(),
    background: new Image(),
    ground: new Image(),
    pipeTop: new Image(),
    pipeBottom: new Image(),
    medal: new Image()
};