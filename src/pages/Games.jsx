import React, { useState, useEffect } from 'react';
import Tetris from '../components/games/Tetris';
import FlappyBird from '../components/games/FlappyBird';
import PacMan from '../components/games/PacMan';
import Snake from '../components/games/Snake';
import Minesweeper from '../components/games/Minesweeper';
import Game2048 from '../components/games/Game2048';
import Pong from '../components/games/Pong';
import Breakout from '../components/games/Breakout';
import RockPaperScissors from '../components/games/RockPaperScissors';
import MultiplayerLobby from '../components/common/MultiplayerLobby';
import ChallengeMode from '../components/common/ChallengeMode';
import SocialShare from '../components/common/SocialShare';
import GameModal from '../components/common/GameModal';

function Games() {
  const [activeGame, setActiveGame] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumFeatures, setPremiumFeatures] = useState({
    tetris: false,
    flappyBird: false,
    pacMan: false,
    snake: false,
    minesweeper: false,
    game2048: false,
    pong: false,
    breakout: false,
    rps: false
  });

  // New feature states
  const [playerName, setPlayerName] = useState('');
  const [showMultiplayerLobby, setShowMultiplayerLobby] = useState(false);
  const [showChallengeMode, setShowChallengeMode] = useState(false);
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [gameAchievement, setGameAchievement] = useState(null);

  // Load player name from localStorage
  useEffect(() => {
    const savedPlayerName = localStorage.getItem('playerName');
    if (savedPlayerName) {
      setPlayerName(savedPlayerName);
    }

    // Load premium features from localStorage
    const savedPremiumFeatures = localStorage.getItem('premiumFeatures');
    if (savedPremiumFeatures) {
      try {
        setPremiumFeatures(JSON.parse(savedPremiumFeatures));
      } catch (error) {
        console.error('Error loading premium features:', error);
      }
    }
  }, []);

  const handleGameSelect = (game) => {
    setActiveGame(game);
  };

  const handlePurchasePremium = (game) => {
    // In a real app, this would integrate with a payment processor
    const updatedFeatures = {
      ...premiumFeatures,
      [game]: true
    };

    setPremiumFeatures(updatedFeatures);
    setShowPremiumModal(false);

    // Save to localStorage
    localStorage.setItem('premiumFeatures', JSON.stringify(updatedFeatures));
  };

  const openPremiumModal = (game) => {
    setShowPremiumModal(game);
  };

  // Handle start multiplayer game
  const handleStartMultiplayerGame = () => {
    setShowMultiplayerLobby(false);
  };

  // Handle start challenge
  const handleStartChallenge = () => {
    // Implementation will be added when needed
  };

  // Handle complete challenge
  const handleCompleteChallenge = (result) => {
    if (result.completed) {
      // Award player with reward
      // This would typically update game state or unlock features
      setGameAchievement({
        title: `${result.challenge.title} Completed!`,
        description: `You've earned: ${result.challenge.reward}`
      });

      // Show social share modal
      setShowSocialShare(true);
    }
  };

  const renderGameSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
      {/* Tetris */}
      <div className="game-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 h-48 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-4 gap-1 w-24 h-24">
              {Array(16).fill().map((_, i) => (
                <div
                  key={`tetris-block-${i}`}
                  className={`${
                    [0, 1, 4, 5, 6, 8, 9, 10, 13, 14].includes(i)
                      ? 'bg-cyan-300'
                      : 'bg-transparent'
                  } rounded-sm`}
                ></div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 text-blue-600 px-2 py-1 rounded text-xs font-bold">
            {premiumFeatures.tetris ? 'PREMIUM' : 'FREE'}
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-2">Tetris</h3>
        <p className="text-gray-600 mb-4">
          The classic block-stacking game. Arrange falling blocks to create complete rows.
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => handleGameSelect('tetris')}
            className="btn btn-primary py-2 px-4 flex-grow"
          >
            {premiumFeatures.tetris ? 'Play Premium' : 'Play Free Version'}
          </button>
          {!premiumFeatures.tetris && (
            <button
              onClick={() => openPremiumModal('tetris')}
              className="btn btn-outline border-black text-black py-2 px-4"
            >
              Get Premium
            </button>
          )}
        </div>
      </div>

      {/* Flappy Bird */}
      <div className="game-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
        <div className="bg-gradient-to-br from-green-400 to-blue-500 h-48 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-yellow-400 relative">
                <div className="absolute top-4 right-2 w-6 h-6 rounded-full bg-white"></div>
                <div className="absolute top-5 right-3 w-3 h-3 rounded-full bg-black"></div>
                <div className="absolute top-8 right-0 w-16 h-4 bg-orange-500 rounded-r-full"></div>
              </div>
              <div className="absolute -bottom-20 left-16 w-8 h-40 bg-green-600 rounded-t-lg"></div>
              <div className="absolute -bottom-20 left-16 -top-20 w-8 h-20 bg-green-600 rounded-b-lg"></div>
              <div className="absolute -bottom-20 -left-24 w-8 h-32 bg-green-600 rounded-t-lg"></div>
              <div className="absolute -top-20 -left-24 w-8 h-24 bg-green-600 rounded-b-lg"></div>
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 text-blue-600 px-2 py-1 rounded text-xs font-bold">
            {premiumFeatures.flappyBird ? 'PREMIUM' : 'FREE'}
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-2">Flappy Bird</h3>
        <p className="text-gray-600 mb-4">
          Navigate a bird through pipes by tapping to flap. Simple but challenging!
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => handleGameSelect('flappyBird')}
            className="btn btn-primary py-2 px-4 flex-grow"
          >
            {premiumFeatures.flappyBird ? 'Play Premium' : 'Play Free Version'}
          </button>
          {!premiumFeatures.flappyBird && (
            <button
              onClick={() => openPremiumModal('flappyBird')}
              className="btn btn-outline border-black text-black py-2 px-4"
            >
              Get Premium
            </button>
          )}
        </div>
      </div>

      {/* Pac-Man */}
      <div className="game-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 h-48 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 bg-yellow-400 rounded-full relative">
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black rounded-r-full"></div>
                <div className="absolute right-4 top-4 w-3 h-3 bg-black rounded-full"></div>
              </div>
              <div className="absolute -top-12 -left-12 w-8 h-8 bg-blue-500 rounded-full"></div>
              <div className="absolute -bottom-12 left-12 w-8 h-8 bg-red-500 rounded-full"></div>
              <div className="absolute top-12 -right-12 w-8 h-8 bg-pink-500 rounded-full"></div>
              <div className="absolute -bottom-4 -left-16 w-4 h-4 bg-white rounded-full"></div>
              <div className="absolute -top-8 right-8 w-4 h-4 bg-white rounded-full"></div>
              <div className="absolute bottom-8 right-0 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 text-blue-600 px-2 py-1 rounded text-xs font-bold">
            {premiumFeatures.pacMan ? 'PREMIUM' : 'FREE'}
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-2">Pac-Man</h3>
        <p className="text-gray-600 mb-4">
          Eat all the dots while avoiding ghosts in this arcade classic.
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => handleGameSelect('pacMan')}
            className="btn btn-primary py-2 px-4 flex-grow"
          >
            {premiumFeatures.pacMan ? 'Play Premium' : 'Play Free Version'}
          </button>
          {!premiumFeatures.pacMan && (
            <button
              onClick={() => openPremiumModal('pacMan')}
              className="btn btn-outline border-black text-black py-2 px-4"
            >
              Get Premium
            </button>
          )}
        </div>
      </div>

      {/* Snake */}
      <div className="game-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-4xl">S</span>
        </div>
        <h3 className="text-xl font-bold mb-2">Snake</h3>
        <p className="text-gray-600 mb-4">
          Control a growing snake to eat food while avoiding walls and your own tail.
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => handleGameSelect('snake')}
            className="btn btn-primary py-2 px-4"
          >
            Play Free Version
          </button>
          {!premiumFeatures.snake && (
            <button
              onClick={() => openPremiumModal('snake')}
              className="btn btn-outline border-black text-black py-2 px-4"
            >
              Get Premium
            </button>
          )}
        </div>
      </div>

      {/* Minesweeper */}
      <div className="game-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-4xl">M</span>
        </div>
        <h3 className="text-xl font-bold mb-2">Minesweeper</h3>
        <p className="text-gray-600 mb-4">
          Clear the board without detonating any mines. Use logic to identify safe squares.
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => handleGameSelect('minesweeper')}
            className="btn btn-primary py-2 px-4"
          >
            Play Free Version
          </button>
          {!premiumFeatures.minesweeper && (
            <button
              onClick={() => openPremiumModal('minesweeper')}
              className="btn btn-outline border-black text-black py-2 px-4"
            >
              Get Premium
            </button>
          )}
        </div>
      </div>

      {/* 2048 */}
      <div className="game-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-4xl">2048</span>
        </div>
        <h3 className="text-xl font-bold mb-2">2048</h3>
        <p className="text-gray-600 mb-4">
          Combine tiles with the same number to create a tile with the value 2048.
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => handleGameSelect('game2048')}
            className="btn btn-primary py-2 px-4"
          >
            Play Free Version
          </button>
          {!premiumFeatures.game2048 && (
            <button
              onClick={() => openPremiumModal('game2048')}
              className="btn btn-outline border-black text-black py-2 px-4"
            >
              Get Premium
            </button>
          )}
        </div>
      </div>

      {/* Rock Paper Scissors */}
      <div className="game-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center relative">
          <span className="text-4xl">RPS</span>
          <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 text-blue-600 px-2 py-1 rounded text-xs font-bold">
            {premiumFeatures.rps ? 'PREMIUM' : 'FREE'}
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">Rock Paper Scissors</h3>
        <p className="text-gray-600 mb-4">
          Choose rock, paper, or scissors and see if you can beat the computer.
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => handleGameSelect('rps')}
            className="btn btn-primary py-2 px-4"
          >
            {premiumFeatures.rps ? 'Play Premium' : 'Play'}
          </button>
          {!premiumFeatures.rps && (
            <button
              onClick={() => openPremiumModal('rps')}
              className="btn btn-outline border-black text-black py-2 px-4"
            >
              Get Premium
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderActiveGame = () => {
    switch (activeGame) {
      case 'tetris':
        return (
          <div className="game-container">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Tetris</h2>
              <button
                onClick={() => setActiveGame(null)}
                className="btn btn-outline border-black text-black py-2 px-4"
              >
                Back to Games
              </button>
            </div>
            <Tetris isPremium={premiumFeatures.tetris} />
          </div>
        );
      case 'flappyBird':
        return (
          <div className="game-container">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Flappy Bird</h2>
              <button
                onClick={() => setActiveGame(null)}
                className="btn btn-outline border-black text-black py-2 px-4"
              >
                Back to Games
              </button>
            </div>
            <FlappyBird isPremium={premiumFeatures.flappyBird} />
          </div>
        );
      case 'pacMan':
        return (
          <div className="game-container">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Pac-Man</h2>
              <button
                onClick={() => setActiveGame(null)}
                className="btn btn-outline border-black text-black py-2 px-4"
              >
                Back to Games
              </button>
            </div>
            <PacMan isPremium={premiumFeatures.pacMan} />
          </div>
        );
      case 'snake':
        return (
          <div className="game-container">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Snake</h2>
              <button
                onClick={() => setActiveGame(null)}
                className="btn btn-outline border-black text-black py-2 px-4"
              >
                Back to Games
              </button>
            </div>
            <Snake isPremium={premiumFeatures.snake} />
          </div>
        );
      case 'minesweeper':
        return (
          <div className="game-container">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Minesweeper</h2>
              <button
                onClick={() => setActiveGame(null)}
                className="btn btn-outline border-black text-black py-2 px-4"
              >
                Back to Games
              </button>
            </div>
            <Minesweeper isPremium={premiumFeatures.minesweeper} />
          </div>
        );
      case 'game2048':
        return (
          <div className="game-container">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">2048</h2>
              <button
                onClick={() => setActiveGame(null)}
                className="btn btn-outline border-black text-black py-2 px-4"
              >
                Back to Games
              </button>
            </div>
            <Game2048 isPremium={premiumFeatures.game2048} />
          </div>
        );
      case 'pong':
        return (
          <div className="game-container">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Pong</h2>
              <button
                onClick={() => setActiveGame(null)}
                className="btn btn-outline border-black text-black py-2 px-4"
              >
                Back to Games
              </button>
            </div>
            <Pong isPremium={premiumFeatures.pong} />
          </div>
        );
      case 'rps':
        return (
          <div className="game-container">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Rock Paper Scissors</h2>
              <button
                onClick={() => setActiveGame(null)}
                className="btn btn-outline border-black text-black py-2 px-4"
              >
                Back to Games
              </button>
            </div>
            <RockPaperScissors />
          </div>
        );
      case 'breakout':
        return (
          <div className="game-container">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Breakout</h2>
              <button
                onClick={() => setActiveGame(null)}
                className="btn btn-outline border-black text-black py-2 px-4"
              >
                Back to Games
              </button>
            </div>
            <Breakout isPremium={premiumFeatures.breakout} />
          </div>
        );
      default:
        return null;
    }
  };

  const renderPremiumModal = () => {
    if (!showPremiumModal) return null;

    const gameNames = {
      tetris: 'Tetris',
      flappyBird: 'Flappy Bird',
      pacMan: 'Pac-Man',
      snake: 'Snake',
      minesweeper: 'Minesweeper',
      game2048: '2048',
      pong: 'Pong',
      breakout: 'Breakout',
      rps: 'Rock Paper Scissors'
    };

    const gameColors = {
      tetris: 'from-cyan-500 to-blue-600',
      flappyBird: 'from-green-400 to-blue-500',
      pacMan: 'from-yellow-400 to-yellow-600',
      snake: 'from-green-500 to-emerald-700',
      minesweeper: 'from-gray-500 to-gray-700',
      game2048: 'from-orange-400 to-amber-600',
      pong: 'from-purple-500 to-blue-500',
      breakout: 'from-blue-500 to-purple-500',
      rps: 'from-pink-500 to-red-500'
    };

    const premiumFeaturesList = {
      tetris: [
        { title: 'Slower Block Speed', description: 'Blocks fall more slowly, giving you more time to think' },
        { title: 'Ghost Piece Preview', description: 'See where your piece will land before dropping it' },
        { title: 'Unlimited Undos', description: 'Made a mistake? Just undo your last move' },
        { title: '1.5x Score Multiplier', description: 'Earn more points for every line you clear' }
      ],
      flappyBird: [
        { title: '3 Extra Lives', description: 'Start with multiple lives to survive longer' },
        { title: 'Slower Pipe Speed', description: 'Pipes move more slowly for an easier experience' },
        { title: 'Wider Gaps', description: 'Larger gaps between pipes make navigation easier' },
        { title: 'Power-ups', description: 'Collect special power-ups for temporary invincibility' }
      ],
      pacMan: [
        { title: '3 Extra Lives', description: 'Start with more lives to extend your gameplay' },
        { title: 'Slower Ghosts', description: 'Ghosts move more slowly, giving you more time to escape' },
        { title: 'Extended Power Pellets', description: 'Power pellets last longer, giving you more time to eat ghosts' },
        { title: 'Special Power-ups', description: 'Collect special items for unique abilities' }
      ],
      snake: [
        { title: 'Multiple Lives', description: 'Start with 3 extra lives to survive collisions' },
        { title: 'Adjustable Speed', description: 'Control the game speed for a customized experience' },
        { title: 'Special Power-ups', description: 'Collect unique power-ups with special abilities' },
        { title: 'Larger Playing Field', description: 'More space to grow your snake without hitting walls' }
      ],
      minesweeper: [
        { title: 'Hint System', description: 'Get hints to reveal safe cells when you\'re stuck' },
        { title: 'Safe Clicks', description: 'Use special safe clicks that guarantee avoiding mines' },
        { title: 'Multiple Difficulties', description: 'Choose from easy, medium, or hard difficulty levels' },
        { title: 'Custom Board Sizes', description: 'Create custom board sizes for your preferred challenge' }
      ],
      game2048: [
        { title: 'Undo Moves', description: 'Made a mistake? Undo your last moves' },
        { title: 'Larger Boards', description: 'Play on 5x5 or 6x6 boards for more strategy' },
        { title: 'Special Tiles', description: 'Collect special power-up tiles with unique abilities' },
        { title: 'Save Progress', description: 'Save your game and continue later' }
      ],
      pong: [
        { title: 'Larger Paddle', description: 'Play with a 20% larger paddle for easier gameplay' },
        { title: 'Easier Computer Opponent', description: 'Computer opponent has slower reaction time' },
        { title: 'Power-ups', description: 'Collect special power-ups during gameplay' },
        { title: 'Multiplayer Mode', description: 'Play against friends in local multiplayer mode' }
      ],
      breakout: [
        { title: 'Wider Paddle', description: 'Play with a 20% wider paddle for easier gameplay' },
        { title: 'Slower Ball Speed', description: 'Ball moves more slowly for an easier experience' },
        { title: 'Extra Lives', description: 'Start with 5 lives instead of 3' },
        { title: 'Power-ups', description: 'Collect special power-ups during gameplay' }
      ],
      rps: [
        { title: 'Score Tracking', description: 'Keep track of wins, losses and draws' },
        { title: 'Statistics', description: 'View your performance over multiple rounds' }
      ]
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-0 max-w-md w-full overflow-hidden shadow-2xl">
          <div className={`bg-gradient-to-r ${gameColors[showPremiumModal]} p-6 text-white`}>
            <h2 className="text-3xl font-bold mb-2">
              Premium {gameNames[showPremiumModal]}
            </h2>
            <p className="opacity-90">Unlock enhanced gameplay and exclusive features</p>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Premium Features</h3>
              <div className="space-y-4">
                {premiumFeaturesList[showPremiumModal].map((feature, index) => (
                  <div key={`feature-${showPremiumModal}-${index}`} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-base font-medium text-gray-800">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Premium Upgrade</span>
                <span className="text-xl font-bold">$4.99</span>
              </div>
              <p className="text-sm text-gray-500">One-time purchase, no subscription</p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setShowPremiumModal(false)}
                className="btn btn-outline border-gray-300 text-gray-700 py-2 px-6 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePurchasePremium(showPremiumModal)}
                className={`btn text-white py-2 px-6 bg-gradient-to-r ${gameColors[showPremiumModal]} hover:shadow-lg transition-all duration-300`}
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render multiplayer lobby
  const renderMultiplayerLobby = () => {
    if (!showMultiplayerLobby) return null;

    return (
      <GameModal
        isOpen={showMultiplayerLobby}
        onClose={() => setShowMultiplayerLobby(false)}
        title={`${getGameName(activeGame)} Multiplayer`}
        size="lg"
      >
        <MultiplayerLobby
          gameId={activeGame}
          onStartGame={handleStartMultiplayerGame}
          onCancel={() => setShowMultiplayerLobby(false)}
          supportedModes={getGameModes(activeGame)}
          supportedDifficulties={['easy', 'normal', 'hard']}
        />
      </GameModal>
    );
  };

  // Render challenge mode
  const renderChallengeMode = () => {
    if (!showChallengeMode) return null;

    return (
      <GameModal
        isOpen={showChallengeMode}
        onClose={() => setShowChallengeMode(false)}
        title={`${getGameName(activeGame)} Challenges`}
        size="lg"
      >
        <ChallengeMode
          gameId={activeGame}
          playerName={playerName}
          onStart={handleStartChallenge}
          onComplete={handleCompleteChallenge}
          onCancel={() => setShowChallengeMode(false)}
        />
      </GameModal>
    );
  };

  // Render social share
  const renderSocialShare = () => {
    if (!showSocialShare) return null;

    return (
      <SocialShare
        isOpen={showSocialShare}
        onClose={() => setShowSocialShare(false)}
        gameId={activeGame}
        playerName={playerName}
        score={gameScore}
        level={gameLevel}
        achievement={gameAchievement}
      />
    );
  };

  // Get game name from ID
  const getGameName = (gameId) => {
    const gameNames = {
      tetris: 'Tetris',
      flappyBird: 'Flappy Bird',
      pacMan: 'Pac-Man',
      snake: 'Snake',
      minesweeper: 'Minesweeper',
      game2048: '2048',
      pong: 'Pong',
      breakout: 'Breakout',
      rps: 'Rock Paper Scissors'
    };

    return gameNames[gameId] || gameId;
  };

  // Get supported game modes
  const getGameModes = (gameId) => {
    const gameModes = {
      tetris: ['classic', 'marathon', 'sprint'],
      flappyBird: ['classic', 'night', 'challenge'],
      pacMan: ['classic', 'dark', 'colorblind'],
      snake: ['classic', 'no-walls', 'obstacles'],
      minesweeper: ['classic', 'hexagonal', 'triangular'],
      game2048: ['classic', '3x3', '5x5'],
      pong: ['classic', 'multiplayer', 'challenge'],
      breakout: ['classic', 'endless', 'puzzle'],
      rps: ['classic']
    };

    return gameModes[gameId] || ['classic'];
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-lg bg-blue-500 rotate-12"></div>
          <div className="absolute top-40 left-1/4 w-16 h-16 rounded-full bg-red-500"></div>
          <div className="absolute top-20 right-1/3 w-24 h-24 rounded-lg bg-yellow-500 -rotate-12"></div>
          <div className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-green-500"></div>
          <div className="absolute bottom-32 left-1/3 w-12 h-12 rounded-lg bg-purple-500 rotate-45"></div>
        </div>

        <div className="container py-20 px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              John Corp <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Games</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
              Experience classic arcade games reimagined with modern design and premium features.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium">
                <span className="text-yellow-400 mr-2">✓</span> No downloads required
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium">
                <span className="text-yellow-400 mr-2">✓</span> Play on any device
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium">
                <span className="text-yellow-400 mr-2">✓</span> Multiplayer modes
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium">
                <span className="text-yellow-400 mr-2">✓</span> Challenge friends
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-16 px-4">
        {activeGame ? (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            {renderActiveGame()}
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Choose Your Game</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Select from our collection of classic arcade games, each with free and premium versions.
                Upgrade to premium for enhanced gameplay features and advantages.
              </p>
            </div>
            {renderGameSelection()}
          </>
        )}
      </div>

      {/* Modals */}
      {renderPremiumModal()}
      {renderMultiplayerLobby()}
      {renderChallengeMode()}
      {renderSocialShare()}
    </div>
  );
}

export default Games;
