import React, { useState } from 'react';

function Tetris({ isPremium }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  return (
    <div className="tetris-game flex flex-col items-center">
      <div className="game-container flex flex-col md:flex-row gap-6">
        <div className="game-area relative">
          <div 
            className="border-2 border-gray-800 rounded-lg shadow-lg"
            style={{ width: '300px', height: '600px', backgroundColor: '#111' }}
          >
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
                  onClick={() => setGameStarted(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-full text-lg font-medium transition-colors"
                >
                  Start Game
                </button>
              </div>
            )}

            {gameStarted && !gameOver && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <p className="text-xl">Game is in progress...</p>
                <button
                  onClick={() => setGameOver(true)}
                  className="absolute bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded"
                >
                  End Game
                </button>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-8 rounded-lg">
                <h2 className="text-3xl font-bold mb-4 text-center">Game Over</h2>
                <div className="stats bg-gray-800 p-6 rounded-lg mb-6">
                  <p className="text-xl mb-2">Score: <span className="font-bold text-yellow-400">{score}</span></p>
                </div>
                <button
                  onClick={() => {
                    setGameStarted(true);
                    setGameOver(false);
                    setScore(0);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-full text-lg font-medium transition-colors"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="game-controls bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 border-b pb-2">Controls</h3>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button className="btn bg-gray-200 hover:bg-gray-300 text-black py-3 px-4 rounded-lg">←</button>
            <button className="btn bg-gray-200 hover:bg-gray-300 text-black py-3 px-4 rounded-lg">↓</button>
            <button className="btn bg-gray-200 hover:bg-gray-300 text-black py-3 px-4 rounded-lg">→</button>
            <button className="btn bg-gray-200 hover:bg-gray-300 text-black py-3 px-4 rounded-lg col-start-2">↑</button>
          </div>
          <button className="btn bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg w-full mb-2">
            Hard Drop (Space)
          </button>
          {isPremium && (
            <button className="btn bg-yellow-500 hover:bg-yellow-600 text-black py-3 px-4 rounded-lg w-full">
              Undo (Z)
            </button>
          )}
          <div className="mt-4 text-sm text-gray-600">
            <p>Keyboard: Arrow keys to move, Up to rotate, Space for hard drop</p>
            {isPremium && <p className="mt-1">Premium: Z key to undo moves</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tetris;
