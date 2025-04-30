import React, { useState, useEffect, useRef, useCallback } from 'react';

const CELL_SIZE = 30;
const ROWS = 15;
const COLS = 19;
const CANVAS_WIDTH = COLS * CELL_SIZE;
const CANVAS_HEIGHT = ROWS * CELL_SIZE;

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

// Colors
const COLORS = {
  WALL: '#2121DE',
  DOT: '#FFFF00',
  POWER_PELLET: '#FFFF00',
  PACMAN: '#FFFF00',
  GHOST: '#FF0000',
  SCARED_GHOST: '#0000FF',
  BACKGROUND: '#000000',
};

function PacMan({ isPremium }) {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(isPremium ? 3 : 1);
  const [level, setLevel] = useState(1);
  
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
      }
      
      // Check if pacman ate a power pellet
      if (mapRef.current[pacman.y][pacman.x] === 3) {
        mapRef.current[pacman.y][pacman.x] = 0;
        setScore(prev => prev + 50);
        
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
      const dotsRemaining = mapRef.current.flat().filter(cell => cell === 2 || cell === 3).length;
      if (dotsRemaining === 0) {
        // Level completed
        setLevel(prev => prev + 1);
        
        // Reset the map but keep score and lives
        mapRef.current = JSON.parse(JSON.stringify(INITIAL_MAP));
        
        // Increase difficulty
        ghostSpeedRef.current = Math.max(5, ghostSpeedRef.current - 2);
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
          setScore(prev => prev + 200);
          
          // Reset ghost position
          ghost.x = 9;
          ghost.y = 7;
          ghost.scared = false;
        } else {
          // Ghost catches pacman
          if (lives > 1) {
            setLives(prev => prev - 1);
            
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
            setGameOver(true);
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
  }, [gameStarted, gameOver]);
  
  return (
    <div className="pacman-game flex flex-col items-center">
      <div className="game-area relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-2 border-gray-800"
        />
        
        {!gameStarted && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white p-8">
            <h2 className="text-2xl font-bold mb-4">Pac-Man</h2>
            <p className="mb-6 text-center">
              Use arrow keys to move. Eat all dots to complete the level.
              {isPremium && " Premium mode: 3 lives, slower ghosts, longer power pellets."}
            </p>
            <button 
              onClick={startGame}
              className="btn btn-primary py-2 px-8"
            >
              Start Game
            </button>
          </div>
        )}
        
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white p-8">
            <h2 className="text-2xl font-bold mb-4">Game Over</h2>
            <p className="mb-2">Score: {score}</p>
            <p className="mb-6">Level: {level}</p>
            <button 
              onClick={startGame}
              className="btn btn-primary py-2 px-8"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
      
      <div className="game-info mt-6">
        <p className="text-lg font-bold">Score: {score}</p>
        <p className="text-lg font-bold">Level: {level}</p>
        <p className="text-lg font-bold">Lives: {lives}</p>
        {powerModeRef.current && (
          <p className="text-lg font-bold text-yellow-500">POWER MODE!</p>
        )}
      </div>
      
      {isPremium && (
        <div className="premium-badge mt-4 bg-yellow-400 text-black py-1 px-4 rounded-full text-sm font-bold">
          Premium Mode
        </div>
      )}
      
      <div className="game-controls mt-6 grid grid-cols-3 gap-2">
        <div></div>
        <button 
          onClick={() => handleDirectionClick(DIRECTIONS.UP)}
          className="btn btn-outline border-black text-black py-2 px-4"
          disabled={!gameStarted || gameOver}
        >
          ↑
        </button>
        <div></div>
        <button 
          onClick={() => handleDirectionClick(DIRECTIONS.LEFT)}
          className="btn btn-outline border-black text-black py-2 px-4"
          disabled={!gameStarted || gameOver}
        >
          ←
        </button>
        <button 
          onClick={() => handleDirectionClick(DIRECTIONS.DOWN)}
          className="btn btn-outline border-black text-black py-2 px-4"
          disabled={!gameStarted || gameOver}
        >
          ↓
        </button>
        <button 
          onClick={() => handleDirectionClick(DIRECTIONS.RIGHT)}
          className="btn btn-outline border-black text-black py-2 px-4"
          disabled={!gameStarted || gameOver}
        >
          →
        </button>
      </div>
    </div>
  );
}

export default PacMan;
