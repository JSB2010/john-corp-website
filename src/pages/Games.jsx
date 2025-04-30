import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Tetris from '../components/games/Tetris';
import FlappyBird from '../components/games/FlappyBird';
import PacMan from '../components/games/PacMan';

function Games() {
  const [activeGame, setActiveGame] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumFeatures, setPremiumFeatures] = useState({
    tetris: false,
    flappyBird: false,
    pacMan: false
  });

  const handleGameSelect = (game) => {
    setActiveGame(game);
  };

  const handlePurchasePremium = (game) => {
    // In a real app, this would integrate with a payment processor
    setPremiumFeatures({
      ...premiumFeatures,
      [game]: true
    });
    setShowPremiumModal(false);
  };

  const openPremiumModal = (game) => {
    setShowPremiumModal(game);
  };

  const renderGameSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
      <div className="game-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-4xl">T</span>
        </div>
        <h3 className="text-xl font-bold mb-2">Tetris</h3>
        <p className="text-gray-600 mb-4">
          The classic block-stacking game. Arrange falling blocks to create complete rows.
        </p>
        <div className="flex space-x-2">
          <button 
            onClick={() => handleGameSelect('tetris')} 
            className="btn btn-primary py-2 px-4"
          >
            Play Free Version
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

      <div className="game-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-4xl">F</span>
        </div>
        <h3 className="text-xl font-bold mb-2">Flappy Bird</h3>
        <p className="text-gray-600 mb-4">
          Navigate a bird through pipes by tapping to flap. Simple but challenging!
        </p>
        <div className="flex space-x-2">
          <button 
            onClick={() => handleGameSelect('flappyBird')} 
            className="btn btn-primary py-2 px-4"
          >
            Play Free Version
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

      <div className="game-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-4xl">P</span>
        </div>
        <h3 className="text-xl font-bold mb-2">Pac-Man</h3>
        <p className="text-gray-600 mb-4">
          Eat all the dots while avoiding ghosts in this arcade classic.
        </p>
        <div className="flex space-x-2">
          <button 
            onClick={() => handleGameSelect('pacMan')} 
            className="btn btn-primary py-2 px-4"
          >
            Play Free Version
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
      default:
        return null;
    }
  };

  const renderPremiumModal = () => {
    if (!showPremiumModal) return null;

    const gameNames = {
      tetris: 'Tetris',
      flappyBird: 'Flappy Bird',
      pacMan: 'Pac-Man'
    };

    const premiumFeaturesList = {
      tetris: [
        'Slow down block falling speed',
        'Save your game progress',
        'Unlimited undos',
        'No advertisements'
      ],
      flappyBird: [
        'Start with 3 extra lives',
        'Slower pipe speed',
        'Wider gaps between pipes',
        'No advertisements'
      ],
      pacMan: [
        'Start with 3 extra lives',
        'Slower ghost movement',
        'Power pellets last longer',
        'No advertisements'
      ]
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
          <h3 className="text-2xl font-bold mb-4">{gameNames[showPremiumModal]} Premium</h3>
          <p className="text-gray-600 mb-4">
            Upgrade to premium to unlock these advantages:
          </p>
          <ul className="list-disc pl-5 mb-6">
            {premiumFeaturesList[showPremiumModal].map((feature, index) => (
              <li key={index} className="text-gray-700 mb-2">{feature}</li>
            ))}
          </ul>
          <div className="text-2xl font-bold mb-6 text-center">$4.99</div>
          <div className="flex space-x-4">
            <button 
              onClick={() => handlePurchasePremium(showPremiumModal)} 
              className="btn btn-primary py-2 px-4 w-full"
            >
              Purchase
            </button>
            <button 
              onClick={() => setShowPremiumModal(false)} 
              className="btn btn-outline border-black text-black py-2 px-4 w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white">
        <div className="container py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">John Corp Games</h1>
            <p className="text-xl mb-8">
              Play our collection of classic arcade games with a modern twist.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-16 px-4">
        {activeGame ? renderActiveGame() : renderGameSelection()}
      </div>

      {/* Premium Modal */}
      {renderPremiumModal()}
    </div>
  );
}

export default Games;
