import React, { useState, useEffect, useRef, useCallback } from 'react';
import { loadAudio, playSound, createGradientBackground, drawRoundedRect } from '../../utils/gameUtils';
import { preloadAssets, loadSound, playSound as playGameSound, stopSound } from '../../utils/gameAssets';
import { checkAchievements } from '../../utils/achievements';
import { addToLeaderboard, qualifiesForLeaderboard } from '../../utils/leaderboard';
import GameModal from '../common/GameModal';
import Leaderboard from '../common/Leaderboard';
import Achievements from '../common/Achievements';
import PlayerProfile from '../common/PlayerProfile';
import GameNotification, { NotificationManager } from '../common/GameNotification';

// Game constants
const CELL_SIZE = 30;
const ROWS = 15;
const COLS = 19;
const CANVAS_WIDTH = COLS * CELL_SIZE;
const CANVAS_HEIGHT = ROWS * CELL_SIZE;

// Game colors
const COLORS = {
  WALL: '#2121DE',
  WALL_INNER: '#0000FF',
  DOT: '#FFB8AE',
  POWER_PELLET: '#FFB8AE',
  PACMAN: '#FFFF00',
  GHOST_RED: '#FF0000',
  GHOST_PINK: '#FFB8FF',
  GHOST_BLUE: '#00FFFF',
  GHOST_ORANGE: '#FFB851',
  GHOST_SCARED: '#2121DE',
  GHOST_EYES: '#FFFFFF',
  GHOST_PUPILS: '#0000FF',
  BACKGROUND: '#000000',
  TEXT: '#FFFFFF',
  SCORE: '#FFFF00'
};

// Sound effects paths
const SOUND_PATHS = {
  start: '/src/assets/games/pacman/sounds/start.mp3',
  munch: '/src/assets/games/pacman/sounds/munch.mp3',
  power_pellet: '/src/assets/games/pacman/sounds/power_pellet.mp3',
  eat_ghost: '/src/assets/games/pacman/sounds/eat_ghost.mp3',
  death: '/src/assets/games/pacman/sounds/death.mp3',
  level_complete: '/src/assets/games/pacman/sounds/level_complete.mp3'
};

// Game map: 0 = empty, 1 = wall, 2 = dot, 3 = power pellet
const INITIAL_MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 3, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 0, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Directions
const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

// Removed duplicate COLORS definition

