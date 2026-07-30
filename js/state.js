import { resizeCanvas } from "./util.js";
import * as config from "./config.js";

export const canvas = document.getElementById("game");
export const context = canvas.getContext("2d");

resizeCanvas();

export const state = {
    isStart: config.IS_START,
    startGameAnimationId: config.DEFAULT_START_GAME_ANIMATION_ID,
    isGameOver: config.IS_GAMEOVER,
    isPaused: config.IS_PAUSED,
    resumeIntervalId: config.DEFAULT_RESUME_INTERVAL_ID,
    countdown: config.TIMEOUT_COUNTDOWN,
    gameOverReason: config.GAMEOVER_REASON[2],
    gameOverDelay: config.GAMEOVER_DELAY,
    score: config.DEFAULT_SCORE,
    highscore: Number(localStorage.getItem("highscore")) || config.DEFAULT_HIGHSCORE,

    getHighscore: () => {
        document.querySelector("#highscore").textContent = state.highscore;
    },

    pipes: [],
    minPipeHeight: config.MIN_PIPE_HEIGHT,
    pipeGap: config.PIPE_GAP,
    pipeWidth: config.PIPE_WIDTH,
    pipeMoveSpeed: config.PIPE_MOVE_SPEED,
    pipeHitSensitivity: config.PIPE_HIT_SENSITIVITY,
    pipeGenerated: config.DEFAULT_PIPE_GENERATED,
    delayPipeStartId: config.DEFAULT_DELAY_PIPE_START_ID,
    delayPipeStart: config.DEFAULT_IS_DELAY_PIPE_START,

    get maxPipeHeight() {
        return canvas.height - this.pipeGap - this.minPipeHeight;
    },

    // bird state
    bird: {
        positionX: config.BIRD_POSITION_X,
        positionY: config.BIRD_POSITION_Y,
        velocityY: config.BIRD_VELOCITY,
        gravity: config.BIRD_GRAVITY,
        rotation: config.BIRD_ROTATION,
        width: config.BIRD_DIMENSION.width,
        height: config.BIRD_DIMENSION.height
    },
    fallingAnimationId: config.BIRD_FALLING_ANIM_ID,

    // camera shake state animation
    isShaking: config.DEFAULT_IS_SHAKING,
    shakeDuration: config.SHAKE_DURATION,
    shakeIntensity: config.SHAKE_INTENSITY,

    // asset state
    loadedAsset: config.DEFAULT_LOADED_ASSET,
    isAssetLoaded: config.DEFAULT_IS_ASSET_LOADED,

    // background and ground state
    background: { positionX: config.BACKGROUND_POSITION_X, speed: config.BACKGROUND_SPEED },
    backgroundAutoRunId: config.DEFAULT_BACKGROUND_AUTO_RUN_ID,
    ground: {
        positionX: config.GROUND_POSITION_X,
        positionY: config.GROUND_POSITION_Y,
        width: config.GROUND_DIMENSION.width,
        height: config.GROUND_DIMENSION.height,
        speed: config.GROUND_SPEED
    },

    // flash state
    flashAlpha: config.FLASH_ALPHA,
    flashAnimationId: config.DEFAULT_FLASH_ANIMATION_ID,
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