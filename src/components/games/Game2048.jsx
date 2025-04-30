import React, { useState, useEffect, useCallback } from 'react';

function Game2048({ isPremium }) {
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [undosAvailable, setUndosAvailable] = useState(isPremium ? 3 : 0);
  const [powerUpActive, setPowerUpActive] = useState(false);
  const [powerUpType, setPowerUpType] = useState(null);
  const [powerUpTimeLeft, setPowerUpTimeLeft] = useState(0);
  const [powerUpTimerId, setPowerUpTimerId] = useState(null);
  const [powerUpChance, setPowerUpChance] = useState(isPremium ? 0.15 : 0);
  const [boardSize, setBoardSize] = useState(4);

  // Initialize the game board
  const initializeBoard = useCallback(() => {
    const size = boardSize;
    const newBoard = Array(size).fill().map(() => Array(size).fill(0));
    
    // Add two random tiles
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setUndoStack([]);
    setUndosAvailable(isPremium ? 3 : 0);
    setPowerUpActive(false);
    setPowerUpType(null);
    setPowerUpTimeLeft(0);
    
    if (powerUpTimerId) {
      clearInterval(powerUpTimerId);
      setPowerUpTimerId(null);
    }
    
    return newBoard;
  }, [boardSize, isPremium, powerUpTimerId]);

  // Start game
  const startGame = useCallback(() => {
    initializeBoard();
    setGameStarted(true);
  }, [initializeBoard]);

  // Add a random tile to the board
  const addRandomTile = (board) => {
    const emptyCells = [];
    
    // Find all empty cells
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }
    
    if (emptyCells.length === 0) return false;
    
    // Choose a random empty cell
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    
    // Determine if we should add a power-up
    if (isPremium && Math.random() < powerUpChance && !powerUpActive) {
      const powerUps = ['double', 'merge', 'remove'];
      const randomPowerUp = powerUps[Math.floor(Math.random() * powerUps.length)];
      board[randomCell.row][randomCell.col] = { type: 'powerup', powerType: randomPowerUp };
    } else {
      // 90% chance for 2, 10% chance for 4
      board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
    
    return true;
  };

  // Check if the game is over
  const checkGameOver = (board) => {
    // Check for empty cells
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 0) return false;
      }
    }
    
    // Check for possible merges
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        const current = board[i][j];
        
        // Check right
        if (j < board[i].length - 1 && (current === board[i][j + 1] || 
            (typeof current === 'object' && current.type === 'powerup') || 
            (typeof board[i][j + 1] === 'object' && board[i][j + 1].type === 'powerup'))) {
          return false;
        }
        
        // Check down
        if (i < board.length - 1 && (current === board[i + 1][j] || 
            (typeof current === 'object' && current.type === 'powerup') || 
            (typeof board[i + 1][j] === 'object' && board[i + 1][j].type === 'powerup'))) {
          return false;
        }
      }
    }
    
    return true;
  };

  // Check if the game is won (reached 2048)
  const checkGameWon = (board) => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 2048) {
          return true;
        }
      }
    }
    return false;
  };

  // Move tiles in a direction
  const moveTiles = useCallback((direction) => {
    if (gameOver) return;
    
    // Save current state for undo
    const currentState = {
      board: JSON.parse(JSON.stringify(board)),
      score: score
    };
    
    let newBoard = JSON.parse(JSON.stringify(board));
    let moved = false;
    let newScore = score;
    
    // Process the board based on direction
    switch (direction) {
      case 'up':
        for (let col = 0; col < boardSize; col++) {
          const result = processTilesInDirection(
            newBoard.map(row => row[col]),
            newScore,
            powerUpActive,
            powerUpType
          );
          
          // Update the column
          for (let row = 0; row < boardSize; row++) {
            newBoard[row][col] = result.line[row];
          }
          
          newScore = result.score;
          if (result.moved) moved = true;
        }
        break;
        
      case 'down':
        for (let col = 0; col < boardSize; col++) {
          const result = processTilesInDirection(
            newBoard.map(row => row[col]).reverse(),
            newScore,
            powerUpActive,
            powerUpType
          );
          
          // Update the column (reversed)
          const reversedLine = result.line;
          for (let row = 0; row < boardSize; row++) {
            newBoard[row][col] = reversedLine[boardSize - 1 - row];
          }
          
          newScore = result.score;
          if (result.moved) moved = true;
        }
        break;
        
      case 'left':
        for (let row = 0; row < boardSize; row++) {
          const result = processTilesInDirection(
            newBoard[row],
            newScore,
            powerUpActive,
            powerUpType
          );
          
          // Update the row
          newBoard[row] = result.line;
          newScore = result.score;
          if (result.moved) moved = true;
        }
        break;
        
      case 'right':
        for (let row = 0; row < boardSize; row++) {
          const result = processTilesInDirection(
            [...newBoard[row]].reverse(),
            newScore,
            powerUpActive,
            powerUpType
          );
          
          // Update the row (reversed)
          const reversedLine = result.line;
          newBoard[row] = reversedLine.reverse();
          newScore = result.score;
          if (result.moved) moved = true;
        }
        break;
        
      default:
        break;
    }
    
    // If tiles moved, add a new random tile
    if (moved) {
      addRandomTile(newBoard);
      setUndoStack([...undoStack, currentState]);
      setScore(newScore);
      
      // Update best score
      if (newScore > bestScore) {
        setBestScore(newScore);
      }
    }
    
    // Check if game is won or over
    if (checkGameWon(newBoard)) {
      setGameWon(true);
    } else if (checkGameOver(newBoard)) {
      setGameOver(true);
    }
    
    setBoard(newBoard);
  }, [board, score, boardSize, gameOver, undoStack, bestScore, powerUpActive, powerUpType]);

  // Process a line of tiles (for moving)
  const processTilesInDirection = (line, currentScore, powerUpActive, powerUpType) => {
    let newLine = [...line];
    let score = currentScore;
    let moved = false;
    
    // Remove zeros
    newLine = newLine.filter(tile => tile !== 0);
    
    // Merge tiles
    for (let i = 0; i < newLine.length - 1; i++) {
      const current = newLine[i];
      const next = newLine[i + 1];
      
      // Handle power-ups
      if (typeof current === 'object' && current.type === 'powerup') {
        // Power-up will be activated when it reaches the edge
        continue;
      }
      
      if (typeof next === 'object' && next.type === 'powerup') {
        // Power-up will be activated when it reaches the edge
        continue;
      }
      
      // Normal tile merging
      if (current === next) {
        const mergeValue = current * 2;
        newLine[i] = mergeValue;
        newLine.splice(i + 1, 1);
        
        // Apply double power-up if active
        if (powerUpActive && powerUpType === 'double') {
          score += mergeValue * 2;
        } else {
          score += mergeValue;
        }
        
        moved = true;
      }
    }
    
    // Check for power-ups at the edge
    for (let i = 0; i < newLine.length; i++) {
      const tile = newLine[i];
      
      if (typeof tile === 'object' && tile.type === 'powerup') {
        // Activate power-up
        activatePowerUp(tile.powerType);
        newLine[i] = 0; // Remove power-up
        moved = true;
      }
    }
    
    // Fill with zeros
    while (newLine.length < line.length) {
      newLine.push(0);
    }
    
    // Check if tiles moved
    if (newLine.length !== line.length) {
      moved = true;
    } else {
      for (let i = 0; i < line.length; i++) {
        if ((typeof line[i] === 'object' && typeof newLine[i] !== 'object') ||
            (typeof line[i] !== 'object' && typeof newLine[i] === 'object') ||
            (typeof line[i] !== 'object' && line[i] !== newLine[i])) {
          moved = true;
          break;
        }
      }
    }
    
    return { line: newLine, score, moved };
  };

  // Activate power-up
  const activatePowerUp = (type) => {
    setPowerUpActive(true);
    setPowerUpType(type);
    setPowerUpTimeLeft(10); // 10 seconds
    
    // Clear existing timer
    if (powerUpTimerId) {
      clearInterval(powerUpTimerId);
    }
    
    // Start timer
    const timerId = setInterval(() => {
      setPowerUpTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          setPowerUpActive(false);
          setPowerUpType(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setPowerUpTimerId(timerId);
    
    // Apply immediate effects
    if (type === 'remove') {
      // Remove all tiles with value 2
      setBoard(prev => {
        const newBoard = JSON.parse(JSON.stringify(prev));
        for (let i = 0; i < newBoard.length; i++) {
          for (let j = 0; j < newBoard[i].length; j++) {
            if (newBoard[i][j] === 2) {
              newBoard[i][j] = 0;
            }
          }
        }
        return newBoard;
      });
    }
  };

  // Undo last move (premium feature)
  const undoMove = useCallback(() => {
    if (undosAvailable <= 0 || undoStack.length === 0) return;
    
    const lastState = undoStack[undoStack.length - 1];
    setBoard(lastState.board);
    setScore(lastState.score);
    setUndoStack(undoStack.slice(0, -1));
    setUndosAvailable(prev => prev - 1);
    
    // Reset game over state
    setGameOver(false);
    setGameWon(false);
  }, [undosAvailable, undoStack]);

  // Handle keyboard input
  const handleKeyDown = useCallback((e) => {
    if (!gameStarted || gameOver) return;
    
    switch (e.key) {
      case 'ArrowUp':
        moveTiles('up');
        break;
      case 'ArrowDown':
        moveTiles('down');
        break;
      case 'ArrowLeft':
        moveTiles('left');
        break;
      case 'ArrowRight':
        moveTiles('right');
        break;
      case 'z':
        if (isPremium) {
          undoMove();
        }
        break;
      default:
        break;
    }
  }, [gameStarted, gameOver, moveTiles, isPremium, undoMove]);

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
      if (powerUpTimerId) {
        clearInterval(powerUpTimerId);
      }
    };
  }, [powerUpTimerId]);

  // Initialize board on mount
  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  // Handle touch events for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };
  
  const handleTouchMove = (e) => {
    setTouchEnd({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const xDiff = touchStart.x - touchEnd.x;
    const yDiff = touchStart.y - touchEnd.y;
    
    // Determine swipe direction
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 10) {
        moveTiles('left');
      } else if (xDiff < -10) {
        moveTiles('right');
      }
    } else {
      if (yDiff > 10) {
        moveTiles('up');
      } else if (yDiff < -10) {
        moveTiles('down');
      }
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Get tile color based on value
  const getTileColor = (value) => {
    if (typeof value === 'object' && value.type === 'powerup') {
      switch (value.powerType) {
        case 'double':
          return 'bg-purple-500 text-white';
        case 'merge':
          return 'bg-blue-500 text-white';
        case 'remove':
          return 'bg-red-500 text-white';
        default:
          return 'bg-gray-200';
      }
    }
    
    switch (value) {
      case 2:
        return 'bg-gray-200 text-gray-800';
      case 4:
        return 'bg-gray-300 text-gray-800';
      case 8:
        return 'bg-orange-300 text-white';
      case 16:
        return 'bg-orange-400 text-white';
      case 32:
        return 'bg-orange-500 text-white';
      case 64:
        return 'bg-orange-600 text-white';
      case 128:
        return 'bg-yellow-300 text-white';
      case 256:
        return 'bg-yellow-400 text-white';
      case 512:
        return 'bg-yellow-500 text-white';
      case 1024:
        return 'bg-yellow-600 text-white';
      case 2048:
        return 'bg-yellow-700 text-white';
      default:
        return 'bg-gray-100';
    }
  };

  // Get font size based on value
  const getFontSize = (value) => {
    if (value >= 1000) {
      return 'text-xl';
    } else if (value >= 100) {
      return 'text-2xl';
    } else {
      return 'text-3xl';
    }
  };

  // Get power-up icon and text
  const getPowerUpContent = (powerUp) => {
    if (!powerUp || !powerUp.type === 'powerup') return null;
    
    switch (powerUp.powerType) {
      case 'double':
        return { icon: '×2', text: 'Double' };
      case 'merge':
        return { icon: '🔄', text: 'Merge' };
      case 'remove':
        return { icon: '🗑️', text: 'Remove' };
      default:
        return { icon: '?', text: 'Unknown' };
    }
  };

  return (
    <div className="game-2048 flex flex-col items-center">
      {!gameStarted ? (
        <div className="start-screen bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">2048</h2>
          <p className="mb-6 text-center text-gray-600">
            Combine tiles with the same number to create a tile with the value 2048.
            {isPremium && " Premium mode: Undo moves and special power-ups available."}
          </p>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Board Size:</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setBoardSize(4)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  boardSize === 4
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                4×4
              </button>
              {isPremium && (
                <>
                  <button
                    onClick={() => setBoardSize(5)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      boardSize === 5
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    5×5
                  </button>
                  <button
                    onClick={() => setBoardSize(6)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      boardSize === 6
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    6×6
                  </button>
                </>
              )}
            </div>
          </div>
          
          <button
            onClick={startGame}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md transition-colors"
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="game-header mb-4 flex justify-between items-center w-full max-w-md">
            <div>
              <h2 className="text-2xl font-bold">2048</h2>
            </div>
            <div className="flex space-x-4">
              <div className="bg-gray-200 px-3 py-1 rounded-md">
                <div className="text-xs text-gray-500">SCORE</div>
                <div className="font-bold">{score}</div>
              </div>
              <div className="bg-gray-200 px-3 py-1 rounded-md">
                <div className="text-xs text-gray-500">BEST</div>
                <div className="font-bold">{bestScore}</div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4 mb-4">
            <button
              onClick={startGame}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition-colors"
            >
              New Game
            </button>
            
            {isPremium && (
              <button
                onClick={undoMove}
                disabled={undosAvailable <= 0 || undoStack.length === 0}
                className={`px-4 py-2 rounded-md transition-colors ${
                  undosAvailable > 0 && undoStack.length > 0
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Undo ({undosAvailable})
              </button>
            )}
          </div>
          
          {powerUpActive && (
            <div className="power-up-indicator mb-4 bg-gray-800 text-white px-4 py-2 rounded-full flex items-center">
              <span className="mr-2">
                {powerUpType === 'double' && '×2 Double Points'}
                {powerUpType === 'merge' && '🔄 Easy Merge'}
                {powerUpType === 'remove' && '🗑️ Remove 2s'}
              </span>
              <span className="bg-white text-gray-800 px-2 py-1 rounded-full text-xs">
                {powerUpTimeLeft}s
              </span>
            </div>
          )}
          
          <div 
            className="game-board bg-gray-300 p-3 rounded-lg"
            style={{ 
              width: `${(boardSize * 80) + ((boardSize + 1) * 8)}px`,
              touchAction: 'none'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="grid gap-2"
              style={{ 
                gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
                gridTemplateRows: `repeat(${boardSize}, 1fr)`
              }}
            >
              {board.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`tile flex items-center justify-center w-20 h-20 rounded-md font-bold ${
                      cell ? getTileColor(cell) : 'bg-gray-200'
                    } ${cell ? getFontSize(cell) : ''} transition-all duration-100`}
                  >
                    {cell ? (
                      typeof cell === 'object' && cell.type === 'powerup' ? (
                        <div className="flex flex-col items-center">
                          <div className="text-2xl">{getPowerUpContent(cell).icon}</div>
                          <div className="text-xs">{getPowerUpContent(cell).text}</div>
                        </div>
                      ) : (
                        cell
                      )
                    ) : ''}
                  </div>
                ))
              ))}
            </div>
          </div>
          
          <div className="game-instructions mt-6 text-gray-600 text-center max-w-md">
            <p className="mb-2">
              <strong>How to play:</strong> Use arrow keys to move tiles. When two tiles with the same number touch, they merge into one!
            </p>
            {isPremium && (
              <p>
                <strong>Premium features:</strong> Undo moves with 'Z' key. Look for special power-up tiles!
              </p>
            )}
          </div>
          
          {/* Mobile controls */}
          <div className="mobile-controls mt-6 grid grid-cols-3 gap-2 md:hidden">
            <div></div>
            <button 
              onClick={() => moveTiles('up')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-md transition-colors"
            >
              ↑
            </button>
            <div></div>
            <button 
              onClick={() => moveTiles('left')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-md transition-colors"
            >
              ←
            </button>
            <button 
              onClick={() => moveTiles('down')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-md transition-colors"
            >
              ↓
            </button>
            <button 
              onClick={() => moveTiles('right')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-md transition-colors"
            >
              →
            </button>
          </div>
          
          {(gameOver || gameWon) && (
            <div className="game-result mt-6 bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className={`text-xl font-bold mb-2 ${gameWon ? 'text-green-600' : 'text-red-600'}`}>
                {gameWon ? 'You Win!' : 'Game Over'}
              </h3>
              <p className="mb-4">Score: {score}</p>
              <button
                onClick={startGame}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md transition-colors"
              >
                Play Again
              </button>
            </div>
          )}
          
          {isPremium && (
            <div className="premium-badge mt-4 bg-yellow-400 text-black py-1 px-4 rounded-full text-sm font-bold">
              Premium Mode
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Game2048;
