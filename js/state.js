export const canvas = document.getElementById("game");
export const context = canvas.getContext("2d");
canvas.width = 370;
canvas.height = 650;

export const state = {
    isStart: false,
    isGameOver: false,
    gameOverReason: "",
    gameOverDelay: false,
    score: 0,
    highScore: 0,
    startGameAnimationId: null,

    pipes: [],
    minPipeHeight: 20,
    pipeGap: 160,
    pipeWidth: 70,
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
        width: 48,
        height: 48
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
        positionY: canvas.height - 32,
        width: 64,
        height: 64,
        speed: 1
    },

    // flicker state
    flashAlpha: 0,
    flashAnimationId: null,
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
    pipeBottom: new Image()
};