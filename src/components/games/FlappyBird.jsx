import React, { useState, useEffect, useRef, useCallback } from 'react';
import { loadAudio, playSound, createGradientBackground, drawRoundedRect, createParticleEffect } from '../../utils/gameUtils';
import { preloadAssets, loadSound, playSound as playGameSound, stopSound } from '../../utils/gameAssets';
import { checkAchievements } from '../../utils/achievements';
import { addToLeaderboard, qualifiesForLeaderboard } from '../../utils/leaderboard';
import GameModal from '../common/GameModal';
import Leaderboard from '../common/Leaderboard';
import Achievements from '../common/Achievements';
import PlayerProfile from '../common/PlayerProfile';
import GameNotification, { NotificationManager } from '../common/GameNotification';

// Game constants
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const GRAVITY = 0.5;
const JUMP_FORCE = -10;
const PIPE_WIDTH = 80;
const PIPE_GAP = 150;
const PIPE_SPEED = 3;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;

// Game colors
const COLORS = {
  SKY_TOP: '#64B5F6',
  SKY_BOTTOM: '#1976D2',
  GROUND: '#8D6E63',
  GRASS: '#4CAF50',
  PIPE: '#43A047',
  PIPE_HIGHLIGHT: '#66BB6A',
  PIPE_SHADOW: '#2E7D32',
  BIRD_BODY: '#FFEB3B',
  BIRD_WING: '#FFA000',
  BIRD_BEAK: '#FF5722',
  BIRD_EYE: '#212121',
  CLOUD: '#FFFFFF',
  POWERUP: '#E040FB'
};

// Sound effects paths
const SOUND_PATHS = {
  flap: '/src/assets/games/flappybird/sounds/flap.mp3',
  point: '/src/assets/games/flappybird/sounds/point.mp3',
  hit: '/src/assets/games/flappybird/sounds/hit.mp3',
  die: '/src/assets/games/flappybird/sounds/die.mp3',
  powerup: '/src/assets/games/flappybird/sounds/powerup.mp3'
};

