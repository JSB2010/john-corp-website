import React, { useState, useEffect, useRef, useCallback } from 'react';
import { drawRoundedRect, createGradientBackground } from '../../utils/gameUtils';

// Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const BALL_SIZE = 10;
const BALL_SPEED = 5;
const BRICK_ROWS = 5;
const BRICK_COLS = 10;
const BRICK_WIDTH = 75;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 5;
const BRICK_TOP_OFFSET = 60;
const BRICK_LEFT_OFFSET = 15;

// Colors
const COLORS = {
  BACKGROUND: '#000000',
  PADDLE: '#FFFFFF',
  BALL: '#FFFFFF',
  TEXT: '#FFFFFF',
  BRICK_COLORS: [
    '#FF0000', // Red
    '#FF7F00', // Orange
    '#FFFF00', // Yellow
    '#00FF00', // Green
    '#0000FF'  // Blue
  ]
};

function Breakout({ isPremium }) {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(isPremium ? 5 : 3);
  const [level, setLevel] = useState(1);
  const [difficulty, setDifficulty] = useState('normal'); // easy, normal, hard
  
  // Game state
  const paddleRef = useRef({
    x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
    y: CANVAS_HEIGHT - PADDLE_HEIGHT - 10,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dx: 0
  });
  
  const ballRef = useRef({
    x: CANVAS_WIDTH / 2 - BALL_SIZE / 2,
    y: CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_SIZE - 10,
    size: BALL_SIZE,
    dx: 0,
    dy: 0
  });
  
  const bricksRef = useRef([]);
  const keysRef = useRef({
    ArrowLeft: false,
    ArrowRight: false
  });
  
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);
  
  // Premium features
  const paddleWidthRef = useRef(isPremium ? PADDLE_WIDTH * 1.2 : PADDLE_WIDTH);
  const ballSpeedRef = useRef(isPremium ? BALL_SPEED * 0.9 : BALL_SPEED);
  const powerUpsEnabledRef = useRef(isPremium);
  
  // Initialize bricks
  const initBricks = useCallback(() => {
    const bricks = [];
    
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        const brick = {
          x: col * (BRICK_WIDTH + BRICK_PADDING) + BRICK_LEFT_OFFSET,
          y: row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_TOP_OFFSET,
          width: BRICK_WIDTH,
          height: BRICK_HEIGHT,
          color: COLORS.BRICK_COLORS[row],
          status: 1 // 1 = active, 0 = broken
        };
        
        bricks.push(brick);
      }
    }
    
    return bricks;
  }, []);
  
  // Initialize game
  const initGame = useCallback(() => {
    // Reset score and lives
    setScore(0);
    setLives(isPremium ? 5 : 3);
    setGameOver(false);
    
    // Reset paddle
    paddleRef.current = {
      x: CANVAS_WIDTH / 2 - paddleWidthRef.current / 2,
      y: CANVAS_HEIGHT - PADDLE_HEIGHT - 10,
      width: paddleWidthRef.current,
      height: PADDLE_HEIGHT,
      dx: 0
    };
    
    // Reset ball (attached to paddle initially)
    ballRef.current = {
      x: CANVAS_WIDTH / 2 - BALL_SIZE / 2,
      y: CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_SIZE - 10,
      size: BALL_SIZE,
      dx: 0,
      dy: 0
    };
    
    // Initialize bricks
    bricksRef.current = initBricks();
    
    // Set difficulty
    switch (difficulty) {
      case 'easy':
        ballSpeedRef.current = isPremium ? BALL_SPEED * 0.8 : BALL_SPEED * 0.9;
        break;
      case 'hard':
        ballSpeedRef.current = isPremium ? BALL_SPEED * 1.1 : BALL_SPEED * 1.2;
        break;
      default: // normal
        ballSpeedRef.current = isPremium ? BALL_SPEED * 0.9 : BALL_SPEED;
        break;
    }
  }, [difficulty, isPremium, initBricks]);
  
  // Start game
  const startGame = useCallback(() => {
    initGame();
    setGameStarted(true);
    setPaused(false);
    
    // Start animation loop
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [initGame]);
  
  // Launch ball
  const launchBall = useCallback(() => {
    if (ballRef.current.dy === 0) {
      // Random angle between -45 and 45 degrees
      const angle = (Math.random() * 90 - 45) * Math.PI / 180;
      ballRef.current.dx = ballSpeedRef.current * Math.sin(angle);
      ballRef.current.dy = -ballSpeedRef.current * Math.cos(angle);
    }
  }, []);
  
  // Game loop
  const gameLoop = useCallback((timestamp) => {
    if (paused || gameOver) {
      return;
    }
    
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    
    // Update game state
    updateGame(deltaTime);
    
    // Draw game
    drawGame();
    
    // Continue loop
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [paused, gameOver]);
  
  // Update game state
  const updateGame = useCallback((deltaTime) => {
    const paddle = paddleRef.current;
    const ball = ballRef.current;
    
    // Move paddle
    if (keysRef.current.ArrowLeft) {
      paddle.dx = -8;
    } else if (keysRef.current.ArrowRight) {
      paddle.dx = 8;
    } else {
      paddle.dx = 0;
    }
    
    paddle.x += paddle.dx;
    
    // Keep paddle within bounds
    if (paddle.x < 0) {
      paddle.x = 0;
    } else if (paddle.x + paddle.width > CANVAS_WIDTH) {
      paddle.x = CANVAS_WIDTH - paddle.width;
    }
    
    // If ball is attached to paddle
    if (ball.dy === 0) {
      ball.x = paddle.x + paddle.width / 2 - ball.size / 2;
    } else {
      // Move ball
      ball.x += ball.dx;
      ball.y += ball.dy;
      
      // Ball collision with walls
      if (ball.x <= 0 || ball.x + ball.size >= CANVAS_WIDTH) {
        ball.dx = -ball.dx;
        // Ensure ball stays within bounds
        ball.x = ball.x <= 0 ? 0 : CANVAS_WIDTH - ball.size;
      }
      
      // Ball collision with top wall
      if (ball.y <= 0) {
        ball.dy = -ball.dy;
        ball.y = 0;
      }
      
      // Ball collision with paddle
      if (
        ball.y + ball.size >= paddle.y &&
        ball.y <= paddle.y + paddle.height &&
        ball.x + ball.size >= paddle.x &&
        ball.x <= paddle.x + paddle.width
      ) {
        // Calculate bounce angle based on where ball hits paddle
        const hitPosition = (ball.x + ball.size / 2 - paddle.x) / paddle.width;
        const bounceAngle = (hitPosition - 0.5) * Math.PI / 3; // -60 to 60 degrees
        
        // Update ball direction
        const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        ball.dx = speed * Math.sin(bounceAngle);
        ball.dy = -speed * Math.cos(bounceAngle);
        
        // Ensure ball doesn't get stuck in paddle
        ball.y = paddle.y - ball.size;
      }
      
      // Ball collision with bricks
      for (let i = 0; i < bricksRef.current.length; i++) {
        const brick = bricksRef.current[i];
        
        if (brick.status === 1) {
          if (
            ball.x + ball.size >= brick.x &&
            ball.x <= brick.x + brick.width &&
            ball.y + ball.size >= brick.y &&
            ball.y <= brick.y + brick.height
          ) {
            // Determine which side of the brick was hit
            const ballCenterX = ball.x + ball.size / 2;
            const ballCenterY = ball.y + ball.size / 2;
            const brickCenterX = brick.x + brick.width / 2;
            const brickCenterY = brick.y + brick.height / 2;
            
            const dx = ballCenterX - brickCenterX;
            const dy = ballCenterY - brickCenterY;
            
            // Calculate absolute distances
            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);
            
            // Determine if collision is more horizontal or vertical
            if (absDx * brick.height > absDy * brick.width) {
              // Horizontal collision
              ball.dx = -ball.dx;
            } else {
              // Vertical collision
              ball.dy = -ball.dy;
            }
            
            // Break the brick
            brick.status = 0;
            
            // Update score
            setScore(prevScore => prevScore + 10);
            
            // Check if all bricks are broken
            const remainingBricks = bricksRef.current.filter(b => b.status === 1).length;
            if (remainingBricks === 0) {
              // Level complete
              setLevel(prevLevel => prevLevel + 1);
              
              // Reset ball and paddle
              paddle.x = CANVAS_WIDTH / 2 - paddle.width / 2;
              ball.x = paddle.x + paddle.width / 2 - ball.size / 2;
              ball.y = paddle.y - ball.size;
              ball.dx = 0;
              ball.dy = 0;
              
              // Create new bricks with increased difficulty
              bricksRef.current = initBricks();
              
              // Increase ball speed
              ballSpeedRef.current *= 1.1;
            }
            
            // Only handle one brick collision per frame
            break;
          }
        }
      }
      
      // Ball out of bounds (bottom)
      if (ball.y + ball.size > CANVAS_HEIGHT) {
        setLives(prevLives => {
          const newLives = prevLives - 1;
          
          if (newLives <= 0) {
            // Game over
            setGameOver(true);
          } else {
            // Reset ball and paddle
            paddle.x = CANVAS_WIDTH / 2 - paddle.width / 2;
            ball.x = paddle.x + paddle.width / 2 - ball.size / 2;
            ball.y = paddle.y - ball.size;
            ball.dx = 0;
            ball.dy = 0;
          }
          
          return newLives;
        });
      }
    }
  }, [initBricks]);
  
  // Draw game
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw paddle
    ctx.fillStyle = COLORS.PADDLE;
    drawRoundedRect(
      ctx,
      paddleRef.current.x,
      paddleRef.current.y,
      paddleRef.current.width,
      paddleRef.current.height,
      3
    );
    
    // Draw ball
    ctx.fillStyle = COLORS.BALL;
    ctx.beginPath();
    ctx.arc(
      ballRef.current.x + ballRef.current.size / 2,
      ballRef.current.y + ballRef.current.size / 2,
      ballRef.current.size / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Draw bricks
    bricksRef.current.forEach(brick => {
      if (brick.status === 1) {
        ctx.fillStyle = brick.color;
        drawRoundedRect(
          ctx,
          brick.x,
          brick.y,
          brick.width,
          brick.height,
          3
        );
      }
    });
    
    // Draw score
    ctx.fillStyle = COLORS.TEXT;
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 10, 30);
    
    // Draw lives
    ctx.textAlign = 'right';
    ctx.fillText(`Lives: ${lives}`, CANVAS_WIDTH - 10, 30);
    
    // Draw level
    ctx.textAlign = 'center';
    ctx.fillText(`Level: ${level}`, CANVAS_WIDTH / 2, 30);
    
    // Draw launch instructions if ball is not moving
    if (gameStarted && !gameOver && ballRef.current.dy === 0) {
      ctx.font = '16px Arial';
      ctx.fillText('Click or press Space to launch', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 40);
    }
  }, [score, lives, level, gameStarted, gameOver]);
  
  // Handle key events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key in keysRef.current) {
        keysRef.current[e.key] = true;
      }
      
      // Launch ball with space
      if (e.key === ' ' && gameStarted && !gameOver && !paused) {
        launchBall();
      }
      
      // Pause game with 'p'
      if (e.key === 'p' && gameStarted && !gameOver) {
        setPaused(prev => !prev);
      }
    };
    
    const handleKeyUp = (e) => {
      if (e.key in keysRef.current) {
        keysRef.current[e.key] = false;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, gameOver, paused, launchBall]);
  
  // Handle mouse/touch events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleMouseMove = (e) => {
      if (gameStarted && !gameOver && !paused) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        
        // Move paddle to mouse position
        paddleRef.current.x = mouseX - paddleRef.current.width / 2;
        
        // Keep paddle within bounds
        if (paddleRef.current.x < 0) {
          paddleRef.current.x = 0;
        } else if (paddleRef.current.x + paddleRef.current.width > CANVAS_WIDTH) {
          paddleRef.current.x = CANVAS_WIDTH - paddleRef.current.width;
        }
        
        // Move ball with paddle if not launched
        if (ballRef.current.dy === 0) {
          ballRef.current.x = paddleRef.current.x + paddleRef.current.width / 2 - ballRef.current.size / 2;
        }
      }
    };
    
    const handleClick = () => {
      if (gameStarted && !gameOver && !paused && ballRef.current.dy === 0) {
        launchBall();
      }
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [gameStarted, gameOver, paused, launchBall]);
  
  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Initial draw
    drawGame();
    
    // Cleanup animation on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawGame]);
  
  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };
  
  // Handle paddle movement via buttons (for mobile)
  const handlePaddleMove = (direction) => {
    if (direction === 'left') {
      paddleRef.current.x = Math.max(0, paddleRef.current.x - 20);
    } else {
      paddleRef.current.x = Math.min(
        CANVAS_WIDTH - paddleRef.current.width,
        paddleRef.current.x + 20
      );
    }
    
    // Move ball with paddle if not launched
    if (ballRef.current.dy === 0) {
      ballRef.current.x = paddleRef.current.x + paddleRef.current.width / 2 - ballRef.current.size / 2;
    }
  };
  
  return (
    <div className="breakout-game flex flex-col items-center">
      <div className="game-container flex flex-col md:flex-row gap-6">
        <div className="game-area relative">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-2 border-gray-800 rounded-lg shadow-lg bg-black"
          />
          
          {!gameStarted && (
            <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-4 text-center">Breakout</h2>
              <div className="mb-6 text-center max-w-md">
                <p className="mb-4">
                  Use arrow keys or mouse to move the paddle. Break all the bricks to advance to the next level!
                </p>
                
                {/* Difficulty Selection */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Difficulty</h3>
                  <div className="flex justify-center space-x-2">
                    <button 
                      onClick={() => handleDifficultyChange('easy')}
                      className={`px-3 py-1 rounded-full text-sm ${difficulty === 'easy' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-700 text-gray-300'}`}
                    >
                      Easy
                    </button>
                    <button 
                      onClick={() => handleDifficultyChange('normal')}
                      className={`px-3 py-1 rounded-full text-sm ${difficulty === 'normal' 
                        ? 'bg-yellow-500 text-black' 
                        : 'bg-gray-700 text-gray-300'}`}
                    >
                      Normal
                    </button>
                    <button 
                      onClick={() => handleDifficultyChange('hard')}
                      className={`px-3 py-1 rounded-full text-sm ${difficulty === 'hard' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-700 text-gray-300'}`}
                    >
                      Hard
                    </button>
                  </div>
                </div>
                
                {isPremium && (
                  <div className="bg-blue-500 text-white p-3 rounded-lg mb-4">
                    <p className="font-bold">Premium Features:</p>
                    <ul className="list-disc list-inside text-sm mt-2">
                      <li>Wider paddle (+20%)</li>
                      <li>Slower ball speed</li>
                      <li>5 lives instead of 3</li>
                      <li>Power-ups during gameplay</li>
                    </ul>
                  </div>
                )}
              </div>
              <button 
                onClick={startGame}
                className="btn bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-10 text-lg rounded-full hover:scale-105 transition-transform"
              >
                Start Game
              </button>
            </div>
          )}
          
          {gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-4 text-center">Game Over</h2>
              <div className="stats bg-gray-800 p-6 rounded-lg mb-6">
                <p className="text-xl mb-2">
                  Final Score: <span className="font-bold text-yellow-400">{score}</span>
                </p>
                <p className="text-xl mb-2">
                  Level Reached: <span className="font-bold text-green-400">{level}</span>
                </p>
              </div>
              <button 
                onClick={startGame}
                className="btn bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-10 text-lg rounded-full hover:scale-105 transition-transform"
              >
                Play Again
              </button>
            </div>
          )}
          
          {paused && (
            <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-4">Paused</h2>
              <p className="mb-6 text-center">Press 'P' to resume</p>
              <button 
                onClick={() => setPaused(false)}
                className="btn bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-10 text-lg rounded-full hover:scale-105 transition-transform"
              >
                Resume
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
                <span className="text-gray-600">Lives:</span>
                <span className="text-xl font-bold text-red-600">{lives}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Level:</span>
                <span className="text-xl font-bold text-green-600">{level}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Difficulty:</span>
                <span className={`text-lg font-bold ${
                  difficulty === 'easy' ? 'text-green-600' : 
                  difficulty === 'hard' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
              </div>
              
              {isPremium && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Premium Mode:</span>
                    <span className="text-lg font-bold text-blue-600">Active</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex flex-col space-y-2">
              {gameStarted && !gameOver && (
                <button 
                  onClick={() => setPaused(prev => !prev)}
                  className="btn btn-outline border-black text-black py-2 px-4 w-full"
                >
                  {paused ? 'Resume Game' : 'Pause Game'}
                </button>
              )}
            </div>
          </div>
          
          {isPremium && (
            <div className="premium-badge mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-6 rounded-lg text-center font-bold shadow-md">
              Premium Mode Active
            </div>
          )}
          
          <div className="game-controls mt-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">Controls</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onMouseDown={() => handlePaddleMove('left')}
                onTouchStart={() => handlePaddleMove('left')}
                className="btn bg-gray-200 hover:bg-gray-300 text-black py-3 px-4 rounded-lg"
                disabled={!gameStarted || gameOver || paused}
              >
                Move Left
              </button>
              <button 
                onMouseDown={() => handlePaddleMove('right')}
                onTouchStart={() => handlePaddleMove('right')}
                className="btn bg-gray-200 hover:bg-gray-300 text-black py-3 px-4 rounded-lg"
                disabled={!gameStarted || gameOver || paused}
              >
                Move Right
              </button>
            </div>
            
            {gameStarted && !gameOver && !paused && ballRef.current.dy === 0 && (
              <button 
                onClick={launchBall}
                className="btn bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg w-full mt-2"
              >
                Launch Ball
              </button>
            )}
            
            <div className="mt-4 text-sm text-gray-600">
              <p>Keyboard: Arrow keys to move paddle</p>
              <p className="mt-1">Space to launch ball</p>
              <p className="mt-1">Press P to pause/resume</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Breakout;
