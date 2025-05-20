import React, { useState } from 'react';

function PacMan({ isPremium }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  return (
    <div className="pacman-game flex flex-col items-center">
      <div className="game-container flex flex-col md:flex-row gap-6">
        <div className="game-area relative">
          <div 
            className="border-2 border-gray-800 rounded-lg shadow-lg"
            style={{ width: '500px', height: '550px', backgroundColor: '#000' }}
          >
            {!gameStarted && (
              <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-8 rounded-lg">
                <h2 className="text-3xl font-bold mb-4 text-center">Pac-Man</h2>
                <div className="mb-6 text-center max-w-md">
                  <p className="mb-4">
                    Use arrow keys to navigate the maze. Eat all the dots while avoiding ghosts!
                  </p>
                  {isPremium && (
                    <div className="bg-yellow-500 text-black p-3 rounded-lg mb-4">
                      <p className="font-bold">Premium Features:</p>
                      <ul className="list-disc list-inside text-sm mt-2">
                        <li>Slower ghost movement</li>
                        <li>Extra power pellets</li>
                        <li>3 lives instead of 1</li>
                        <li>2x point multiplier</li>
                      </ul>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setGameStarted(true)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black py-3 px-8 rounded-full text-lg font-medium transition-colors"
                >
                  Start Game
                </button>
              </div>
            )}

            {gameStarted && !gameOver && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
                  <p className="text-xl font-bold">Score: {score}</p>
                </div>
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
                  <p className="text-xl font-bold">Lives: {isPremium ? 3 : 1}</p>
                </div>
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
                  className="bg-yellow-500 hover:bg-yellow-600 text-black py-3 px-8 rounded-full text-lg font-medium transition-colors"
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
            <button 
              className="btn bg-gray-200 hover:bg-gray-300 text-black py-3 px-4 rounded-lg"
              onClick={() => {
                if (gameStarted && !gameOver) {
                  setScore(prev => prev + 10);
                }
              }}
            >←</button>
            <button 
              className="btn bg-gray-200 hover:bg-gray-300 text-black py-3 px-4 rounded-lg"
              onClick={() => {
                if (gameStarted && !gameOver) {
                  setScore(prev => prev + 10);
                }
              }}
            >↓</button>
            <button 
              className="btn bg-gray-200 hover:bg-gray-300 text-black py-3 px-4 rounded-lg"
              onClick={() => {
                if (gameStarted && !gameOver) {
                  setScore(prev => prev + 10);
                }
              }}
            >→</button>
            <button 
              className="btn bg-gray-200 hover:bg-gray-300 text-black py-3 px-4 rounded-lg col-start-2"
              onClick={() => {
                if (gameStarted && !gameOver) {
                  setScore(prev => prev + 10);
                }
              }}
            >↑</button>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>Keyboard: Use arrow keys to move Pac-Man</p>
            {isPremium && (
              <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                <p className="font-medium text-yellow-800">Premium Status Active</p>
                <p className="text-yellow-700 mt-1">Enjoying slower ghosts and extra lives!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PacMan;
