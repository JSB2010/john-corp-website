import React, { useState, useEffect, useRef, useCallback } from 'react';
import { drawRoundedRect, createGradientBackground } from '../../utils/gameUtils';

// Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;
const BALL_SPEED = 5;
const PADDLE_SPEED = 8;
const SCORE_TO_WIN = 5;

// Colors
const COLORS = {
  BACKGROUND: '#000000',
  PADDLE: '#FFFFFF',
  BALL: '#FFFFFF',
  TEXT: '#FFFFFF',
  DIVIDER: 'rgba(255, 255, 255, 0.2)'
};

function Pong({ isPremium }) {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [winner, setWinner] = useState(null);
  const [difficulty, setDifficulty] = useState('normal'); // easy, normal, hard
  
  // Game state
  const playerPaddleRef = useRef({
    x: 50,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
  });
  
  const computerPaddleRef = useRef({
    x: CANVAS_WIDTH - 50 - PADDLE_WIDTH,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
  });
  
  const ballRef = useRef({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    size: BALL_SIZE,
    dx: BALL_SPEED,
    dy: BALL_SPEED
  });
  
  const keysRef = useRef({
    ArrowUp: false,
    ArrowDown: false,
    w: false,
    s: false
  });
  
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);
  
  // Premium features
  const playerPaddleSizeRef = useRef(isPremium ? PADDLE_HEIGHT * 1.2 : PADDLE_HEIGHT);
  const computerDifficultyRef = useRef(isPremium ? 0.8 : 1);
  const powerUpsEnabledRef = useRef(isPremium);
  
  // Initialize game
  const initGame = useCallback(() => {
    // Reset scores
    setPlayerScore(0);
    setComputerScore(0);
    setWinner(null);
    setGameOver(false);
    
    // Reset paddles
    playerPaddleRef.current = {
      x: 50,
      y: CANVAS_HEIGHT / 2 - playerPaddleSizeRef.current / 2,
      width: PADDLE_WIDTH,
      height: playerPaddleSizeRef.current,
      dy: 0
    };
    
    computerPaddleRef.current = {
      x: CANVAS_WIDTH - 50 - PADDLE_WIDTH,
      y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      dy: 0
    };
    
    // Reset ball with random direction
    const randomAngle = Math.random() * Math.PI / 4 - Math.PI / 8; // -22.5 to 22.5 degrees
    const direction = Math.random() > 0.5 ? 1 : -1;
    
    ballRef.current = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      size: BALL_SIZE,
      dx: direction * BALL_SPEED * Math.cos(randomAngle),
      dy: BALL_SPEED * Math.sin(randomAngle)
    };
    
    // Set difficulty
    switch (difficulty) {
      case 'easy':
        computerDifficultyRef.current = isPremium ? 0.6 : 0.7;
        break;
      case 'hard':
        computerDifficultyRef.current = isPremium ? 0.9 : 1.1;
        break;
      default: // normal
        computerDifficultyRef.current = isPremium ? 0.8 : 1;
        break;
    }
  }, [difficulty, isPremium]);
  
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
    // Move player paddle
    if (keysRef.current.ArrowUp || keysRef.current.w) {
      playerPaddleRef.current.y = Math.max(0, playerPaddleRef.current.y - PADDLE_SPEED);
    }
    
    if (keysRef.current.ArrowDown || keysRef.current.s) {
      playerPaddleRef.current.y = Math.min(
        CANVAS_HEIGHT - playerPaddleRef.current.height,
        playerPaddleRef.current.y + PADDLE_SPEED
      );
    }
    
    // Move computer paddle (AI)
    const computerPaddle = computerPaddleRef.current;
    const ball = ballRef.current;
    
    // Only move if ball is moving toward computer
    if (ball.dx > 0) {
      // Calculate ideal position
      const idealPosition = ball.y - computerPaddle.height / 2;
      
      // Add some "reaction time" based on difficulty
      const reactionSpeed = PADDLE_SPEED * computerDifficultyRef.current;
      
      if (computerPaddle.y < idealPosition) {
        computerPaddle.y = Math.min(
          idealPosition,
          computerPaddle.y + reactionSpeed
        );
      } else if (computerPaddle.y > idealPosition) {
        computerPaddle.y = Math.max(
          idealPosition,
          computerPaddle.y - reactionSpeed
        );
      }
      
      // Ensure paddle stays within bounds
      computerPaddle.y = Math.max(0, Math.min(CANVAS_HEIGHT - computerPaddle.height, computerPaddle.y));
    }
    
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Ball collision with top and bottom walls
    if (ball.y <= 0 || ball.y + ball.size >= CANVAS_HEIGHT) {
      ball.dy = -ball.dy;
      // Ensure ball stays within bounds
      ball.y = ball.y <= 0 ? 0 : CANVAS_HEIGHT - ball.size;
    }
    
    // Ball collision with paddles
    if (
      // Player paddle collision
      ball.x <= playerPaddleRef.current.x + playerPaddleRef.current.width &&
      ball.x + ball.size >= playerPaddleRef.current.x &&
      ball.y + ball.size >= playerPaddleRef.current.y &&
      ball.y <= playerPaddleRef.current.y + playerPaddleRef.current.height
    ) {
      // Calculate bounce angle based on where ball hits paddle
      const hitPosition = (ball.y + ball.size / 2 - playerPaddleRef.current.y) / playerPaddleRef.current.height;
      const bounceAngle = (hitPosition - 0.5) * Math.PI / 3; // -60 to 60 degrees
      
      // Update ball direction and slightly increase speed
      const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy) * 1.05;
      ball.dx = Math.abs(speed * Math.cos(bounceAngle));
      ball.dy = speed * Math.sin(bounceAngle);
      
      // Ensure ball doesn't get stuck in paddle
      ball.x = playerPaddleRef.current.x + playerPaddleRef.current.width;
    } else if (
      // Computer paddle collision
      ball.x + ball.size >= computerPaddleRef.current.x &&
      ball.x <= computerPaddleRef.current.x + computerPaddleRef.current.width &&
      ball.y + ball.size >= computerPaddleRef.current.y &&
      ball.y <= computerPaddleRef.current.y + computerPaddleRef.current.height
    ) {
      // Calculate bounce angle based on where ball hits paddle
      const hitPosition = (ball.y + ball.size / 2 - computerPaddleRef.current.y) / computerPaddleRef.current.height;
      const bounceAngle = (hitPosition - 0.5) * Math.PI / 3; // -60 to 60 degrees
      
      // Update ball direction and slightly increase speed
      const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy) * 1.05;
      ball.dx = -Math.abs(speed * Math.cos(bounceAngle));
      ball.dy = speed * Math.sin(bounceAngle);
      
      // Ensure ball doesn't get stuck in paddle
      ball.x = computerPaddleRef.current.x - ball.size;
    }
    
    // Ball out of bounds (scoring)
    if (ball.x + ball.size < 0) {
      // Computer scores
      setComputerScore(prevScore => {
        const newScore = prevScore + 1;
        
        // Check for game over
        if (newScore >= SCORE_TO_WIN) {
          setGameOver(true);
          setWinner('computer');
        }
        
        return newScore;
      });
      
      // Reset ball
      resetBall(-1);
    } else if (ball.x > CANVAS_WIDTH) {
      // Player scores
      setPlayerScore(prevScore => {
        const newScore = prevScore + 1;
        
        // Check for game over
        if (newScore >= SCORE_TO_WIN) {
          setGameOver(true);
          setWinner('player');
        }
        
        return newScore;
      });
      
      // Reset ball
      resetBall(1);
    }
  }, []);
  
  // Reset ball after scoring
  const resetBall = useCallback((direction) => {
    const randomAngle = Math.random() * Math.PI / 4 - Math.PI / 8; // -22.5 to 22.5 degrees
    
    ballRef.current = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      size: BALL_SIZE,
      dx: direction * BALL_SPEED * Math.cos(randomAngle),
      dy: BALL_SPEED * Math.sin(randomAngle)
    };
  }, []);
  
  // Draw game
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw center line
    ctx.setLineDash([10, 10]);
    ctx.strokeStyle = COLORS.DIVIDER;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw paddles
    ctx.fillStyle = COLORS.PADDLE;
    
    // Player paddle
    drawRoundedRect(
      ctx,
      playerPaddleRef.current.x,
      playerPaddleRef.current.y,
      playerPaddleRef.current.width,
      playerPaddleRef.current.height,
      3
    );
    
    // Computer paddle
    drawRoundedRect(
      ctx,
      computerPaddleRef.current.x,
      computerPaddleRef.current.y,
      computerPaddleRef.current.width,
      computerPaddleRef.current.height,
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
    
    // Draw scores
    ctx.fillStyle = COLORS.TEXT;
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    
    // Player score
    ctx.fillText(
      playerScore.toString(),
      CANVAS_WIDTH / 4,
      80
    );
    
    // Computer score
    ctx.fillText(
      computerScore.toString(),
      CANVAS_WIDTH * 3 / 4,
      80
    );
  }, [playerScore, computerScore]);
  
  // Handle key events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key in keysRef.current) {
        keysRef.current[e.key] = true;
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
  }, [gameStarted, gameOver]);
  
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
    if (direction === 'up') {
      playerPaddleRef.current.y = Math.max(0, playerPaddleRef.current.y - 20);
    } else {
      playerPaddleRef.current.y = Math.min(
        CANVAS_HEIGHT - playerPaddleRef.current.height,
        playerPaddleRef.current.y + 20
      );
    }
  };
  
  return (
    <div className="pong-game flex flex-col items-center">
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
              <h2 className="text-3xl font-bold mb-4 text-center">Pong</h2>
              <div className="mb-6 text-center max-w-md">
                <p className="mb-4">
                  Use arrow keys or W/S to move your paddle. First to {SCORE_TO_WIN} points wins!
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
                  <div className="bg-purple-500 text-white p-3 rounded-lg mb-4">
                    <p className="font-bold">Premium Features:</p>
                    <ul className="list-disc list-inside text-sm mt-2">
                      <li>Larger paddle (+20%)</li>
                      <li>Easier computer opponent</li>
                      <li>Power-ups during gameplay</li>
                    </ul>
                  </div>
                )}
              </div>
              <button 
                onClick={startGame}
                className="btn bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-10 text-lg rounded-full hover:scale-105 transition-transform"
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
                  {winner === 'player' ? 'You Won!' : 'Computer Won!'}
                </p>
                <p className="text-xl mb-2">
                  Final Score: <span className="font-bold text-yellow-400">{playerScore} - {computerScore}</span>
                </p>
              </div>
              <button 
                onClick={startGame}
                className="btn bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-10 text-lg rounded-full hover:scale-105 transition-transform"
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
                className="btn bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-10 text-lg rounded-full hover:scale-105 transition-transform"
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
                <span className="text-gray-600">Your Score:</span>
                <span className="text-xl font-bold">{playerScore}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Computer Score:</span>
                <span className="text-xl font-bold">{computerScore}</span>
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
                    <span className="text-lg font-bold text-purple-600">Active</span>
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
            <div className="premium-badge mt-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-6 rounded-lg text-center font-bold shadow-md">
              Premium Mode Active
            </div>
          )}
          
          <div className="game-controls mt-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">Controls</h3>
            
            <div className="grid grid-cols-1 gap-2">
              <button 
                onMouseDown={() => handlePaddleMove('up')}
                onTouchStart={() => handlePaddleMove('up')}
                className="btn bg-gray-200 hover:bg-gray-300 text-black py-3 px-4 rounded-lg"
                disabled={!gameStarted || gameOver || paused}
              >
                Move Up
              </button>
              <button 
                onMouseDown={() => handlePaddleMove('down')}
                onTouchStart={() => handlePaddleMove('down')}
                className="btn bg-gray-200 hover:bg-gray-300 text-black py-3 px-4 rounded-lg"
                disabled={!gameStarted || gameOver || paused}
              >
                Move Down
              </button>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>Keyboard: Arrow keys or W/S to move paddle</p>
              <p className="mt-1">Press P to pause/resume</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pong;
