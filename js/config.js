// Canvas configuration state
export const CANVAS_WIDTH = 370;
export const CANVAS_HEIGHT = 600;

// Game stuff configuration state
export const IS_START = false;
export const DEFAULT_START_GAME_ANIMATION_ID = false;
export const IS_GAMEOVER = false;
export const IS_PAUSED = false;
export const DEFAULT_RESUME_INTERVAL_ID = false;
export const TIMEOUT_COUNTDOWN = 3;
export const GAMEOVER_REASON = ['pipe', 'ground', ''];
export const IS_GAMEOVER_DELAY = false;
export const GAMEOVER_DELAY = 2000;
export const DEFAULT_SCORE = 0;
export const DEFAULT_HIGHSCORE = 0;

// Pipe configuration state
export const MIN_PIPE_HEIGHT = 20;
export const PIPE_GAP = 125;
export const PIPE_WIDTH = 64;
export const PIPE_MOVE_SPEED = 2.8;
export const PIPE_HIT_SENSITIVITY = 10;
export const DEFAULT_PIPE_GENERATED = 0;
export const DEFAULT_DELAY_PIPE_START_ID = null;
export const DEFAULT_IS_DELAY_PIPE_START = true;

// Bird configuration state
export const BIRD_POSITION_X = 100;
export const BIRD_POSITION_Y = 50;
export const BIRD_VELOCITY = 0;
export const BIRD_GRAVITY = 0.6;
export const BIRD_ROTATION = 0;
export const BIRD_DIMENSION = {width: 38, height: 38};
export const BIRD_FALLING_ANIM_ID = null;

// Shaking animation default configuration state
export const DEFAULT_IS_SHAKING = false;
export const SHAKE_DURATION = 10;
export const SHAKE_INTENSITY = 10;

// Asset default configuration state
export const DEFAULT_LOADED_ASSET = 0;
export const DEFAULT_IS_ASSET_LOADED = false;

// Background configuration state
export const BACKGROUND_POSITION_X = 0;
export const BACKGROUND_SPEED = 1;
export const DEFAULT_BACKGROUND_AUTO_RUN_ID = null;

// Ground configuration state
export const GROUND_POSITION_X = 0;
export const GROUND_POSITION_Y = CANVAS_HEIGHT - 16;
export const GROUND_DIMENSION = {width: 48, height: 48};
export const GROUND_SPEED = 1;

// flash animation configuration state
export const FLASH_ALPHA = 0;
export const DEFAULT_FLASH_ANIMATION_ID = null;