function FlappyBird({ isPremium }) {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(isPremium ? 3 : 1);
  const [touchMode, setTouchMode] = useState(false);

  // UI state
  const [playerName, setPlayerName] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [gameMode, setGameMode] = useState('classic'); // classic, night, challenge
  const [difficulty, setDifficulty] = useState('normal'); // easy, normal, hard

  // Game state tracking
  const powerupsCollectedRef = useRef(0);
  const totalJumpsRef = useRef(0);
  const distanceTraveledRef = useRef(0);
  const narrowEscapesRef = useRef(0);

  // Game state
  const birdRef = useRef({
    x: 100,
    y: CANVAS_HEIGHT / 2,
    velocity: 0,
    rotation: 0,
    wingUp: false,
    wingTimer: 0
  });

  const pipesRef = useRef([]);
  const cloudsRef = useRef([]);
  const powerUpsRef = useRef([]);
  const obstaclesRef = useRef([]); // Additional obstacles for challenge mode
  const frameRef = useRef(0);
  const animationRef = useRef(null);
  const soundsRef = useRef({});
  const invincibleRef = useRef(false);
  const invincibleTimerRef = useRef(null);
  const backgroundRef = useRef(null); // For parallax background

  // Game settings based on difficulty and mode
  const getGameSettings = useCallback(() => {
    // Base settings
    let settings = {
      pipeGap: PIPE_GAP,
      pipeSpeed: PIPE_SPEED,
      gravity: GRAVITY,
      jumpForce: JUMP_FORCE,
      powerUpChance: 0.1,
      obstacleChance: 0,
      backgroundSpeed: 0.5,
      nightMode: false
    };

    // Apply premium benefits
    if (isPremium) {
      settings.pipeGap += 50;
      settings.pipeSpeed -= 0.5;
      settings.powerUpChance = 0.2;
    }

    // Apply difficulty settings
    switch (difficulty) {
      case 'easy':
        settings.pipeGap += 30;
        settings.pipeSpeed -= 0.3;
        settings.gravity = GRAVITY * 0.8;
        break;
      case 'hard':
        settings.pipeGap -= 20;
        settings.pipeSpeed += 0.5;
        settings.gravity = GRAVITY * 1.2;
        settings.powerUpChance = settings.powerUpChance / 2;
        break;
      default: // normal
        break;
    }

    // Apply game mode settings
    switch (gameMode) {
      case 'night':
        settings.nightMode = true;
        settings.backgroundSpeed = 0.3;
        break;
      case 'challenge':
        settings.obstacleChance = 0.05;
        settings.powerUpChance += 0.1;
        break;
      default: // classic
        break;
    }

    return settings;
  }, [isPremium, difficulty, gameMode]);

  // Update game settings when difficulty or mode changes
  useEffect(() => {
    const settings = getGameSettings();
    pipeGapRef.current = settings.pipeGap;
    pipeSpeedRef.current = settings.pipeSpeed;
  }, [difficulty, gameMode, getGameSettings]);

  // Load sound effects and player data
  useEffect(() => {
    const loadSounds = async () => {
      try {
        const sounds = {};
        for (const [key, path] of Object.entries(SOUND_PATHS)) {
          try {
            sounds[key] = await loadAudio(path);
          } catch (err) {
            console.warn(`Failed to load sound: ${path}`, err);
          }
        }
        soundsRef.current = sounds;
      } catch (err) {
        console.error('Error loading sounds:', err);
      }
    };

    loadSounds();

    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('flappybird-high-score');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }

    // Load player name
    const savedPlayerName = localStorage.getItem('playerName');
    if (savedPlayerName) {
      setPlayerName(savedPlayerName);
    }

    // Detect touch device
    setTouchMode('ontouchstart' in window);

    // Load background image
    const bgImg = new Image();
    bgImg.src = '/src/assets/games/flappybird/sprites/background.png';
    bgImg.onload = () => {
      backgroundRef.current = bgImg;
    };
  }, []);

  // Initialize game
  const initGame = useCallback(() => {
    birdRef.current = {
      x: 100,
      y: CANVAS_HEIGHT / 2,
      velocity: 0,
      rotation: 0,
      wingUp: false,
      wingTimer: 0
    };

    pipesRef.current = [];
    frameRef.current = 0;
    setScore(0);
    setGameOver(false);
    setLives(isPremium ? 3 : 1);
    pipeGapRef.current = isPremium ? PIPE_GAP + 50 : PIPE_GAP;
    pipeSpeedRef.current = isPremium ? PIPE_SPEED - 0.5 : PIPE_SPEED;

    // Initialize clouds
    if (cloudsRef.current.length === 0) {
      for (let i = 0; i < 3; i++) {
        cloudsRef.current.push({
          x: Math.random() * CANVAS_WIDTH,
          y: Math.random() * (CANVAS_HEIGHT / 2),
          width: Math.random() * 60 + 40,
          height: Math.random() * 30 + 20,
          speed: Math.random() * 0.5 + 0.2
        });
      }
    }

    // Clear any existing power-ups
    powerUpsRef.current = [];

    // Clear invincibility
    if (invincibleTimerRef.current) {
      clearTimeout(invincibleTimerRef.current);
      invincibleTimerRef.current = null;
    }
    invincibleRef.current = false;
  }, [isPremium]);

  // Start game
  const startGame = useCallback(() => {
    initGame();
    setGameStarted(true);

    // Play start sound
    if (soundsRef.current.flap) {
      playSound(soundsRef.current.flap, 0.5);
    }
  }, [initGame]);

  // Jump
  const jump = useCallback(() => {
    if (gameOver) return;

    const bird = birdRef.current;
    bird.velocity = JUMP_FORCE;
    bird.rotation = -20; // Rotate bird up
    bird.wingUp = !bird.wingUp; // Flap wings

    // Play flap sound
    if (soundsRef.current.flap) {
      playSound(soundsRef.current.flap, 0.3);
    }
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

    // Add power-up for premium users (10% chance)
    if (isPremium && Math.random() < 0.1) {
      // Position power-up in the middle of the gap
      const powerUpY = gapPosition + (pipeGapRef.current / 2) - 15;

      powerUpsRef.current.push({
        x: CANVAS_WIDTH + PIPE_WIDTH + 20, // Position after the pipe
        y: powerUpY,
        width: 30,
        height: 30,
        collected: false,
        type: 'invincibility'
      });
    }
  }, [isPremium]);

  // Update bird physics
  const updateBird = (bird) => {
    // Update bird position
    bird.velocity += GRAVITY;
    bird.y += bird.velocity;

    // Update bird rotation based on velocity
    if (bird.velocity < 0) {
      // Going up
      bird.rotation = Math.max(-30, bird.rotation - 2);
    } else {
      // Going down
      bird.rotation = Math.min(90, bird.rotation + 2);
    }

    // Update wing animation
    bird.wingTimer++;
    if (bird.wingTimer > 5) {
      bird.wingTimer = 0;
      bird.wingUp = !bird.wingUp;
    }

    // Check if bird hits the ground
    if (bird.y > CANVAS_HEIGHT - BIRD_HEIGHT - 50) { // 50 is ground height
      bird.y = CANVAS_HEIGHT - BIRD_HEIGHT - 50;
      return true; // Collision with ground
    }

    // Check if bird hits the ceiling
    if (bird.y < 0) {
      bird.y = 0;
      bird.velocity = 1; // Bounce off ceiling
    }

    return false; // No collision
  };

  // Check collision between bird and pipe
  const checkPipeCollision = (bird, pipe) => {
    // Skip collision check if invincible
    if (invincibleRef.current) return false;

    return (
      bird.x + BIRD_WIDTH > pipe.x &&
      bird.x < pipe.x + PIPE_WIDTH &&
      (bird.y < pipe.topHeight || bird.y + BIRD_HEIGHT > pipe.bottomY)
    );
  };

  // Check collision between bird and power-up
  const checkPowerUpCollision = (bird, powerUp) => {
    if (powerUp.collected) return false;

    return (
      bird.x + BIRD_WIDTH > powerUp.x &&
      bird.x < powerUp.x + powerUp.width &&
      bird.y + BIRD_HEIGHT > powerUp.y &&
      bird.y < powerUp.y + powerUp.height
    );
  };

  // Activate power-up
  const activatePowerUp = (powerUp) => {
    powerUp.collected = true;

    // Play power-up sound
    if (soundsRef.current.powerup) {
      playSound(soundsRef.current.powerup, 0.6);
    }

    if (powerUp.type === 'invincibility') {
      // Activate invincibility
      invincibleRef.current = true;

      // Clear existing timer
      if (invincibleTimerRef.current) {
        clearTimeout(invincibleTimerRef.current);
      }

      // Set timer to end invincibility
      invincibleTimerRef.current = setTimeout(() => {
        invincibleRef.current = false;
      }, 5000); // 5 seconds of invincibility
    }
  };

  // Handle collision
  const handleCollision = () => {
    // Skip if invincible
    if (invincibleRef.current) return false;

    if (lives > 1) {
      setLives(prev => prev - 1);
      birdRef.current.y = CANVAS_HEIGHT / 2;
      birdRef.current.velocity = 0;
      birdRef.current.rotation = 0;

      // Play hit sound
      if (soundsRef.current.hit) {
        playSound(soundsRef.current.hit, 0.5);
      }

      return false; // Game continues
    } else {
      // Play die sound
      if (soundsRef.current.die) {
        playSound(soundsRef.current.die, 0.7);
      }

      // Update high score
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('flappybird-high-score', score.toString());
      }

      return true; // Game over
    }
  };

  // Update game state
  const updateGame = useCallback(() => {
    if (!gameStarted || gameOver) return;

    const bird = birdRef.current;

    // Update bird
    const birdCollision = updateBird(bird);
    if (birdCollision) {
      const gameEnded = handleCollision();
      if (gameEnded) {
        setGameOver(true);
        return;
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

        // Play point sound
        if (soundsRef.current.point) {
          playSound(soundsRef.current.point, 0.4);
        }
      }

      // Check collision with pipe
      if (checkPipeCollision(bird, pipe)) {
        const gameEnded = handleCollision();
        if (gameEnded) {
          setGameOver(true);
          return;
        }

        // Remove the pipe that caused collision if premium
        if (isPremium) {
          pipesRef.current.splice(i, 1);
          i--; // Adjust index after removing element
        }
      }
    }

    // Update power-ups
    if (isPremium) {
      for (let i = 0; i < powerUpsRef.current.length; i++) {
        const powerUp = powerUpsRef.current[i];

        // Move power-up
        powerUp.x -= pipeSpeedRef.current;

        // Check collision with power-up
        if (checkPowerUpCollision(bird, powerUp)) {
          activatePowerUp(powerUp);
        }
      }

      // Remove power-ups that are off screen or collected
      powerUpsRef.current = powerUpsRef.current.filter(
        powerUp => powerUp.x > -powerUp.width && !powerUp.collected
      );
    }

    // Remove pipes that are off screen
    pipesRef.current = pipesRef.current.filter(pipe => pipe.x > -PIPE_WIDTH);

    // Draw game
    drawGame();

    // Continue animation
    animationRef.current = requestAnimationFrame(updateGame);
  }, [gameStarted, gameOver, addPipe, score, highScore, lives, isPremium]);

  // Draw clouds
  const drawClouds = (ctx) => {
    ctx.fillStyle = COLORS.CLOUD;

    for (const cloud of cloudsRef.current) {
      // Draw fluffy cloud shape
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, cloud.width / 3, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.width / 4, cloud.y - cloud.height / 4, cloud.width / 4, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.width / 2, cloud.y, cloud.width / 3, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.width / 4, cloud.y + cloud.height / 4, cloud.width / 4, 0, Math.PI * 2);
      ctx.fill();

      // Move cloud
      cloud.x -= cloud.speed;

      // Reset cloud position when it goes off screen
      if (cloud.x + cloud.width < 0) {
        cloud.x = CANVAS_WIDTH;
        cloud.y = Math.random() * (CANVAS_HEIGHT / 2);
      }
    }
  };

  // Draw bird with animation
  const drawBird = (ctx, bird) => {
    ctx.save();

    // Translate to bird center for rotation
    ctx.translate(bird.x + BIRD_WIDTH / 2, bird.y + BIRD_HEIGHT / 2);

    // Rotate bird based on velocity
    const rotation = bird.rotation * Math.PI / 180;
    ctx.rotate(rotation);

    // Draw bird body
    ctx.fillStyle = COLORS.BIRD_BODY;
    ctx.beginPath();
    ctx.ellipse(0, 0, BIRD_WIDTH / 2, BIRD_HEIGHT / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw wing
    ctx.fillStyle = COLORS.BIRD_WING;
    ctx.beginPath();
    if (bird.wingUp) {
      // Wing up
      ctx.ellipse(-5, -10, 12, 8, Math.PI / 4, 0, Math.PI * 2);
    } else {
      // Wing down
      ctx.ellipse(-5, 5, 12, 8, -Math.PI / 4, 0, Math.PI * 2);
    }
    ctx.fill();

    // Draw beak
    ctx.fillStyle = COLORS.BIRD_BEAK;
    ctx.beginPath();
    ctx.moveTo(BIRD_WIDTH / 2, -5);
    ctx.lineTo(BIRD_WIDTH / 2 + 10, 0);
    ctx.lineTo(BIRD_WIDTH / 2, 5);
    ctx.closePath();
    ctx.fill();

    // Draw eye
    ctx.fillStyle = COLORS.BIRD_EYE;
    ctx.beginPath();
    ctx.arc(BIRD_WIDTH / 4, -5, 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw invincibility effect if active
    if (invincibleRef.current) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, BIRD_WIDTH / 1.5, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  };

  // Draw pipes with 3D effect
  const drawPipes = (ctx) => {
    for (const pipe of pipesRef.current) {
      // Top pipe
      // Main pipe body
      ctx.fillStyle = COLORS.PIPE;
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);

      // Pipe highlight
      ctx.fillStyle = COLORS.PIPE_HIGHLIGHT;
      ctx.fillRect(pipe.x, 0, 5, pipe.topHeight);

      // Pipe shadow
      ctx.fillStyle = COLORS.PIPE_SHADOW;
      ctx.fillRect(pipe.x + PIPE_WIDTH - 5, 0, 5, pipe.topHeight);

      // Pipe cap
      ctx.fillStyle = COLORS.PIPE_HIGHLIGHT;
      ctx.fillRect(pipe.x - 5, pipe.topHeight - 10, PIPE_WIDTH + 10, 10);

      // Bottom pipe
      // Main pipe body
      ctx.fillStyle = COLORS.PIPE;
      ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, CANVAS_HEIGHT - pipe.bottomY);

      // Pipe highlight
      ctx.fillStyle = COLORS.PIPE_HIGHLIGHT;
      ctx.fillRect(pipe.x, pipe.bottomY, 5, CANVAS_HEIGHT - pipe.bottomY);

      // Pipe shadow
      ctx.fillStyle = COLORS.PIPE_SHADOW;
      ctx.fillRect(pipe.x + PIPE_WIDTH - 5, pipe.bottomY, 5, CANVAS_HEIGHT - pipe.bottomY);

      // Pipe cap
      ctx.fillStyle = COLORS.PIPE_HIGHLIGHT;
      ctx.fillRect(pipe.x - 5, pipe.bottomY, PIPE_WIDTH + 10, 10);
    }
  };

  // Draw power-ups
  const drawPowerUps = (ctx) => {
    for (const powerUp of powerUpsRef.current) {
      if (powerUp.collected) continue;

      // Draw power-up
      ctx.fillStyle = COLORS.POWERUP;

      // Draw star shape
      const centerX = powerUp.x + powerUp.width / 2;
      const centerY = powerUp.y + powerUp.height / 2;
      const spikes = 5;
      const outerRadius = powerUp.width / 2;
      const innerRadius = powerUp.width / 4;

      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI * i) / spikes;
        const x = centerX + radius * Math.sin(angle);
        const y = centerY + radius * Math.cos(angle);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fill();

      // Add glow effect
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  };

  // Draw ground
  const drawGround = (ctx) => {
    // Draw ground
    ctx.fillStyle = COLORS.GROUND;
    ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50);

    // Draw grass
    ctx.fillStyle = COLORS.GRASS;
    ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 5);

    // Draw grass tufts
    for (let i = 0; i < CANVAS_WIDTH; i += 20) {
      const height = Math.random() * 5 + 5;
      ctx.fillRect(i, CANVAS_HEIGHT - 50 - height, 3, height);
    }
  };

  // Draw game
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw sky gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, COLORS.SKY_TOP);
    gradient.addColorStop(1, COLORS.SKY_BOTTOM);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw clouds
    drawClouds(ctx);

    // Draw pipes
    drawPipes(ctx);

    // Draw power-ups
    if (isPremium) {
      drawPowerUps(ctx);
    }

    // Draw bird
    drawBird(ctx, birdRef.current);

    // Draw ground
    drawGround(ctx);

    // Draw score
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Draw high score
    ctx.fillText(`High Score: ${highScore}`, 10, 60);

    // Draw lives if premium
    if (isPremium) {
      ctx.fillStyle = lives > 1 ? '#FFFFFF' : '#FF5555';
      ctx.fillText(`Lives: ${lives}`, 10, 90);
    }

    // Draw invincibility timer if active
    if (invincibleRef.current) {
      ctx.fillStyle = '#FFFF00';
      ctx.fillText('INVINCIBLE!', CANVAS_WIDTH - 150, 30);
    }

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [score, highScore, isPremium, lives]);

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

  // Handle touch start for mobile
  const handleTouchStart = useCallback((e) => {
    e.preventDefault(); // Prevent scrolling
    if (!gameStarted) {
      startGame();
    } else {
      jump();
    }
  }, [gameStarted, startGame, jump]);

  // Set up touch event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
    };
  }, [handleTouchStart]);

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
      level: 1, // Flappy Bird doesn't have levels, but we'll use 1 for consistency
      date: new Date().toISOString()
    };

    const added = addToLeaderboard('flappybird', entry);

    if (added) {
      addNotification('Score saved to leaderboard!', 'success');
    }

    // Check for achievements
    const gameState = {
      score,
      powerupsCollected: powerupsCollectedRef.current,
      jumps: totalJumpsRef.current,
      distanceTraveled: distanceTraveledRef.current
    };

    const newAchievements = checkAchievements('flappybird', playerName, gameState);

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

  return (
    <div className="flappy-bird-game flex flex-col items-center">
      <div className="game-container flex flex-col md:flex-row gap-6">
        <div className="game-area relative">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onClick={handleCanvasClick}
            className="border-2 border-gray-800 cursor-pointer rounded-lg shadow-lg"
          />

          {!gameStarted && (
            <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-4 text-center">Flappy Bird</h2>
              <div className="mb-6 text-center max-w-md">
                <p className="mb-4">
                  Tap or press space to flap your wings and navigate through pipes.
                </p>

                {/* Game Mode Selection */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Game Mode</h3>
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleModeSelect('classic')}
                      className={`px-3 py-1 rounded-full text-sm ${gameMode === 'classic'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300'}`}
                    >
                      Classic
                    </button>
                    <button
                      onClick={() => handleModeSelect('night')}
                      className={`px-3 py-1 rounded-full text-sm ${gameMode === 'night'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300'}`}
                    >
                      Night Mode
                    </button>
                    <button
                      onClick={() => handleModeSelect('challenge')}
                      className={`px-3 py-1 rounded-full text-sm ${gameMode === 'challenge'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300'}`}
                    >
                      Challenge
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
                        ? 'bg-yellow-500 text-white'
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

                {isPremium && (
                  <div className="bg-green-500 text-white p-3 rounded-lg mb-4">
                    <p className="font-bold">Premium Features:</p>
                    <ul className="list-disc list-inside text-sm mt-2">
                      <li>3 Lives</li>
                      <li>Wider gaps between pipes</li>
                      <li>Slower pipe speed</li>
                      <li>Special power-ups</li>
                    </ul>
                  </div>
                )}
              </div>
              <button
                onClick={startGame}
                className="btn bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 px-10 text-lg rounded-full hover:scale-105 transition-transform"
              >
                Start Game
              </button>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-4 text-center">Game Over</h2>
              <div className="stats bg-gray-800 p-6 rounded-lg mb-6">
                <p className="text-xl mb-2">Score: <span className="font-bold text-yellow-400">{score}</span></p>
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
                className="btn bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 px-10 text-lg rounded-full hover:scale-105 transition-transform"
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
                <span className="text-gray-600">Lives:</span>
                <span className="text-lg font-bold text-red-600">{lives}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mode:</span>
                <span className="text-lg font-bold capitalize">{gameMode}</span>
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

              {isPremium && invincibleRef.current && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-lg font-bold text-purple-600">INVINCIBLE!</span>
                </div>
              )}
            </div>
          </div>

          {isPremium && (
            <div className="premium-badge mt-4 bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 px-6 rounded-lg text-center font-bold shadow-md">
              Premium Mode Active
            </div>
          )}

          <div className="game-controls mt-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">Controls</h3>

            <div className="flex flex-col space-y-4">
              <button
                onClick={jump}
                className="btn bg-gradient-to-r from-green-400 to-blue-500 text-white py-4 px-8 rounded-lg text-lg font-bold"
                disabled={!gameStarted || gameOver}
              >
                FLAP WINGS
              </button>

              <div className="text-sm text-gray-600 mt-2">
                <p>Keyboard: Press Space to flap</p>
                <p>Mobile: Tap screen to flap</p>
                {isPremium && <p className="mt-1">Premium: Collect stars for invincibility</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showLeaderboard && (
        <GameModal
          isOpen={showLeaderboard}
          onClose={() => setShowLeaderboard(false)}
          title="Flappy Bird Leaderboard"
          size="lg"
        >
          <Leaderboard gameId="flappybird" title="Top Scores" />
        </GameModal>
      )}

      {showAchievements && (
        <GameModal
          isOpen={showAchievements}
          onClose={() => setShowAchievements(false)}
          title="Flappy Bird Achievements"
          size="lg"
        >
          <Achievements
            gameId="flappybird"
            playerName={playerName}
            gameState={{
              score,
              powerupsCollected: powerupsCollectedRef.current,
              jumps: totalJumpsRef.current,
              distanceTraveled: distanceTraveledRef.current
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

export default FlappyBird;
