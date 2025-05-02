import React, { useState, useEffect, useCallback, useRef } from 'react';
import { loadAudio, playSound, drawRoundedRect, createGradientBackground, drawTextWithShadow, createParticleEffect } from '../../utils/gameUtils';
import { preloadAssets, loadSound, playSound as playGameSound, stopSound } from '../../utils/gameAssets';
import { checkAchievements } from '../../utils/achievements';
import { addToLeaderboard, qualifiesForLeaderboard } from '../../utils/leaderboard';
import GameModal from '../common/GameModal';
import Leaderboard from '../common/Leaderboard';
import Achievements from '../common/Achievements';
import PlayerProfile from '../common/PlayerProfile';
import GameNotification, { NotificationManager } from '../common/GameNotification';

// Tetris shapes
const SHAPES = [
  // I
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  // J
  [
    [2, 0, 0],
    [2, 2, 2],
    [0, 0, 0]
  ],
  // L
  [
    [0, 0, 3],
    [3, 3, 3],
    [0, 0, 0]
  ],
  // O
  [
    [4, 4],
    [4, 4]
  ],
  // S
  [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0]
  ],
  // T
  [
    [0, 6, 0],
    [6, 6, 6],
    [0, 0, 0]
  ],
  // Z
  [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0]
  ]
];

// Modern colors for shapes with gradient effect
const COLORS = [
  'transparent',
  ['#00FFFF', '#00CCCC'], // I - Cyan
  ['#0000FF', '#0000CC'], // J - Blue
  ['#FFA500', '#FF8000'], // L - Orange
  ['#FFFF00', '#FFCC00'], // O - Yellow
  ['#00FF00', '#00CC00'], // S - Green
  ['#800080', '#660066'], // T - Purple
  ['#FF0000', '#CC0000']  // Z - Red
];

// Game constants
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const BLOCK_RADIUS = 4; // Rounded corners for blocks

// Sound effects paths
const SOUND_PATHS = {
  move: '/src/assets/games/tetris/sounds/move.mp3',
  rotate: '/src/assets/games/tetris/sounds/rotate.mp3',
  drop: '/src/assets/games/tetris/sounds/drop.mp3',
  clear: '/src/assets/games/tetris/sounds/clear.mp3',
  gameOver: '/src/assets/games/tetris/sounds/gameover.mp3',
  levelUp: '/src/assets/games/tetris/sounds/levelup.mp3'
};