function PacMan({ isPremium }) {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(isPremium ? 3 : 1);
  const [level, setLevel] = useState(1);
  const [touchMode, setTouchMode] = useState(false);

  // UI state
  const [playerName, setPlayerName] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [gameMode, setGameMode] = useState('classic'); // classic, dark, colorblind
  const [difficulty, setDifficulty] = useState('normal'); // easy, normal, hard
  const [showControls, setShowControls] = useState(true); // Accessibility feature
  const [highContrast, setHighContrast] = useState(false); // Accessibility feature

  // Game state tracking
  const ghostsEatenRef = useRef(0);
  const totalMovesRef = useRef(0);
  const powerPelletsEatenRef = useRef(0);
  const perfectLevelsRef = useRef(0);
  const dotsRemainingRef = useRef(0);
  const soundsRef = useRef({});

  // Game state
  const mapRef = useRef(JSON.parse(JSON.stringify(INITIAL_MAP)));
  const pacmanRef = useRef({
    x: 9,
    y: 13,
    direction: DIRECTIONS.RIGHT,
    nextDirection: DIRECTIONS.RIGHT,
    mouthOpen: true,
  });

  const ghostsRef = useRef([
    { x: 9, y: 7, direction: DIRECTIONS.LEFT, scared: false },
    { x: 8, y: 7, direction: DIRECTIONS.RIGHT, scared: false },
    { x: 10, y: 7, direction: DIRECTIONS.UP, scared: false },
    { x: 11, y: 7, direction: DIRECTIONS.DOWN, scared: false },
  ]);

  const powerModeRef = useRef(false);
  const powerModeTimerRef = useRef(null);
  const animationRef = useRef(null);
  const frameCountRef = useRef(0);

  // Premium features
  const ghostSpeedRef = useRef(isPremium ? 15 : 10); // Higher = slower
  const powerModeDurationRef = useRef(isPremium ? 10000 : 5000);
  const backgroundRef = useRef(null);

  // Game settings based on difficulty and mode
  const getGameSettings = useCallback(() => {
    // Base settings
    let settings = {
      ghostSpeed: isPremium ? 15 : 10,
      powerModeDuration: isPremium ? 10000 : 5000,
      ghostIntelligence: 0.7, // 0-1, higher means smarter ghosts
      powerPelletValue: 50,
      dotValue: 10,
      ghostValue: 200,
      colorScheme: {
        wall: COLORS.WALL,
        dot: COLORS.DOT,
        powerPellet: COLORS.POWER_PELLET,
        pacman: COLORS.PACMAN,
        background: COLORS.BACKGROUND,
        ghost: COLORS.GHOST,
        scaredGhost: COLORS.SCARED_GHOST
      }
    };

    // Apply difficulty settings
    switch (difficulty) {
      case 'easy':
        settings.ghostSpeed += 5; // Slower ghosts
        settings.powerModeDuration += 3000; // Longer power mode
        settings.ghostIntelligence = 0.5; // Less intelligent ghosts
        break;
      case 'hard':
        settings.ghostSpeed -= 5; // Faster ghosts
        settings.powerModeDuration -= 2000; // Shorter power mode
        settings.ghostIntelligence = 0.9; // More intelligent ghosts
        break;
      default: // normal
        break;
    }

    // Apply game mode settings
    switch (gameMode) {
      case 'dark':
        settings.colorScheme.background = '#111111';
        settings.colorScheme.wall = '#333333';
        settings.colorScheme.dot = '#CCCCCC';
        break;
      case 'colorblind':
        // High contrast colors that are distinguishable for colorblind users
        settings.colorScheme.pacman = '#FFFF00'; // Yellow
        settings.colorScheme.ghost = '#FF0000'; // Red
        settings.colorScheme.scaredGhost = '#0000FF'; // Blue
        settings.colorScheme.powerPellet = '#FFFFFF'; // White
        settings.colorScheme.dot = '#FFFFFF'; // White
        break;
      default: // classic
        break;
    }

    // Apply high contrast if enabled (accessibility feature)
    if (highContrast) {
      settings.colorScheme.wall = '#000000';
      settings.colorScheme.background = '#FFFFFF';
      settings.colorScheme.dot = '#000000';
      settings.colorScheme.powerPellet = '#FF0000';
      settings.colorScheme.pacman = '#000000';
      settings.colorScheme.ghost = '#FF0000';
      settings.colorScheme.scaredGhost = '#0000FF';
    }

    return settings;
  }, [isPremium, difficulty, gameMode, highContrast]);

  // Update game settings when difficulty or mode changes
  useEffect(() => {
    const settings = getGameSettings();
    ghostSpeedRef.current = settings.ghostSpeed;
    powerModeDurationRef.current = settings.powerModeDuration;
  }, [difficulty, gameMode, highContrast, getGameSettings]);

  // Initialize game
  const initGame = useCallback(() => {
    mapRef.current = JSON.parse(JSON.stringify(INITIAL_MAP));
    pacmanRef.current = {
      x: 9,
      y: 13,
      direction: DIRECTIONS.RIGHT,
      nextDirection: DIRECTIONS.RIGHT,
      mouthOpen: true,
    };

    ghostsRef.current = [
      { x: 9, y: 7, direction: DIRECTIONS.LEFT, scared: false },
      { x: 8, y: 7, direction: DIRECTIONS.RIGHT, scared: false },
      { x: 10, y: 7, direction: DIRECTIONS.UP, scared: false },
      { x: 11, y: 7, direction: DIRECTIONS.DOWN, scared: false },
    ];

    powerModeRef.current = false;
    if (powerModeTimerRef.current) {
      clearTimeout(powerModeTimerRef.current);
    }

    frameCountRef.current = 0;
    setScore(0);
    setGameOver(false);
    setLives(isPremium ? 3 : 1);
    setLevel(1);
    ghostSpeedRef.current = isPremium ? 15 : 10;
    powerModeDurationRef.current = isPremium ? 10000 : 5000;
  }, [isPremium]);

  // Start game
  const startGame = useCallback(() => {
    initGame();
    setGameStarted(true);

    // Play start sound
    if (soundsRef.current.start) {
      playSound(soundsRef.current.start, 0.7);
    }

    // Count dots for level completion check
    const dotsCount = mapRef.current.flat().filter(cell => cell === 2 || cell === 3).length;
    dotsRemainingRef.current = dotsCount;
  }, [initGame]);

  // Check if a position is valid for movement
  const isValidPosition = useCallback((x, y) => {
    // Check boundaries
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) {
      // Wrap around for the tunnel
      if (y === 9) {
        if (x < 0) return { x: COLS - 1, y };
        if (x >= COLS) return { x: 0, y };
      }
      return false;
    }

    // Check if it's a wall
    if (mapRef.current[y][x] === 1) {
      return false;
    }

    return { x, y };
  }, []);

  // Move pacman
  const movePacman = useCallback(() => {
    const pacman = pacmanRef.current;

    // Try to change direction if there's a next direction
    if (pacman.nextDirection !== pacman.direction) {
      const nextX = pacman.x + pacman.nextDirection.x;
      const nextY = pacman.y + pacman.nextDirection.y;
      const validPosition = isValidPosition(nextX, nextY);

      if (validPosition) {
        pacman.direction = pacman.nextDirection;
      }
    }

    // Move in the current direction
    const nextX = pacman.x + pacman.direction.x;
    const nextY = pacman.y + pacman.direction.y;
    const validPosition = isValidPosition(nextX, nextY);

    if (validPosition) {
      pacman.x = validPosition.x;
      pacman.y = validPosition.y;

      // Check if pacman ate a dot
      if (mapRef.current[pacman.y][pacman.x] === 2) {
        mapRef.current[pacman.y][pacman.x] = 0;
        setScore(prev => prev + 10);

        // Play munch sound
        if (soundsRef.current.munch) {
          playSound(soundsRef.current.munch, 0.3);
        }

        // Update dots remaining
        dotsRemainingRef.current--;
      }

      // Check if pacman ate a power pellet
      if (mapRef.current[pacman.y][pacman.x] === 3) {
        mapRef.current[pacman.y][pacman.x] = 0;
        setScore(prev => prev + 50);

        // Play power pellet sound
        if (soundsRef.current.power_pellet) {
          playSound(soundsRef.current.power_pellet, 0.5);
        }

        // Update dots remaining
        dotsRemainingRef.current--;

        // Activate power mode
        powerModeRef.current = true;
        ghostsRef.current.forEach(ghost => {
          ghost.scared = true;
        });

        // Clear existing timer
        if (powerModeTimerRef.current) {
          clearTimeout(powerModeTimerRef.current);
        }

        // Set timer to end power mode
        powerModeTimerRef.current = setTimeout(() => {
          powerModeRef.current = false;
          ghostsRef.current.forEach(ghost => {
            ghost.scared = false;
          });
        }, powerModeDurationRef.current);
      }

      // Check if all dots and power pellets are eaten
      if (dotsRemainingRef.current === 0) {
        // Level completed
        setLevel(prev => prev + 1);

        // Play level complete sound
        if (soundsRef.current.level_complete) {
          playSound(soundsRef.current.level_complete, 0.7);
        }

        // Reset the map but keep score and lives
        mapRef.current = JSON.parse(JSON.stringify(INITIAL_MAP));

        // Count dots for the new level
        const dotsCount = mapRef.current.flat().filter(cell => cell === 2 || cell === 3).length;
        dotsRemainingRef.current = dotsCount;

        // Increase difficulty
        ghostSpeedRef.current = Math.max(5, ghostSpeedRef.current - 2);

        // Reset positions
        pacmanRef.current.x = 9;
        pacmanRef.current.y = 13;
        pacmanRef.current.direction = DIRECTIONS.RIGHT;
        pacmanRef.current.nextDirection = DIRECTIONS.RIGHT;

        ghostsRef.current.forEach((ghost, i) => {
          ghost.x = 9 + i - 1;
          ghost.y = 7;
          ghost.scared = false;
        });
      }
    }

    // Animate mouth
    if (frameCountRef.current % 5 === 0) {
      pacman.mouthOpen = !pacman.mouthOpen;
    }
  }, [isValidPosition]);

  // Move ghosts
  const moveGhosts = useCallback(() => {
    // Only move ghosts every few frames based on speed
    if (frameCountRef.current % ghostSpeedRef.current !== 0) return;

    ghostsRef.current.forEach(ghost => {
      // Determine possible directions
      const possibleDirections = [];

      // Don't allow ghosts to reverse direction
      const oppositeDirection = {
        x: -ghost.direction.x,
        y: -ghost.direction.y
      };

      // Check each direction
      for (const dir of Object.values(DIRECTIONS)) {
        // Skip opposite direction
        if (dir.x === oppositeDirection.x && dir.y === oppositeDirection.y) {
          continue;
        }

        const nextX = ghost.x + dir.x;
        const nextY = ghost.y + dir.y;
        const validPosition = isValidPosition(nextX, nextY);

        if (validPosition) {
          possibleDirections.push({
            direction: dir,
            position: validPosition
          });
        }
      }

      // If no valid directions, allow reversing
      if (possibleDirections.length === 0) {
        const nextX = ghost.x + oppositeDirection.x;
        const nextY = ghost.y + oppositeDirection.y;
        const validPosition = isValidPosition(nextX, nextY);

        if (validPosition) {
          ghost.direction = oppositeDirection;
          ghost.x = validPosition.x;
          ghost.y = validPosition.y;
        }
        return;
      }

      // Choose a random direction from possible directions
      const randomIndex = Math.floor(Math.random() * possibleDirections.length);
      const { direction, position } = possibleDirections[randomIndex];

      ghost.direction = direction;
      ghost.x = position.x;
      ghost.y = position.y;

      // Check collision with pacman
      if (ghost.x === pacmanRef.current.x && ghost.y === pacmanRef.current.y) {
        if (ghost.scared) {
          // Pacman eats the ghost
          setScore(prev => {
            const newScore = prev + 200;

            // Update high score if needed
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('pacman-high-score', newScore.toString());
            }

            return newScore;
          });

          // Play eat ghost sound
          if (soundsRef.current.eat_ghost) {
            playSound(soundsRef.current.eat_ghost, 0.6);
          }

          // Reset ghost position
          ghost.x = 9;
          ghost.y = 7;
          ghost.scared = false;
        } else {
          // Ghost catches pacman
          if (lives > 1) {
            setLives(prev => prev - 1);

            // Play death sound
            if (soundsRef.current.death) {
              playSound(soundsRef.current.death, 0.5);
            }

            // Reset positions
            pacmanRef.current.x = 9;
            pacmanRef.current.y = 13;
            pacmanRef.current.direction = DIRECTIONS.RIGHT;
            pacmanRef.current.nextDirection = DIRECTIONS.RIGHT;

            ghostsRef.current.forEach((g, i) => {
              g.x = 9 + i - 1;
              g.y = 7;
              g.scared = false;
            });
          } else {
            // Game over
            setGameOver(true);

            // Play death sound
            if (soundsRef.current.death) {
              playSound(soundsRef.current.death, 0.7);
            }

            // Update high score if needed
            if (score > highScore) {
              setHighScore(score);
              localStorage.setItem('pacman-high-score', score.toString());
            }
          }
        }
      }
    });
  }, [isValidPosition, lives]);

  // Update game state
  const updateGame = useCallback(() => {
    if (!gameStarted || gameOver) return;

    frameCountRef.current++;

    movePacman();
    moveGhosts();

    // Draw game
    drawGame();

    // Continue animation
    animationRef.current = requestAnimationFrame(updateGame);
  }, [gameStarted, gameOver, movePacman, moveGhosts]);

  // Draw game
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background
    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw map
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cell = mapRef.current[y][x];

        if (cell === 1) {
          // Wall
          ctx.fillStyle = COLORS.WALL;
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        } else if (cell === 2) {
          // Dot
          ctx.fillStyle = COLORS.DOT;
          ctx.beginPath();
          ctx.arc(
            x * CELL_SIZE + CELL_SIZE / 2,
            y * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE / 10,
            0,
            Math.PI * 2
          );
          ctx.fill();
        } else if (cell === 3) {
          // Power pellet
          ctx.fillStyle = COLORS.POWER_PELLET;
          ctx.beginPath();
          ctx.arc(
            x * CELL_SIZE + CELL_SIZE / 2,
            y * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE / 4,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
    }

    // Draw pacman
    const pacman = pacmanRef.current;
    ctx.fillStyle = COLORS.PACMAN;
    ctx.beginPath();

    const pacmanX = pacman.x * CELL_SIZE + CELL_SIZE / 2;
    const pacmanY = pacman.y * CELL_SIZE + CELL_SIZE / 2;
    const pacmanRadius = CELL_SIZE / 2 - 2;

    if (pacman.mouthOpen) {
      // Determine mouth angles based on direction
      let startAngle = 0;
      let endAngle = 0;

      if (pacman.direction === DIRECTIONS.RIGHT) {
        startAngle = 0.25 * Math.PI;
        endAngle = 1.75 * Math.PI;
      } else if (pacman.direction === DIRECTIONS.LEFT) {
        startAngle = 1.25 * Math.PI;
        endAngle = 0.75 * Math.PI;
      } else if (pacman.direction === DIRECTIONS.UP) {
        startAngle = 1.75 * Math.PI;
        endAngle = 1.25 * Math.PI;
      } else if (pacman.direction === DIRECTIONS.DOWN) {
        startAngle = 0.75 * Math.PI;
        endAngle = 0.25 * Math.PI;
      }

      ctx.arc(pacmanX, pacmanY, pacmanRadius, startAngle, endAngle);
    } else {
      ctx.arc(pacmanX, pacmanY, pacmanRadius, 0, Math.PI * 2);
    }

    ctx.lineTo(pacmanX, pacmanY);
    ctx.fill();

    // Draw ghosts
    ghostsRef.current.forEach((ghost, index) => {
      // Different colors for different ghosts
      const ghostColors = [
        COLORS.GHOST,
        '#00FFFF',
        '#FFC0CB',
        '#FFA500'
      ];

      ctx.fillStyle = ghost.scared ? COLORS.SCARED_GHOST : ghostColors[index % ghostColors.length];

      // Draw ghost body
      ctx.beginPath();
      const ghostX = ghost.x * CELL_SIZE + CELL_SIZE / 2;
      const ghostY = ghost.y * CELL_SIZE + CELL_SIZE / 2;
      const ghostRadius = CELL_SIZE / 2 - 2;

      // Draw semi-circle for the top
      ctx.arc(ghostX, ghostY, ghostRadius, Math.PI, 0, false);

      // Draw the bottom part with waves
      ctx.lineTo(ghostX + ghostRadius, ghostY + ghostRadius);

      // Draw wavy bottom
      const waveHeight = ghostRadius / 3;
      const segments = 3;
      const segmentWidth = (ghostRadius * 2) / segments;

      for (let i = 0; i < segments; i++) {
        const waveX = ghostX + ghostRadius - (i + 1) * segmentWidth;
        ctx.lineTo(waveX, ghostY + ghostRadius - waveHeight);
        ctx.lineTo(waveX - segmentWidth / 2, ghostY + ghostRadius);
      }

      ctx.lineTo(ghostX - ghostRadius, ghostY);
      ctx.fill();

      // Draw eyes
      ctx.fillStyle = '#FFFFFF';
      const eyeRadius = ghostRadius / 3;
      const eyeOffsetX = ghostRadius / 3;
      const eyeOffsetY = -ghostRadius / 4;

      // Left eye
      ctx.beginPath();
      ctx.arc(ghostX - eyeOffsetX, ghostY + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Right eye
      ctx.beginPath();
      ctx.arc(ghostX + eyeOffsetX, ghostY + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw pupils
      ctx.fillStyle = '#000000';
      const pupilRadius = eyeRadius / 2;
      const pupilOffsetX = eyeOffsetX + ghost.direction.x * pupilRadius;
      const pupilOffsetY = eyeOffsetY + ghost.direction.y * pupilRadius;

      // Left pupil
      ctx.beginPath();
      ctx.arc(ghostX - pupilOffsetX, ghostY + pupilOffsetY, pupilRadius, 0, Math.PI * 2);
      ctx.fill();

      // Right pupil
      ctx.beginPath();
      ctx.arc(ghostX + pupilOffsetX, ghostY + pupilOffsetY, pupilRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw score
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 25);

    // Draw lives
    ctx.fillText(`Lives: ${lives}`, 10, 50);

    // Draw level
    ctx.fillText(`Level: ${level}`, 10, 75);

    // Draw power mode timer if active
    if (powerModeRef.current) {
      ctx.fillStyle = '#FFFF00';
      ctx.fillText('POWER MODE!', CANVAS_WIDTH - 150, 25);
    }
  }, [score, lives, level]);

  // Handle keyboard input
  const handleKeyDown = useCallback((e) => {
    if (!gameStarted || gameOver) return;

    switch (e.key) {
      case 'ArrowUp':
        pacmanRef.current.nextDirection = DIRECTIONS.UP;
        break;
      case 'ArrowDown':
        pacmanRef.current.nextDirection = DIRECTIONS.DOWN;
        break;
      case 'ArrowLeft':
        pacmanRef.current.nextDirection = DIRECTIONS.LEFT;
        break;
      case 'ArrowRight':
        pacmanRef.current.nextDirection = DIRECTIONS.RIGHT;
        break;
      default:
        break;
    }
  }, [gameStarted, gameOver]);

  // Set up game loop
  useEffect(() => {
    if (gameStarted && !gameOver) {
      animationRef.current = requestAnimationFrame(updateGame);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (powerModeTimerRef.current) {
        clearTimeout(powerModeTimerRef.current);
      }
    };
  }, [gameStarted, gameOver, updateGame]);

  // Set up event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Initial draw
  useEffect(() => {
    drawGame();
  }, [drawGame]);

  // Handle direction button clicks
  const handleDirectionClick = useCallback((direction) => {
    if (!gameStarted || gameOver) return;
    pacmanRef.current.nextDirection = direction;
    totalMovesRef.current++;
  }, [gameStarted, gameOver]);

  // Add notification
  const addNotification = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const notification = { id, message, type, duration };
    setNotifications(prev => [...prev, notification]);

    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }

    return id;
  };

  // Save score to leaderboard
  const saveScore = () => {
    if (!playerName) {
      setShowProfile(true);
      return;
    }

    const entry = {
      playerName,
      score,
      level,
      date: new Date().toISOString()
    };

    const added = addToLeaderboard('pacman', entry);

    if (added) {
      addNotification('Score saved to leaderboard!', 'success');
    }

    // Check for achievements
    const gameState = {
      score,
      level,
      ghostsEaten: ghostsEatenRef.current,
      powerPelletsEaten: powerPelletsEatenRef.current
    };

    const newAchievements = checkAchievements('pacman', playerName, gameState);

    if (newAchievements.length > 0) {
      // Show achievement notifications
      newAchievements.forEach(achievement => {
        addNotification(`Achievement Unlocked: ${achievement.title}`, 'success', 5000);
      });
    }
  };

  // Handle player name save
  const handlePlayerNameSave = (name) => {
    setPlayerName(name);
    setShowProfile(false);

    // If game is over, save score
    if (gameOver && score > 0) {
      setTimeout(() => saveScore(), 500);
    }
  };

  // Handle game mode selection
  const handleModeSelect = (mode) => {
    setGameMode(mode);
    addNotification(`Game mode changed to ${mode}`, 'info');
  };

  // Handle difficulty selection
  const handleDifficultySelect = (diff) => {
    setDifficulty(diff);
    addNotification(`Difficulty changed to ${diff}`, 'info');
  };

  // Toggle accessibility features
  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
    addNotification(`High contrast mode ${highContrast ? 'disabled' : 'enabled'}`, 'info');
  };

  const toggleShowControls = () => {
    setShowControls(prev => !prev);
    addNotification(`On-screen controls ${showControls ? 'hidden' : 'shown'}`, 'info');
  };

  return (
    <div className="pacman-game flex flex-col items-center">
      <div className="game-container flex flex-col md:flex-row gap-6">
        <div className="game-area relative">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-2 border-gray-800 rounded-lg shadow-lg"
          />

          {!gameStarted && (
            <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-4 text-center text-yellow-400">Pac-Man</h2>
              <div className="mb-6 text-center max-w-md">
                <p className="mb-4">
                  Use arrow keys or touch controls to navigate the maze and eat all the dots.
                </p>

                {/* Game Mode Selection */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Game Mode</h3>
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleModeSelect('classic')}
                      className={`px-3 py-1 rounded-full text-sm ${gameMode === 'classic'
                        ? 'bg-yellow-500 text-black'
                        : 'bg-gray-700 text-gray-300'}`}
                    >
                      Classic
                    </button>
                    <button
                      onClick={() => handleModeSelect('dark')}
                      className={`px-3 py-1 rounded-full text-sm ${gameMode === 'dark'
                        ? 'bg-yellow-500 text-black'
                        : 'bg-gray-700 text-gray-300'}`}
                    >
                      Dark Mode
                    </button>
                    <button
                      onClick={() => handleModeSelect('colorblind')}
                      className={`px-3 py-1 rounded-full text-sm ${gameMode === 'colorblind'
                        ? 'bg-yellow-500 text-black'
                        : 'bg-gray-700 text-gray-300'}`}
                    >
                      Colorblind
                    </button>
                  </div>
                </div>

                {/* Difficulty Selection */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Difficulty</h3>
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleDifficultySelect('easy')}
                      className={`px-3 py-1 rounded-full text-sm ${difficulty === 'easy'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-300'}`}
                    >
                      Easy
                    </button>
                    <button
                      onClick={() => handleDifficultySelect('normal')}
                      className={`px-3 py-1 rounded-full text-sm ${difficulty === 'normal'
                        ? 'bg-yellow-500 text-black'
                        : 'bg-gray-700 text-gray-300'}`}
                    >
                      Normal
                    </button>
                    <button
                      onClick={() => handleDifficultySelect('hard')}
                      className={`px-3 py-1 rounded-full text-sm ${difficulty === 'hard'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-700 text-gray-300'}`}
                    >
                      Hard
                    </button>
                  </div>
                </div>

                {/* Accessibility Options */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Accessibility</h3>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={toggleHighContrast}
                      className={`px-3 py-1 rounded-full text-sm ${highContrast
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300'}`}
                    >
                      High Contrast: {highContrast ? 'ON' : 'OFF'}
                    </button>
                    <button
                      onClick={toggleShowControls}
                      className={`px-3 py-1 rounded-full text-sm ${showControls
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300'}`}
                    >
                      Controls: {showControls ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>

                {isPremium && (
                  <div className="bg-yellow-600 text-white p-3 rounded-lg mb-4">
                    <p className="font-bold">Premium Features:</p>
                    <ul className="list-disc list-inside text-sm mt-2">
                      <li>3 Lives</li>
                      <li>Slower ghosts</li>
                      <li>Longer power pellet duration</li>
                      <li>Special ghost behaviors</li>
                    </ul>
                  </div>
                )}
              </div>
              <button
                onClick={startGame}
                className="btn bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-3 px-10 text-lg rounded-full hover:scale-105 transition-transform"
              >
                Start Game
              </button>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-4 text-center text-yellow-400">Game Over</h2>
              <div className="stats bg-gray-800 p-6 rounded-lg mb-6">
                <p className="text-xl mb-2">Score: <span className="font-bold text-yellow-400">{score}</span></p>
                <p className="text-xl mb-2">Level: <span className="font-bold text-green-400">{level}</span></p>
                <p className="text-xl">High Score: <span className="font-bold text-blue-400">{highScore}</span></p>
              </div>
              <div className="flex flex-col md:flex-row gap-3 mb-6">
                <button
                  onClick={() => setShowLeaderboard(true)}
                  className="btn bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full"
                >
                  Leaderboard
                </button>
                <button
                  onClick={() => setShowAchievements(true)}
                  className="btn bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-full"
                >
                  Achievements
                </button>
                <button
                  onClick={saveScore}
                  className="btn bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-full"
                >
                  Save Score
                </button>
              </div>
              <button
                onClick={startGame}
                className="btn bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-3 px-10 text-lg rounded-full hover:scale-105 transition-transform"
              >
                Play Again
              </button>
            </div>
          )}
        </div>

        <div className="game-sidebar flex flex-col justify-between">
          <div className="game-info bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">Game Stats</h3>

            <div className="stats space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Score:</span>
                <span className="text-xl font-bold">{score}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">High Score:</span>
                <span className="text-lg font-bold text-blue-600">{highScore}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Level:</span>
                <span className="text-lg font-bold text-green-600">{level}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Lives:</span>
                <span className="text-lg font-bold text-red-600">{lives}</span>
              </div>

              {powerModeRef.current && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-lg font-bold text-purple-600">POWER MODE!</span>
                </div>
              )}
            </div>
          </div>

          {isPremium && (
            <div className="premium-badge mt-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-2 px-6 rounded-lg text-center font-bold shadow-md">
              Premium Mode Active
            </div>
          )}

          <div className="game-controls mt-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">Controls</h3>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-3 flex justify-center mb-2">
                <button
                  onClick={() => handleDirectionClick(DIRECTIONS.UP)}
                  className="btn bg-gray-200 hover:bg-gray-300 text-black py-3 px-4 rounded-lg w-20 h-16"
                  disabled={!gameStarted || gameOver}
                >
                  ↑
                </button>
              </div>

              <button
                onClick={() => handleDirectionClick(DIRECTIONS.LEFT)}
                className="btn bg-gray-200 hover:bg-gray-300 text-black py-3 px-4 rounded-lg w-20 h-16"
                disabled={!gameStarted || gameOver}
              >
                ←
              </button>

              <button
                onClick={() => handleDirectionClick(DIRECTIONS.DOWN)}
                className="btn bg-gray-200 hover:bg-gray-300 text-black py-3 px-4 rounded-lg w-20 h-16"
                disabled={!gameStarted || gameOver}
              >
                ↓
              </button>

              <button
                onClick={() => handleDirectionClick(DIRECTIONS.RIGHT)}
                className="btn bg-gray-200 hover:bg-gray-300 text-black py-3 px-4 rounded-lg w-20 h-16"
                disabled={!gameStarted || gameOver}
              >
                →
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>Keyboard: Arrow keys to move</p>
              <p>Mobile: Touch buttons to change direction</p>
              <p className="mt-1">Eat power pellets to scare ghosts!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showLeaderboard && (
        <GameModal
          isOpen={showLeaderboard}
          onClose={() => setShowLeaderboard(false)}
          title="Pac-Man Leaderboard"
          size="lg"
        >
          <Leaderboard gameId="pacman" title="Top Scores" />
        </GameModal>
      )}

      {showAchievements && (
        <GameModal
          isOpen={showAchievements}
          onClose={() => setShowAchievements(false)}
          title="Pac-Man Achievements"
          size="lg"
        >
          <Achievements
            gameId="pacman"
            playerName={playerName}
            gameState={{
              score,
              level,
              ghostsEaten: ghostsEatenRef.current,
              powerPelletsEaten: powerPelletsEatenRef.current
            }}
          />
        </GameModal>
      )}

      {showProfile && (
        <GameModal
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
          title="Player Profile"
          size="sm"
        >
          <PlayerProfile
            initialName={playerName}
            onSave={handlePlayerNameSave}
          />
        </GameModal>
      )}

      {/* Notifications */}
      {notifications.map((notification) => (
        <GameNotification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
        />
      ))}
    </div>
  );
}

export default PacMan;
