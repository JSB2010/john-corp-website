import React, { useState } from 'react';

const CHOICES = ['rock', 'paper', 'scissors'];

function getResult(player, computer) {
  if (player === computer) return 'draw';
  if (
    (player === 'rock' && computer === 'scissors') ||
    (player === 'paper' && computer === 'rock') ||
    (player === 'scissors' && computer === 'paper')
  ) {
    return 'win';
  }
  return 'lose';
}

function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ win: 0, lose: 0, draw: 0 });

  const playRound = (choice) => {
    const computer = CHOICES[Math.floor(Math.random() * CHOICES.length)];
    const outcome = getResult(choice, computer);

    setPlayerChoice(choice);
    setComputerChoice(computer);
    setResult(outcome);
    setScore(prev => ({ ...prev, [outcome]: prev[outcome] + 1 }));
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setScore({ win: 0, lose: 0, draw: 0 });
  };

  return (
    <div className="rps-game flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-bold">Rock Paper Scissors</h2>
      <div className="flex space-x-4">
        {CHOICES.map(choice => (
          <button
            key={choice}
            onClick={() => playRound(choice)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {choice.charAt(0).toUpperCase() + choice.slice(1)}
          </button>
        ))}
      </div>

      {result && (
        <div className="mt-4 text-center">
          <p className="text-lg">You chose: {playerChoice}</p>
          <p className="text-lg">Computer chose: {computerChoice}</p>
          <p className="text-xl font-bold mt-2">
            {getResultMessage(result)}
          </p>
        </div>
      )}

      <div className="mt-4">
        <p>Wins: {score.win} | Losses: {score.lose} | Draws: {score.draw}</p>
      </div>

      <button
        onClick={resetGame}
        className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
      >
        Reset
      </button>
    </div>
  );
}

export default RockPaperScissors;
