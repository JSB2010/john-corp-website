import React, { useState, useEffect, useCallback, useRef } from 'react';

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

// Colors for shapes
const COLORS = [
  'transparent',
  '#00FFFF', // I - Cyan
  '#0000FF', // J - Blue
  '#FFA500', // L - Orange
  '#FFFF00', // O - Yellow
  '#00FF00', // S - Green
  '#800080', // T - Purple
  '#FF0000'  // Z - Red
];

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

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
  const gameLoopRef = useRef(null);
  const canvasRef = useRef(null);

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
    }
  }, [currentPiece, currentPosition, checkCollision, paused, gameOver]);

  // Move piece
  const movePiece = useCallback((dx, dy) => {
    if (!currentPiece || paused || gameOver) return;

    const newPosition = { x: currentPosition.x + dx, y: currentPosition.y + dy };
    
    if (!checkCollision(currentPiece, newPosition)) {
      setCurrentPosition(newPosition);
      return true;
    }
    return false;
  }, [currentPiece, currentPosition, checkCollision, paused, gameOver]);

  // Drop piece
  const dropPiece = useCallback(() => {
    if (!movePiece(0, 1)) {
      // Piece has landed
      const newBoard = [...board];
      
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
        const points = calculatePoints(completedRows, level);
        setScore(prevScore => prevScore + points);
        
        // Increase level every 10 rows
        const newTotalRows = score / 100 + completedRows;
        const newLevel = Math.floor(newTotalRows / 10) + 1;
        
        if (newLevel > level) {
          setLevel(newLevel);
          setSpeed(prevSpeed => Math.max(100, prevSpeed - 100)); // Speed up as level increases
        }
      }
      
      // Generate new piece
      generateNewPiece();
    }
  }, [board, currentPiece, currentPosition, generateNewPiece, movePiece, level, score]);

  // Check for completed rows
  const checkCompletedRows = useCallback((board) => {
    let completedRows = 0;
    const newBoard = [...board];
    
    for (let y = ROWS - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== 0)) {
        // Remove the row
        newBoard.splice(y, 1);
        // Add empty row at the top
        newBoard.unshift(Array(COLS).fill(0));
        completedRows++;
        y++; // Check the same row again
      }
    }
    
    if (completedRows > 0) {
      setBoard(newBoard);
    }
    
    return completedRows;
  }, []);

  // Calculate points based on completed rows and level
  const calculatePoints = useCallback((rows, level) => {
    const pointsPerRow = [0, 40, 100, 300, 1200]; // 0, 1, 2, 3, 4 rows
    return pointsPerRow[rows] * level;
  }, []);

  // Hard drop
  const hardDrop = useCallback(() => {
    if (!currentPiece || paused || gameOver) return;
    
    let dropDistance = 0;
    while (movePiece(0, 1)) {
      dropDistance++;
    }
    
    // Add points for hard drop
    setScore(prevScore => prevScore + dropDistance);
    
    // Force the piece to land
    dropPiece();
  }, [currentPiece, movePiece, dropPiece, paused, gameOver]);

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
    generateNewPiece();
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

  // Draw game
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw board
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cell = board[y][x];
        
        ctx.fillStyle = COLORS[cell];
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        
        ctx.strokeStyle = '#333';
        ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
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
              ctx.fillStyle = COLORS[currentPiece[y][x]];
              ctx.fillRect(boardX * BLOCK_SIZE, boardY * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
              
              ctx.strokeStyle = '#333';
              ctx.strokeRect(boardX * BLOCK_SIZE, boardY * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
          }
        }
      }
    }
  }, [board, currentPiece, currentPosition]);

  return (
    <div className="tetris-game flex flex-col items-center">
      <div className="game-area relative">
        <canvas 
          ref={canvasRef} 
          width={COLS * BLOCK_SIZE} 
          height={ROWS * BLOCK_SIZE}
          className="border-2 border-gray-800"
        />
        
        {!gameStarted && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white p-8">
            <h2 className="text-2xl font-bold mb-4">Tetris</h2>
            <p className="mb-6 text-center">
              Use arrow keys to move and rotate pieces. Space for hard drop.
              {isPremium && " Press 'Z' to undo moves."}
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
        
        {paused && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white p-8">
            <h2 className="text-2xl font-bold mb-4">Paused</h2>
            <p className="mb-6">Press 'P' to resume</p>
            <button 
              onClick={() => setPaused(false)}
              className="btn btn-primary py-2 px-8"
            >
              Resume
            </button>
          </div>
        )}
      </div>
      
      <div className="game-info mt-6 flex justify-between w-full">
        <div>
          <p className="text-lg font-bold">Score: {score}</p>
          <p className="text-lg font-bold">Level: {level}</p>
        </div>
        
        <div className="flex space-x-2">
          {gameStarted && !gameOver && (
            <button 
              onClick={() => setPaused(prev => !prev)}
              className="btn btn-outline border-black text-black py-1 px-4"
            >
              {paused ? 'Resume' : 'Pause'}
            </button>
          )}
          
          {isPremium && gameStarted && !gameOver && undoHistory.length > 0 && (
            <button 
              onClick={undoMove}
              className="btn btn-outline border-black text-black py-1 px-4"
            >
              Undo
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
        <button 
          onClick={() => movePiece(-1, 0)}
          className="btn btn-outline border-black text-black py-2 px-4"
          disabled={!gameStarted || gameOver || paused}
        >
          ←
        </button>
        <button 
          onClick={() => movePiece(0, 1)}
          className="btn btn-outline border-black text-black py-2 px-4"
          disabled={!gameStarted || gameOver || paused}
        >
          ↓
        </button>
        <button 
          onClick={() => movePiece(1, 0)}
          className="btn btn-outline border-black text-black py-2 px-4"
          disabled={!gameStarted || gameOver || paused}
        >
          →
        </button>
        <button 
          onClick={rotatePiece}
          className="btn btn-outline border-black text-black py-2 px-4"
          disabled={!gameStarted || gameOver || paused}
        >
          Rotate
        </button>
        <button 
          onClick={hardDrop}
          className="btn btn-outline border-black text-black py-2 px-4 col-span-2"
          disabled={!gameStarted || gameOver || paused}
        >
          Hard Drop
        </button>
      </div>
    </div>
  );
}

export default Tetris;