function Tetris({ isPremium }) {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [speed, setSpeed] = useState(1000);
  const [paused, setPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [undoHistory, setUndoHistory] = useState([]);
  const [highScore, setHighScore] = useState(0);

  // UI state
  const [playerName, setPlayerName] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Game state tracking
  const linesCleared = useRef(0);
  const totalPieces = useRef(0);

  // Refs
  const gameLoopRef = useRef(null);
  const canvasRef = useRef(null);
  const soundsRef = useRef({});

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
    const savedHighScore = localStorage.getItem('tetris-high-score');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }

    // Load player name
    const savedPlayerName = localStorage.getItem('playerName');
    if (savedPlayerName) {
      setPlayerName(savedPlayerName);
    }
  }, []);

  // Create empty board
  function createEmptyBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  // Generate a new piece
  const generateNewPiece = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * SHAPES.length);
    const newPiece = SHAPES[randomIndex];
    const startX = Math.floor((COLS - newPiece[0].length) / 2);
    const startY = 0;

    // Save current state for undo
    if (isPremium) {
      setUndoHistory(prev => [...prev, {
        board: JSON.parse(JSON.stringify(board)),
        score,
        level
      }]);

      // Limit history size
      if (undoHistory.length > 10) {
        setUndoHistory(prev => prev.slice(1));
      }
    }

    setCurrentPiece(newPiece);
    setCurrentPosition({ x: startX, y: startY });

    // Check if game is over (collision on new piece)
    if (checkCollision(newPiece, { x: startX, y: startY })) {
      setGameOver(true);
    }
  }, [board, score, level, isPremium, undoHistory.length]);

  // Check collision
  const checkCollision = useCallback((piece, position) => {
    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x] !== 0) {
          const boardX = position.x + x;
          const boardY = position.y + y;

          // Check boundaries
          if (
            boardX < 0 ||
            boardX >= COLS ||
            boardY >= ROWS ||
            (boardY >= 0 && board[boardY][boardX] !== 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, [board]);

  // Rotate piece
  const rotatePiece = useCallback(() => {
    if (!currentPiece || paused || gameOver) return;

    const rotated = currentPiece[0].map((_, index) =>
      currentPiece.map(row => row[index]).reverse()
    );

    if (!checkCollision(rotated, currentPosition)) {
      setCurrentPiece(rotated);

      // Play rotation sound
      if (soundsRef.current.rotate) {
        playSound(soundsRef.current.rotate, 0.5);
      }
    }
  }, [currentPiece, currentPosition, checkCollision, paused, gameOver]);

  // Move piece
  const movePiece = useCallback((dx, dy) => {
    if (!currentPiece || paused || gameOver) return;

    const newPosition = { x: currentPosition.x + dx, y: currentPosition.y + dy };

    if (!checkCollision(currentPiece, newPosition)) {
      setCurrentPosition(newPosition);

      // Play move sound (only for horizontal movement)
      if (dx !== 0 && soundsRef.current.move) {
        playSound(soundsRef.current.move, 0.3);
      }

      return true;
    }
    return false;
  }, [currentPiece, currentPosition, checkCollision, paused, gameOver]);

  // Drop piece
  const dropPiece = useCallback(() => {
    if (!movePiece(0, 1)) {
      // Piece has landed
      const newBoard = [...board];

      // Play drop sound
      if (soundsRef.current.drop) {
        playSound(soundsRef.current.drop, 0.6);
      }

      // Merge the piece with the board
      for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
          if (currentPiece[y][x] !== 0) {
            const boardY = currentPosition.y + y;
            const boardX = currentPosition.x + x;

            if (boardY >= 0) {
              newBoard[boardY][boardX] = currentPiece[y][x];
            }
          }
        }
      }

      setBoard(newBoard);

      // Check for completed rows
      const completedRows = checkCompletedRows(newBoard);
      if (completedRows > 0) {
        // Play clear sound
        if (soundsRef.current.clear) {
          playSound(soundsRef.current.clear, 0.7);
        }

        const points = calculatePoints(completedRows, level);
        setScore(prevScore => {
          const newScore = prevScore + points;

          // Update high score if needed
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('tetris-high-score', newScore.toString());
          }

          return newScore;
        });

        // Increase level every 10 rows
        const newTotalRows = score / 100 + completedRows;
        const newLevel = Math.floor(newTotalRows / 10) + 1;

        if (newLevel > level) {
          setLevel(newLevel);
          setSpeed(prevSpeed => Math.max(100, prevSpeed - 100)); // Speed up as level increases

          // Play level up sound
          if (soundsRef.current.levelUp) {
            playSound(soundsRef.current.levelUp, 0.8);
          }
        }
      }

      // Generate new piece
      generateNewPiece();
    }
  }, [board, currentPiece, currentPosition, generateNewPiece, movePiece, level, score, highScore]);

  // Check for completed rows
  const checkCompletedRows = useCallback((board) => {
    let completedRows = 0;
    const newBoard = [...board];

    // Check rows from bottom to top
    for (let y = ROWS - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== 0)) {
        // Remove the row
        newBoard.splice(y, 1);
        // Add empty row at the top
        newBoard.unshift(Array(COLS).fill(0));
        completedRows++;
        // Don't increment y here, as we need to check the same position again
        // after the rows have shifted
        y++;
      }
    }

    if (completedRows > 0) {
      setBoard(newBoard);
    }

    return completedRows;
  }, []);

  // Calculate points based on completed rows and level
  const calculatePoints = useCallback((rows, level) => {
    // Original Nintendo scoring system
    const pointsPerRow = [0, 40, 100, 300, 1200]; // 0, 1, 2, 3, 4 rows

    // Premium users get bonus points
    const multiplier = isPremium ? 1.5 : 1;

    return Math.floor(pointsPerRow[rows] * level * multiplier);
  }, [isPremium]);

  // Hard drop
  const hardDrop = useCallback(() => {
    if (!currentPiece || paused || gameOver) return;

    // Calculate ghost position
    const ghostPosition = calculateGhostPosition();
    if (!ghostPosition) return;

    // Calculate drop distance
    const dropDistance = ghostPosition.y - currentPosition.y;

    // Add points for hard drop
    setScore(prevScore => prevScore + dropDistance);

    // Set position directly to ghost position
    setCurrentPosition(ghostPosition);

    // Play drop sound with higher volume for hard drop
    if (soundsRef.current.drop) {
      playSound(soundsRef.current.drop, 0.8);
    }

    // Force the piece to land
    dropPiece();
  }, [currentPiece, currentPosition, calculateGhostPosition, dropPiece, paused, gameOver]);

  // Undo move (premium feature)
  const undoMove = useCallback(() => {
    if (!isPremium || undoHistory.length === 0) return;

    const lastState = undoHistory[undoHistory.length - 1];
    setBoard(lastState.board);
    setScore(lastState.score);
    setLevel(lastState.level);

    // Remove the used state from history
    setUndoHistory(prev => prev.slice(0, -1));
  }, [isPremium, undoHistory]);

  // Handle keyboard input
  const handleKeyDown = useCallback((e) => {
    if (gameOver) return;

    switch (e.key) {
      case 'ArrowLeft':
        movePiece(-1, 0);
        break;
      case 'ArrowRight':
        movePiece(1, 0);
        break;
      case 'ArrowDown':
        movePiece(0, 1);
        break;
      case 'ArrowUp':
        rotatePiece();
        break;
      case ' ':
        hardDrop();
        break;
      case 'p':
        setPaused(prev => !prev);
        break;
      case 'z':
        if (isPremium) {
          undoMove();
        }
        break;
      default:
        break;
    }
  }, [movePiece, rotatePiece, hardDrop, gameOver, isPremium, undoMove]);

  // Start game
  const startGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setScore(0);
    setLevel(1);
    setSpeed(isPremium ? 1200 : 1000); // Slower speed for premium users
    setGameOver(false);
    setPaused(false);
    setGameStarted(true);
    setUndoHistory([]);

    // Generate new piece
    generateNewPiece();

    // Play game start sound
    if (soundsRef.current.levelUp) {
      playSound(soundsRef.current.levelUp, 0.6);
    }
  }, [generateNewPiece, isPremium]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver || paused) return;

    const gameLoop = () => {
      dropPiece();
    };

    gameLoopRef.current = setInterval(gameLoop, speed);

    return () => {
      clearInterval(gameLoopRef.current);
    };
  }, [gameStarted, gameOver, paused, speed, dropPiece]);

  // Keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Calculate ghost piece position (where the piece would land)
  const calculateGhostPosition = useCallback(() => {
    if (!currentPiece) return null;

    let ghostY = currentPosition.y;

    // Move the ghost piece down until it collides
    while (!checkCollision(currentPiece, { x: currentPosition.x, y: ghostY + 1 })) {
      ghostY++;
    }

    return { x: currentPosition.x, y: ghostY };
  }, [currentPiece, currentPosition, checkCollision]);

  // Draw a single block with gradient effect
  const drawBlock = (ctx, x, y, colorIndex, alpha = 1) => {
    if (colorIndex === 0) return; // Don't draw empty cells

    const blockX = x * BLOCK_SIZE;
    const blockY = y * BLOCK_SIZE;

    // Create gradient
    const gradient = ctx.createLinearGradient(
      blockX, blockY,
      blockX + BLOCK_SIZE, blockY + BLOCK_SIZE
    );

    // Use color array for gradient or fallback to single color
    const colorPair = Array.isArray(COLORS[colorIndex]) ? COLORS[colorIndex] : [COLORS[colorIndex], COLORS[colorIndex]];

    gradient.addColorStop(0, colorPair[0]);
    gradient.addColorStop(1, colorPair[1]);

    ctx.globalAlpha = alpha;

    // Draw rounded rectangle
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(
      blockX, blockY,
      BLOCK_SIZE, BLOCK_SIZE,
      BLOCK_RADIUS
    );
    ctx.fill();

    // Draw highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.roundRect(
      blockX + 2, blockY + 2,
      BLOCK_SIZE - 15, BLOCK_SIZE - 15,
      BLOCK_RADIUS - 2
    );
    ctx.fill();

    // Reset alpha
    ctx.globalAlpha = 1;
  };

  // Draw game
  const drawGame = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * BLOCK_SIZE, 0);
      ctx.lineTo(x * BLOCK_SIZE, ROWS * BLOCK_SIZE);
      ctx.stroke();
    }

    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * BLOCK_SIZE);
      ctx.lineTo(COLS * BLOCK_SIZE, y * BLOCK_SIZE);
      ctx.stroke();
    }

    // Draw ghost piece if enabled
    if (currentPiece && isPremium) {
      const ghostPosition = calculateGhostPosition();

      if (ghostPosition) {
        for (let y = 0; y < currentPiece.length; y++) {
          for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x] !== 0) {
              const boardX = ghostPosition.x + x;
              const boardY = ghostPosition.y + y;

              if (boardY >= 0) {
                drawBlock(ctx, boardX, boardY, currentPiece[y][x], 0.3); // Semi-transparent
              }
            }
          }
        }
      }
    }

    // Draw board
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cell = board[y][x];
        if (cell !== 0) {
          drawBlock(ctx, x, y, cell);
        }
      }
    }

    // Draw current piece
    if (currentPiece) {
      for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
          if (currentPiece[y][x] !== 0) {
            const boardX = currentPosition.x + x;
            const boardY = currentPosition.y + y;

            if (boardY >= 0) {
              drawBlock(ctx, boardX, boardY, currentPiece[y][x]);
            }
          }
        }
      }
    }
  }, [board, currentPiece, currentPosition, calculateGhostPosition, isPremium]);

  // Update the game rendering
  useEffect(() => {
    drawGame();
  }, [drawGame]);

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

    const added = addToLeaderboard('tetris', entry);

    if (added) {
      addNotification('Score saved to leaderboard!', 'success');
    }

    // Check for achievements
    const gameState = {
      score,
      level,
      linesCleared: linesCleared.current,
      piecesPlaced: totalPieces.current
    };

    const newAchievements = checkAchievements('tetris', playerName, gameState);

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

  return (
    <div className="tetris-game flex flex-col items-center">
      <div className="game-container flex flex-col md:flex-row gap-6">
        <div className="game-area relative">
          <canvas
            ref={canvasRef}
            width={COLS * BLOCK_SIZE}
            height={ROWS * BLOCK_SIZE}
            className="border-2 border-gray-800 rounded-lg shadow-lg"
          />

          {!gameStarted && (
            <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-4 text-center">Tetris</h2>
              <div className="mb-6 text-center max-w-md">
                <p className="mb-4">
                  Use arrow keys to move and rotate pieces. Space for hard drop.
                </p>
                {isPremium && (
                  <div className="bg-yellow-500 text-black p-3 rounded-lg mb-4">
                    <p className="font-bold">Premium Features:</p>
                    <ul className="list-disc list-inside text-sm mt-2">
                      <li>Slower falling speed</li>
                      <li>Ghost piece preview</li>
                      <li>Unlimited undos</li>
                      <li>1.5x score multiplier</li>
                    </ul>
                  </div>
                )}
              </div>
              <button
                onClick={startGame}
                className="btn btn-primary py-3 px-10 text-lg rounded-full hover:scale-105 transition-transform"
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
                className="btn btn-primary py-3 px-10 text-lg rounded-full hover:scale-105 transition-transform"
              >
                Play Again
              </button>
            </div>
          )}

          {paused && (
            <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-4">Paused</h2>
              <p className="mb-6 text-center">Press 'P' to resume</p>
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
              </div>
              <button
                onClick={() => setPaused(false)}
                className="btn btn-primary py-3 px-10 text-lg rounded-full hover:scale-105 transition-transform"
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
                <span className="text-gray-600">Level:</span>
                <span className="text-xl font-bold text-green-600">{level}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">High Score:</span>
                <span className="text-lg font-bold text-blue-600">{highScore}</span>
              </div>

              {isPremium && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Undos Available:</span>
                    <span className="text-lg font-bold">{undoHistory.length > 0 ? 'Yes' : 'No'}</span>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">Score Multiplier:</span>
                    <span className="text-lg font-bold text-yellow-600">1.5x</span>
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

              {isPremium && gameStarted && !gameOver && undoHistory.length > 0 && (
                <button
                  onClick={undoMove}
                  className="btn btn-outline border-yellow-500 text-yellow-600 py-2 px-4 w-full"
                >
                  Undo Last Move
                </button>
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
              <button
                onClick={() => movePiece(-1, 0)}
                className="btn bg-gray-200 hover:bg-gray-300 text-black py-3 px-4 rounded-lg"
                disabled={!gameStarted || gameOver || paused}
              >
                ←
              </button>
              <button
                onClick={() => movePiece(0, 1)}
                className="btn bg-gray-200 hover:bg-gray-300 text-black py-3 px-4 rounded-lg"
                disabled={!gameStarted || gameOver || paused}
              >
                ↓
              </button>
              <button
                onClick={() => movePiece(1, 0)}
                className="btn bg-gray-200 hover:bg-gray-300 text-black py-3 px-4 rounded-lg"
                disabled={!gameStarted || gameOver || paused}
              >
                →
              </button>
              <button
                onClick={rotatePiece}
                className="btn bg-gray-200 hover:bg-gray-300 text-black py-3 px-4 rounded-lg"
                disabled={!gameStarted || gameOver || paused}
              >
                Rotate
              </button>
              <button
                onClick={hardDrop}
                className="btn bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg col-span-2"
                disabled={!gameStarted || gameOver || paused}
              >
                Hard Drop
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>Keyboard: Arrow keys to move, Up to rotate, Space for hard drop</p>
              {isPremium && <p className="mt-1">Premium: Z key to undo moves</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showLeaderboard && (
        <GameModal
          isOpen={showLeaderboard}
          onClose={() => setShowLeaderboard(false)}
          title="Tetris Leaderboard"
          size="lg"
        >
          <Leaderboard gameId="tetris" title="Top Scores" />
        </GameModal>
      )}

      {showAchievements && (
        <GameModal
          isOpen={showAchievements}
          onClose={() => setShowAchievements(false)}
          title="Tetris Achievements"
          size="lg"
        >
          <Achievements
            gameId="tetris"
            playerName={playerName}
            gameState={{
              score,
              level,
              linesCleared: linesCleared.current,
              piecesPlaced: totalPieces.current
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

export default Tetris;
