import React, { useState, useEffect, useRef, useCallback } from 'react';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const GRAVITY = 0.5;
const JUMP_FORCE = -10;
const PIPE_WIDTH = 80;
const PIPE_GAP = 150;
const PIPE_SPEED = 3;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;

function FlappyBird({ isPremium }) {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(isPremium ? 3 : 1);
  
  // Game state
  const birdRef = useRef({
    x: 100,
    y: CANVAS_HEIGHT / 2,
    velocity: 0
  });
  
  const pipesRef = useRef([]);
  const frameRef = useRef(0);
  const animationRef = useRef(null);
  
  // Premium features
  const pipeGapRef = useRef(isPremium ? PIPE_GAP + 50 : PIPE_GAP);
  const pipeSpeedRef = useRef(isPremium ? PIPE_SPEED - 0.5 : PIPE_SPEED);
  
  // Initialize game
  const initGame = useCallback(() => {
    birdRef.current = {
      x: 100,
      y: CANVAS_HEIGHT / 2,
      velocity: 0
    };
    
    pipesRef.current = [];
    frameRef.current = 0;
    setScore(0);
    setGameOver(false);
    setLives(isPremium ? 3 : 1);
    pipeGapRef.current = isPremium ? PIPE_GAP + 50 : PIPE_GAP;
    pipeSpeedRef.current = isPremium ? PIPE_SPEED - 0.5 : PIPE_SPEED;
  }, [isPremium]);
  
  // Start game
  const startGame = useCallback(() => {
    initGame();
    setGameStarted(true);
  }, [initGame]);
  
  // Jump
  const jump = useCallback(() => {
    if (gameOver) return;
    
    birdRef.current.velocity = JUMP_FORCE;
  }, [gameOver]);
  
  // Add pipe
  const addPipe = useCallback(() => {
    const gapPosition = Math.random() * (CANVAS_HEIGHT - pipeGapRef.current - 100) + 50;
    
    pipesRef.current.push({
      x: CANVAS_WIDTH,
      topHeight: gapPosition,
      bottomY: gapPosition + pipeGapRef.current,
      passed: false
    });
  }, []);
  
  // Update game state
  const updateGame = useCallback(() => {
    if (!gameStarted || gameOver) return;
    
    const bird = birdRef.current;
    
    // Update bird position
    bird.velocity += GRAVITY;
    bird.y += bird.velocity;
    
    // Check if bird hits the ground or ceiling
    if (bird.y > CANVAS_HEIGHT - BIRD_HEIGHT || bird.y < 0) {
      if (lives > 1) {
        setLives(prev => prev - 1);
        bird.y = CANVAS_HEIGHT / 2;
        bird.velocity = 0;
      } else {
        setGameOver(true);
        if (score > highScore) {
          setHighScore(score);
        }
      }
    }
    
    // Add new pipe every 100 frames
    frameRef.current++;
    if (frameRef.current % 100 === 0) {
      addPipe();
    }
    
    // Update pipes
    for (let i = 0; i < pipesRef.current.length; i++) {
      const pipe = pipesRef.current[i];
      
      // Move pipe
      pipe.x -= pipeSpeedRef.current;
      
      // Check if bird passed the pipe
      if (!pipe.passed && bird.x > pipe.x + PIPE_WIDTH) {
        pipe.passed = true;
        setScore(prev => prev + 1);
      }
      
      // Check collision
      if (
        bird.x + BIRD_WIDTH > pipe.x &&
        bird.x < pipe.x + PIPE_WIDTH &&
        (bird.y < pipe.topHeight || bird.y + BIRD_HEIGHT > pipe.bottomY)
      ) {
        if (lives > 1) {
          setLives(prev => prev - 1);
          bird.y = CANVAS_HEIGHT / 2;
          bird.velocity = 0;
          
          // Remove the pipe that caused collision
          pipesRef.current.splice(i, 1);
          i--;
        } else {
          setGameOver(true);
          if (score > highScore) {
            setHighScore(score);
          }
        }
      }
    }
    
    // Remove pipes that are off screen
    pipesRef.current = pipesRef.current.filter(pipe => pipe.x > -PIPE_WIDTH);
    
    // Draw game
    drawGame();
    
    // Continue animation
    animationRef.current = requestAnimationFrame(updateGame);
  }, [gameStarted, gameOver, addPipe, score, highScore, lives]);
  
  // Draw game
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw pipes
    ctx.fillStyle = '#2E8B57';
    for (const pipe of pipesRef.current) {
      // Top pipe
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      
      // Bottom pipe
      ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, CANVAS_HEIGHT - pipe.bottomY);
    }
    
    // Draw bird
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(birdRef.current.x, birdRef.current.y, BIRD_WIDTH, BIRD_HEIGHT);
    
    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    
    // Draw lives if premium
    if (isPremium) {
      ctx.fillText(`Lives: ${lives}`, 10, 60);
    }
  }, [score, isPremium, lives]);
  
  // Handle keyboard input
  const handleKeyDown = useCallback((e) => {
    if (e.code === 'Space') {
      if (!gameStarted) {
        startGame();
      } else {
        jump();
      }
    }
  }, [gameStarted, startGame, jump]);
  
  // Handle canvas click
  const handleCanvasClick = useCallback(() => {
    if (!gameStarted) {
      startGame();
    } else {
      jump();
    }
  }, [gameStarted, startGame, jump]);
  
  // Set up game loop
  useEffect(() => {
    if (gameStarted && !gameOver) {
      animationRef.current = requestAnimationFrame(updateGame);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
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
  
  return (
    <div className="flappy-bird-game flex flex-col items-center">
      <div className="game-area relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onClick={handleCanvasClick}
          className="border-2 border-gray-800 cursor-pointer"
        />
        
        {!gameStarted && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white p-8">
            <h2 className="text-2xl font-bold mb-4">Flappy Bird</h2>
            <p className="mb-6 text-center">
              Click or press space to flap.
              {isPremium && " Premium mode: 3 lives, wider gaps, slower pipes."}
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
            <p className="mb-6">High Score: {highScore}</p>
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
        <p className="text-lg font-bold">High Score: {highScore}</p>
        {isPremium && <p className="text-lg font-bold">Lives: {lives}</p>}
      </div>
      
      {isPremium && (
        <div className="premium-badge mt-4 bg-yellow-400 text-black py-1 px-4 rounded-full text-sm font-bold">
          Premium Mode
        </div>
      )}
      
      <div className="game-controls mt-6">
        <button 
          onClick={jump}
          className="btn btn-primary py-2 px-8"
          disabled={!gameStarted || gameOver}
        >
          Flap
        </button>
      </div>
    </div>
  );
}

export default FlappyBird;
