export const canvas = document.getElementById("game");
export const context = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 650;

export const state = {
    isStart: false,
    isGameOver: false,
    gameOverReason: "",
    gameOverDelay: false,
    score: 0,
    highScore: 0,

    pipes: [],
    minPipeHeight: 20,
    pipeGap: 140,
    pipeWidth: 70,
    pipeMoveSpeed: 2.8,
    pipeHitSensitivity: 10,
    pipeGenerated: 0,

    get maxPipeHeight() {
        return canvas.height - this.pipeGap - this.minPipeHeight;
    },

    get pipeDistance() {
        return (canvas.width / 2) <= 300 ?
            (canvas.width / 2) - 50 :
            (canvas.width / 2) + 100;
    },

    get pipeSpawnRange() {
        return [this.pipeDistance - (this.pipeMoveSpeed + 2), this.pipeDistance];
    },

    get pipeSpawnPosition() {
        return canvas.width + [this.pipeWidth + 2]
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
    }
};

// sound storage
export const sounds = {
    flap: null,
    hitGround: null,
    hitPipe: null,
    gameOver: null,
    score: null,
    checkpoint: null,
};

// asset storage
export const assets = {
    bird: new Image(),
    background: new Image(),
    ground: new Image(),
    pipeTop: new Image(),
    pipeBottom: new Image()
};