import React, { useState, useEffect, useCallback } from 'react';

function Minesweeper({ isPremium }) {
  // Game settings
  const [difficulty, setDifficulty] = useState('medium');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  const [flagMode, setFlagMode] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintsAvailable, setHintsAvailable] = useState(isPremium ? 5 : 0);
  const [safeClicksAvailable, setSafeClicksAvailable] = useState(isPremium ? 3 : 0);
  const [board, setBoard] = useState([]);
  const [mineCount, setMineCount] = useState(0);
  const [flagCount, setFlagCount] = useState(0);
  const [boardSize, setBoardSize] = useState({ rows: 10, cols: 10 });
  const [cellSize, setCellSize] = useState(30);

  // Initialize board based on difficulty
  const initializeBoard = useCallback(() => {
    let rows, cols, mines;
    
    switch (difficulty) {
      case 'easy':
        rows = 8;
        cols = 8;
        mines = 10;
        setCellSize(40);
        break;
      case 'medium':
        rows = 12;
        cols = 12;
        mines = 30;
        setCellSize(30);
        break;
      case 'hard':
        rows = 16;
        cols = 16;
        mines = 60;
        setCellSize(25);
        break;
      default:
        rows = 10;
        cols = 10;
        mines = 20;
        setCellSize(30);
    }
    
    setBoardSize({ rows, cols });
    setMineCount(mines);
    setFlagCount(0);
    
    // Create empty board
    const newBoard = Array(rows).fill().map(() => 
      Array(cols).fill().map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
        isHinted: false
      }))
    );
    
    setBoard(newBoard);
    setFirstClick(true);
    setGameOver(false);
    setGameWon(false);
    setTimer(0);
    setHintsUsed(0);
    setHintsAvailable(isPremium ? 5 : 0);
    setSafeClicksAvailable(isPremium ? 3 : 0);
    
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [difficulty, isPremium, timerInterval]);

  // Place mines after first click
  const placeMines = useCallback((clickRow, clickCol) => {
    setBoard(prevBoard => {
      const newBoard = JSON.parse(JSON.stringify(prevBoard));
      let minesPlaced = 0;
      
      // Place mines randomly
      while (minesPlaced < mineCount) {
        const row = Math.floor(Math.random() * boardSize.rows);
        const col = Math.floor(Math.random() * boardSize.cols);
        
        // Don't place mine on first click or adjacent cells
        const isClickArea = Math.abs(row - clickRow) <= 1 && Math.abs(col - clickCol) <= 1;
        
        if (!newBoard[row][col].isMine && !isClickArea) {
          newBoard[row][col].isMine = true;
          minesPlaced++;
        }
      }
      
      // Calculate neighbor mines
      for (let row = 0; row < boardSize.rows; row++) {
        for (let col = 0; col < boardSize.cols; col++) {
          if (!newBoard[row][col].isMine) {
            let count = 0;
            
            // Check all 8 adjacent cells
            for (let r = Math.max(0, row - 1); r <= Math.min(boardSize.rows - 1, row + 1); r++) {
              for (let c = Math.max(0, col - 1); c <= Math.min(boardSize.cols - 1, col + 1); c++) {
                if (newBoard[r][c].isMine) {
                  count++;
                }
              }
            }
            
            newBoard[row][col].neighborMines = count;
          }
        }
      }
      
      return newBoard;
    });
  }, [boardSize.rows, boardSize.cols, mineCount]);

  // Start game
  const startGame = useCallback(() => {
    initializeBoard();
    setGameStarted(true);
  }, [initializeBoard]);

  // Handle cell click
  const handleCellClick = useCallback((row, col) => {
    if (gameOver || gameWon) return;
    
    // Start timer on first click
    if (firstClick) {
      setFirstClick(false);
      placeMines(row, col);
      
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      
      setTimerInterval(interval);
    }
    
    setBoard(prevBoard => {
      const newBoard = JSON.parse(JSON.stringify(prevBoard));
      const cell = newBoard[row][col];
      
      // Handle flag mode
      if (flagMode) {
        if (!cell.isRevealed) {
          if (cell.isFlagged) {
            cell.isFlagged = false;
            setFlagCount(prev => prev - 1);
          } else {
            cell.isFlagged = true;
            setFlagCount(prev => prev + 1);
          }
        }
        return newBoard;
      }
      
      // Skip if cell is flagged or already revealed
      if (cell.isFlagged || cell.isRevealed) {
        return prevBoard;
      }
      
      // Game over if mine is clicked
      if (cell.isMine) {
        // Use safe click if available
        if (safeClicksAvailable > 0) {
          setSafeClicksAvailable(prev => prev - 1);
          return prevBoard;
        }
        
        // Reveal all mines
        for (let r = 0; r < boardSize.rows; r++) {
          for (let c = 0; c < boardSize.cols; c++) {
            if (newBoard[r][c].isMine) {
              newBoard[r][c].isRevealed = true;
            }
          }
        }
        
        setGameOver(true);
        clearInterval(timerInterval);
        setTimerInterval(null);
        return newBoard;
      }
      
      // Reveal cell
      revealCell(newBoard, row, col);
      
      // Check if game is won
      const isGameWon = checkWinCondition(newBoard);
      if (isGameWon) {
        setGameWon(true);
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      
      return newBoard;
    });
  }, [
    gameOver, 
    gameWon, 
    firstClick, 
    flagMode, 
    placeMines, 
    boardSize.rows, 
    boardSize.cols, 
    timerInterval,
    safeClicksAvailable
  ]);

  // Reveal cell and adjacent cells if empty
  const revealCell = (board, row, col) => {
    const cell = board[row][col];
    
    // Skip if already revealed or flagged
    if (cell.isRevealed || cell.isFlagged) return;
    
    // Reveal cell
    cell.isRevealed = true;
    
    // If cell has no adjacent mines, reveal adjacent cells
    if (cell.neighborMines === 0) {
      for (let r = Math.max(0, row - 1); r <= Math.min(boardSize.rows - 1, row + 1); r++) {
        for (let c = Math.max(0, col - 1); c <= Math.min(boardSize.cols - 1, col + 1); c++) {
          if (r !== row || c !== col) {
            revealCell(board, r, c);
          }
        }
      }
    }
  };

  // Check if game is won
  const checkWinCondition = (board) => {
    for (let row = 0; row < boardSize.rows; row++) {
      for (let col = 0; col < boardSize.cols; col++) {
        const cell = board[row][col];
        if (!cell.isMine && !cell.isRevealed) {
          return false;
        }
      }
    }
    return true;
  };

  // Use hint (premium feature)
  const useHint = useCallback(() => {
    if (hintsAvailable <= 0 || gameOver || gameWon || firstClick) return;
    
    setHintsAvailable(prev => prev - 1);
    setHintsUsed(prev => prev + 1);
    
    // Find a safe cell to hint
    setBoard(prevBoard => {
      const newBoard = JSON.parse(JSON.stringify(prevBoard));
      const safeCells = [];
      
      for (let row = 0; row < boardSize.rows; row++) {
        for (let col = 0; col < boardSize.cols; col++) {
          const cell = newBoard[row][col];
          if (!cell.isMine && !cell.isRevealed && !cell.isFlagged && !cell.isHinted) {
            safeCells.push({ row, col });
          }
        }
      }
      
      if (safeCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * safeCells.length);
        const { row, col } = safeCells[randomIndex];
        newBoard[row][col].isHinted = true;
        
        // Hint disappears after 3 seconds
        setTimeout(() => {
          setBoard(prevBoard => {
            const newBoard = JSON.parse(JSON.stringify(prevBoard));
            if (newBoard[row][col]) {
              newBoard[row][col].isHinted = false;
            }
            return newBoard;
          });
        }, 3000);
      }
      
      return newBoard;
    });
  }, [hintsAvailable, gameOver, gameWon, firstClick, boardSize.rows, boardSize.cols]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  // Initialize board on mount
  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  return (
    <div className="minesweeper-game flex flex-col items-center">
      {!gameStarted ? (
        <div className="start-screen bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Minesweeper</h2>
          <p className="mb-6 text-center text-gray-600">
            Uncover all cells without hitting mines. Right-click or use flag mode to mark potential mines.
            {isPremium && " Premium mode: Hints and safe clicks available."}
          </p>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Difficulty:</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setDifficulty('easy')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  difficulty === 'easy'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Easy
              </button>
              <button
                onClick={() => setDifficulty('medium')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  difficulty === 'medium'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => setDifficulty('hard')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  difficulty === 'hard'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Hard
              </button>
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
          <div className="game-header mb-4 flex justify-between items-center w-full max-w-lg">
            <div className="flex items-center">
              <div className="bg-gray-200 px-3 py-1 rounded-md mr-4">
                <span className="font-bold">🚩 {flagCount}</span> / <span>{mineCount}</span>
              </div>
              <div className="bg-gray-200 px-3 py-1 rounded-md">
                <span className="font-bold">⏱️ {formatTime(timer)}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setFlagMode(!flagMode)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  flagMode
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🚩 Flag Mode
              </button>
              
              {isPremium && (
                <>
                  <button
                    onClick={useHint}
                    disabled={hintsAvailable <= 0 || gameOver || gameWon || firstClick}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      hintsAvailable > 0 && !gameOver && !gameWon && !firstClick
                        ? 'bg-purple-500 text-white hover:bg-purple-600'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    💡 Hint ({hintsAvailable})
                  </button>
                </>
              )}
            </div>
          </div>
          
          {isPremium && (
            <div className="mb-4 text-center">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Safe Clicks: {safeClicksAvailable}
              </span>
            </div>
          )}
          
          <div 
            className="game-board border-2 border-gray-300 rounded-lg overflow-hidden"
            style={{
              display: 'grid',
              gridTemplateRows: `repeat(${boardSize.rows}, ${cellSize}px)`,
              gridTemplateColumns: `repeat(${boardSize.cols}, ${cellSize}px)`,
              gap: '1px',
              backgroundColor: '#ccc'
            }}
          >
            {board.map((row, rowIndex) => (
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (!cell.isRevealed) {
                      setBoard(prevBoard => {
                        const newBoard = JSON.parse(JSON.stringify(prevBoard));
                        if (newBoard[rowIndex][colIndex].isFlagged) {
                          newBoard[rowIndex][colIndex].isFlagged = false;
                          setFlagCount(prev => prev - 1);
                        } else {
                          newBoard[rowIndex][colIndex].isFlagged = true;
                          setFlagCount(prev => prev + 1);
                        }
                        return newBoard;
                      });
                    }
                  }}
                  className={`cell flex items-center justify-center select-none cursor-pointer ${
                    cell.isRevealed
                      ? cell.isMine
                        ? 'bg-red-500'
                        : 'bg-gray-100'
                      : cell.isHinted
                        ? 'bg-yellow-200 animate-pulse'
                        : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  style={{ width: cellSize, height: cellSize }}
                >
                  {cell.isFlagged ? (
                    <span>🚩</span>
                  ) : cell.isRevealed ? (
                    cell.isMine ? (
                      <span>💣</span>
                    ) : cell.neighborMines > 0 ? (
                      <span className={`font-bold ${getCellColor(cell.neighborMines)}`}>
                        {cell.neighborMines}
                      </span>
                    ) : null
                  ) : null}
                </div>
              ))
            ))}
          </div>
          
          {(gameOver || gameWon) && (
            <div className="game-result mt-6 bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className={`text-xl font-bold mb-2 ${gameWon ? 'text-green-600' : 'text-red-600'}`}>
                {gameWon ? 'You Win!' : 'Game Over'}
              </h3>
              <p className="mb-4">Time: {formatTime(timer)}</p>
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

// Helper function to get cell color based on number
function getCellColor(num) {
  switch (num) {
    case 1: return 'text-blue-600';
    case 2: return 'text-green-600';
    case 3: return 'text-red-600';
    case 4: return 'text-purple-800';
    case 5: return 'text-red-800';
    case 6: return 'text-teal-600';
    case 7: return 'text-black';
    case 8: return 'text-gray-600';
    default: return '';
  }
}

export default Minesweeper;
