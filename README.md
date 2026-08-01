# Casual Flappy Bird Game

A simple Flappy Bird game built with pure HTML, CSS, and JavaScript (vanilla JS). This project was created to learn the basics of browser game development, covering canvas rendering, simple physics, collision detection, and a scoring system.

## Description

Flappy Bird is a casual game where the player controls a bird that flies through gaps between pipes. The bird constantly falls due to gravity, and the player must press a button to make it flap upward. The game ends if the bird hits a pipe or the ground. This project is a lightweight, easy-to-understand reimplementation, suitable for learning the fundamentals of browser game development.

## Features

- Classic Flappy Bird gameplay
- Simple gravity and jump physics
- Collision detection between the bird, pipes, and the ground
- Scoring system that increases each time a pipe is successfully passed
- High score saved in `localStorage`
- Responsive design (playable on both desktop and mobile)
- Easy restart after game over
- Difficulty that increases as the game progresses

## Technologies Used

- **HTML5** – page structure and the `<canvas>` element
- **CSS3** – layout and visual styling
- **JavaScript (Vanilla)** – all game logic (no external libraries or frameworks)

## Folder Structure
```
casual-flappy-bird/
├── index.html          # Main file
├── css/                # CSS folder for website styles
├── js/                 # Game logic files
├── assets/             # Bird, pipe, background images, etc. (optional)
└── README.md
```