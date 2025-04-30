import React, { useState, useEffect, useRef, useCallback } from 'react';

const CELL_SIZE = 20;
const GRID_SIZE = 20;
const CANVAS_SIZE = CELL_SIZE * GRID_SIZE;
const INITIAL_SPEED = 150;
const PREMIUM_SPEED = 200; // Slower speed for premium users

const Direction = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};

function Snake({ isPremium }) {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(Direction.RIGHT);
  const [nextDirection, setNextDirection] = useState(Direction.RIGHT);
  const [speed, setSpeed] = useState(isPremium ? PREMIUM_SPEED : INITIAL_SPEED);
  const [lives, setLives] = useState(isPremium ? 3 : 1);
  const [paused, setPaused] = useState(false);
  const [powerUp, setPowerUp] = useState(null);
  const [powerUpActive, setPowerUpActive] = useState(false);
  const [powerUpTimeLeft, setPowerUpTimeLeft] = useState(0);
  const gameLoopRef = useRef(null);
  const powerUpTimerRef = useRef(null);

  // Generate random position for food
  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };

    // Make sure food doesn't spawn on snake
    const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (isOnSnake) {
      return generateFood();
    }

    return newFood;
  }, [snake]);

  // Generate random power-up
  const generatePowerUp = useCallback(() => {
    // Only generate power-up with 10% chance when food is eaten
    if (Math.random() > 0.1) {
      setPowerUp(null);
      return;
    }

    const powerUpTypes = ['speed', 'invincibility', 'double-points'];
    const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    
    const newPowerUp = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
      type
    };

    // Make sure power-up doesn't spawn on snake or food
    const isOnSnake = snake.some(segment => segment.x === newPowerUp.x && segment.y === newPowerUp.y);
    const isOnFood = food.x === newPowerUp.x && food.y === newPowerUp.y;
    
    if (isOnSnake || isOnFood) {
      return generatePowerUp();
    }

    setPowerUp(newPowerUp);
  }, [snake, food]);

  // Initialize game
  const initGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection(Direction.RIGHT);
    setNextDirection(Direction.RIGHT);
    setScore(0);
    setGameOver(false);
    setLives(isPremium ? 3 : 1);
    setSpeed(isPremium ? PREMIUM_SPEED : INITIAL_SPEED);
    setPowerUp(null);
    setPowerUpActive(false);
    setPowerUpTimeLeft(0);
    
    if (powerUpTimerRef.current) {
      clearInterval(powerUpTimerRef.current);
    }
  }, [generateFood, isPremium]);

  // Start game
  const startGame = useCallback(() => {
    initGame();
    setGameStarted(true);
  }, [initGame]);

  // Move snake
  const moveSnake = useCallback(() => {
    if (paused || gameOver) return;

    setDirection(nextDirection);
    
    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      head.x += nextDirection.x;
      head.y += nextDirection.y;

      // Check if snake hits the wall
      const hitWall = head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE;
      
      // Check if snake hits itself
      const hitSelf = prevSnake.some((segment, index) => {
        // Skip the tail if the snake is moving
        if (index === prevSnake.length - 1) return false;
        return segment.x === head.x && segment.y === head.y;
      });

      // Handle collision
      if (hitWall || hitSelf) {
        if (powerUpActive && powerUp?.type === 'invincibility') {
          // Wrap around if invincible
          if (head.x < 0) head.x = GRID_SIZE - 1;
          if (head.x >= GRID_SIZE) head.x = 0;
          if (head.y < 0) head.y = GRID_SIZE - 1;
          if (head.y >= GRID_SIZE) head.y = 0;
        } else if (lives > 1) {
          // Lose a life
          setLives(prev => prev - 1);
          return [{ x: 10, y: 10 }];
        } else {
          // Game over
          setGameOver(true);
          if (score > highScore) {
            setHighScore(score);
          }
          return prevSnake;
        }
      }

      // Check if snake eats food
      const eatFood = head.x === food.x && head.y === food.y;
      
      // Check if snake eats power-up
      const eatPowerUp = powerUp && head.x === powerUp.x && head.y === powerUp.y;

      if (eatFood) {
        // Increase score
        const points = powerUpActive && powerUp?.type === 'double-points' ? 20 : 10;
        setScore(prev => prev + points);
        
        // Generate new food
        setFood(generateFood());
        
        // Possibly generate power-up
        generatePowerUp();
        
        // Don't remove tail when eating food
        const newSnake = [head, ...prevSnake];
        return newSnake;
      }

      if (eatPowerUp) {
        // Activate power-up
        activatePowerUp(powerUp.type);
        setPowerUp(null);
      }

      // Move snake (remove tail)
      const newSnake = [head, ...prevSnake.slice(0, -1)];
      return newSnake;
    });
  }, [
    direction, 
    nextDirection, 
    paused, 
    gameOver, 
    food, 
    powerUp, 
    powerUpActive, 
    lives, 
    score, 
    highScore, 
    generateFood, 
    generatePowerUp
  ]);

  // Activate power-up
  const activatePowerUp = useCallback((type) => {
    setPowerUpActive(true);
    setPowerUpTimeLeft(10); // 10 seconds

    // Apply power-up effect
    switch (type) {
      case 'speed':
        setSpeed(prev => prev * 1.5); // Slower speed (higher number)
        break;
      case 'invincibility':
        // Effect is handled in moveSnake
        break;
      case 'double-points':
        // Effect is handled in moveSnake
        break;
      default:
        break;
    }

    // Start power-up timer
    if (powerUpTimerRef.current) {
      clearInterval(powerUpTimerRef.current);
    }

    powerUpTimerRef.current = setInterval(() => {
      setPowerUpTimeLeft(prev => {
        if (prev <= 1) {
          // Deactivate power-up
          setPowerUpActive(false);
          clearInterval(powerUpTimerRef.current);
          
          // Reset speed if it was a speed power-up
          if (type === 'speed') {
            setSpeed(isPremium ? PREMIUM_SPEED : INITIAL_SPEED);
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [isPremium]);

  // Handle keyboard input
  const handleKeyDown = useCallback((e) => {
    if (gameOver) return;

    switch (e.key) {
      case 'ArrowUp':
        if (direction !== Direction.DOWN) {
          setNextDirection(Direction.UP);
        }
        break;
      case 'ArrowDown':
        if (direction !== Direction.UP) {
          setNextDirection(Direction.DOWN);
        }
        break;
      case 'ArrowLeft':
        if (direction !== Direction.RIGHT) {
          setNextDirection(Direction.LEFT);
        }
        break;
      case 'ArrowRight':
        if (direction !== Direction.LEFT) {
          setNextDirection(Direction.RIGHT);
        }
        break;
      case 'p':
        setPaused(prev => !prev);
        break;
      default:
        break;
    }
  }, [direction, gameOver]);

  // Handle direction button clicks
  const handleDirectionClick = useCallback((newDirection) => {
    if (gameOver) return;

    switch (newDirection) {
      case 'up':
        if (direction !== Direction.DOWN) {
          setNextDirection(Direction.UP);
        }
        break;
      case 'down':
        if (direction !== Direction.UP) {
          setNextDirection(Direction.DOWN);
        }
        break;
      case 'left':
        if (direction !== Direction.RIGHT) {
          setNextDirection(Direction.LEFT);
        }
        break;
      case 'right':
        if (direction !== Direction.LEFT) {
          setNextDirection(Direction.RIGHT);
        }
        break;
      default:
        break;
    }
  }, [direction, gameOver]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver || paused) return;

    const gameLoop = () => {
      moveSnake();
    };

    gameLoopRef.current = setTimeout(gameLoop, speed);

    return () => {
      clearTimeout(gameLoopRef.current);
    };
  }, [gameStarted, gameOver, paused, speed, moveSnake]);

  // Set up keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(gameLoopRef.current);
      clearInterval(powerUpTimerRef.current);
    };
  }, []);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    for (let i = 0; i < GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      // Head is a different color
      if (index === 0) {
        ctx.fillStyle = powerUpActive ? getPowerUpColor() : '#4CAF50';
      } else {
        ctx.fillStyle = powerUpActive ? getPowerUpColorLight() : '#8BC34A';
      }
      
      ctx.fillRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
      
      // Draw eyes on head
      if (index === 0) {
        ctx.fillStyle = '#000';
        
        // Position eyes based on direction
        let eyeX1, eyeY1, eyeX2, eyeY2;
        
        switch (Object.values(Direction).findIndex(d => d.x === direction.x && d.y === direction.y)) {
          case 0: // UP
            eyeX1 = segment.x * CELL_SIZE + CELL_SIZE * 0.25;
            eyeY1 = segment.y * CELL_SIZE + CELL_SIZE * 0.25;
            eyeX2 = segment.x * CELL_SIZE + CELL_SIZE * 0.75;
            eyeY2 = segment.y * CELL_SIZE + CELL_SIZE * 0.25;
            break;
          case 1: // DOWN
            eyeX1 = segment.x * CELL_SIZE + CELL_SIZE * 0.25;
            eyeY1 = segment.y * CELL_SIZE + CELL_SIZE * 0.75;
            eyeX2 = segment.x * CELL_SIZE + CELL_SIZE * 0.75;
            eyeY2 = segment.y * CELL_SIZE + CELL_SIZE * 0.75;
            break;
          case 2: // LEFT
            eyeX1 = segment.x * CELL_SIZE + CELL_SIZE * 0.25;
            eyeY1 = segment.y * CELL_SIZE + CELL_SIZE * 0.25;
            eyeX2 = segment.x * CELL_SIZE + CELL_SIZE * 0.25;
            eyeY2 = segment.y * CELL_SIZE + CELL_SIZE * 0.75;
            break;
          case 3: // RIGHT
            eyeX1 = segment.x * CELL_SIZE + CELL_SIZE * 0.75;
            eyeY1 = segment.y * CELL_SIZE + CELL_SIZE * 0.25;
            eyeX2 = segment.x * CELL_SIZE + CELL_SIZE * 0.75;
            eyeY2 = segment.y * CELL_SIZE + CELL_SIZE * 0.75;
            break;
          default:
            break;
        }
        
        ctx.beginPath();
        ctx.arc(eyeX1, eyeY1, CELL_SIZE * 0.1, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(eyeX2, eyeY2, CELL_SIZE * 0.1, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw food
    ctx.fillStyle = '#FF5722';
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw power-up
    if (powerUp) {
      ctx.fillStyle = getPowerUpColorByType(powerUp.type);
      ctx.beginPath();
      ctx.arc(
        powerUp.x * CELL_SIZE + CELL_SIZE / 2,
        powerUp.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      // Draw star shape inside
      const centerX = powerUp.x * CELL_SIZE + CELL_SIZE / 2;
      const centerY = powerUp.y * CELL_SIZE + CELL_SIZE / 2;
      const spikes = 5;
      const outerRadius = CELL_SIZE / 3;
      const innerRadius = CELL_SIZE / 6;
      
      ctx.beginPath();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI / spikes) * i;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.closePath();
      ctx.stroke();
    }
  }, [snake, food, powerUp, direction, powerUpActive]);

  // Helper function to get power-up color
  const getPowerUpColor = () => {
    if (!powerUp) return '#4CAF50';
    
    switch (powerUp.type) {
      case 'speed':
        return '#2196F3';
      case 'invincibility':
        return '#9C27B0';
      case 'double-points':
        return '#FFC107';
      default:
        return '#4CAF50';
    }
  };

  // Helper function to get power-up light color
  const getPowerUpColorLight = () => {
    if (!powerUp) return '#8BC34A';
    
    switch (powerUp.type) {
      case 'speed':
        return '#64B5F6';
      case 'invincibility':
        return '#CE93D8';
      case 'double-points':
        return '#FFE082';
      default:
        return '#8BC34A';
    }
  };

  // Helper function to get power-up color by type
  const getPowerUpColorByType = (type) => {
    switch (type) {
      case 'speed':
        return '#2196F3';
      case 'invincibility':
        return '#9C27B0';
      case 'double-points':
        return '#FFC107';
      default:
        return '#4CAF50';
    }
  };

  return (
    <div className="snake-game flex flex-col items-center">
      <div className="game-area relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="border-2 border-gray-300 rounded-lg shadow-md"
        />
        
        {!gameStarted && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Snake</h2>
            <p className="mb-6 text-center">
              Use arrow keys to control the snake. Eat food to grow longer.
              {isPremium && " Premium mode: 3 lives, slower speed, special power-ups."}
            </p>
            <button 
              onClick={startGame}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-full transition-colors"
            >
              Start Game
            </button>
          </div>
        )}
        
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Game Over</h2>
            <p className="mb-2">Score: {score}</p>
            <p className="mb-6">High Score: {highScore}</p>
            <button 
              onClick={startGame}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-full transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
        
        {paused && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Paused</h2>
            <p className="mb-6">Press 'P' to resume</p>
            <button 
              onClick={() => setPaused(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-full transition-colors"
            >
              Resume
            </button>
          </div>
        )}
      </div>
      
      <div className="game-info mt-6 flex justify-between w-full">
        <div>
          <p className="text-lg font-bold">Score: {score}</p>
          <p className="text-lg font-bold">High Score: {highScore}</p>
          <p className="text-lg font-bold">Lives: {lives}</p>
        </div>
        
        {powerUpActive && (
          <div className="flex flex-col items-center">
            <p className="text-lg font-bold">
              {powerUp?.type === 'speed' && 'Speed Boost'}
              {powerUp?.type === 'invincibility' && 'Invincibility'}
              {powerUp?.type === 'double-points' && 'Double Points'}
            </p>
            <p className="text-md">Time left: {powerUpTimeLeft}s</p>
          </div>
        )}
        
        <div className="flex space-x-2">
          {gameStarted && !gameOver && (
            <button 
              onClick={() => setPaused(prev => !prev)}
              className="border border-gray-300 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              {paused ? 'Resume' : 'Pause'}
            </button>
          )}
        </div>
      </div>
      
      {isPremium && (
        <div className="premium-badge mt-4 bg-yellow-400 text-black py-1 px-4 rounded-full text-sm font-bold">
          Premium Mode
        </div>
      )}
      
      <div className="game-controls mt-6 grid grid-cols-3 gap-2">
        <div></div>
        <button 
          onClick={() => handleDirectionClick('up')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md transition-colors"
          disabled={!gameStarted || gameOver || paused}
        >
          ↑
        </button>
        <div></div>
        <button 
          onClick={() => handleDirectionClick('left')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md transition-colors"
          disabled={!gameStarted || gameOver || paused}
        >
          ←
        </button>
        <button 
          onClick={() => handleDirectionClick('down')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md transition-colors"
          disabled={!gameStarted || gameOver || paused}
        >
          ↓
        </button>
        <button 
          onClick={() => handleDirectionClick('right')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md transition-colors"
          disabled={!gameStarted || gameOver || paused}
        >
          →
        </button>
      </div>
    </div>
  );
}

export default Snake;
