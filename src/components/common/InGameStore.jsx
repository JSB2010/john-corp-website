import React, { useState } from 'react';
import GameModal from './GameModal';

/**
 * In-Game Store Component
 * Displays available in-game purchases for cosmetic items and power-ups
 */
function InGameStore({ 
  isOpen, 
  onClose, 
  gameId,
  playerBalance = 0,
  onPurchase,
  ownedItems = []
}) {
  const [activeTab, setActiveTab] = useState('cosmetics');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Store items by game
  const storeItems = {
    tetris: {
      cosmetics: [
        { id: 'tetris_theme_neon', name: 'Neon Theme', price: 200, type: 'theme', image: '🎨', description: 'Bright neon colors for blocks' },
        { id: 'tetris_theme_retro', name: 'Retro Theme', price: 150, type: 'theme', image: '🕹️', description: 'Classic 8-bit style graphics' },
        { id: 'tetris_effect_sparkle', name: 'Sparkle Effect', price: 100, type: 'effect', image: '✨', description: 'Blocks sparkle when placed' },
        { id: 'tetris_sound_synth', name: 'Synth Sounds', price: 120, type: 'sound', image: '🎵', description: 'Synthwave sound effects' }
      ],
      powerUps: [
        { id: 'tetris_power_slowdown', name: 'Time Slow', price: 50, type: 'consumable', image: '⏱️', description: 'Slow down block falling for 30 seconds', uses: 3 },
        { id: 'tetris_power_bomb', name: 'Block Bomb', price: 75, type: 'consumable', image: '💣', description: 'Clear a 3x3 area instantly', uses: 2 },
        { id: 'tetris_power_swap', name: 'Piece Swap', price: 40, type: 'consumable', image: '🔄', description: 'Swap current piece with next piece', uses: 5 }
      ]
    },
    flappyBird: {
      cosmetics: [
        { id: 'flappy_skin_robot', name: 'Robot Bird', price: 250, type: 'skin', image: '🤖', description: 'Mechanical bird skin' },
        { id: 'flappy_skin_dragon', name: 'Dragon', price: 300, type: 'skin', image: '🐉', description: 'Fire-breathing dragon skin' },
        { id: 'flappy_bg_night', name: 'Night Sky', price: 150, type: 'background', image: '🌃', description: 'Starry night background' },
        { id: 'flappy_bg_city', name: 'City Skyline', price: 180, type: 'background', image: '🏙️', description: 'Urban city background' }
      ],
      powerUps: [
        { id: 'flappy_power_shield', name: 'Shield', price: 60, type: 'consumable', image: '🛡️', description: 'Survive one pipe collision', uses: 3 },
        { id: 'flappy_power_magnet', name: 'Coin Magnet', price: 80, type: 'consumable', image: '🧲', description: 'Attract coins for 20 seconds', uses: 2 },
        { id: 'flappy_power_ghost', name: 'Ghost Mode', price: 100, type: 'consumable', image: '👻', description: 'Pass through pipes for 5 seconds', uses: 1 }
      ]
    },
    pacMan: {
      cosmetics: [
        { id: 'pacman_skin_ninja', name: 'Ninja Pac', price: 220, type: 'skin', image: '🥷', description: 'Stealthy ninja skin' },
        { id: 'pacman_skin_alien', name: 'Alien Pac', price: 280, type: 'skin', image: '👽', description: 'Extraterrestrial skin' },
        { id: 'pacman_ghost_neon', name: 'Neon Ghosts', price: 200, type: 'ghost', image: '👻', description: 'Bright neon ghost skins' },
        { id: 'pacman_maze_space', name: 'Space Maze', price: 180, type: 'maze', image: '🌌', description: 'Cosmic maze design' }
      ],
      powerUps: [
        { id: 'pacman_power_freeze', name: 'Ghost Freeze', price: 70, type: 'consumable', image: '❄️', description: 'Freeze ghosts for 5 seconds', uses: 3 },
        { id: 'pacman_power_vacuum', name: 'Dot Vacuum', price: 90, type: 'consumable', image: '🌪️', description: 'Collect nearby dots automatically', uses: 2 },
        { id: 'pacman_power_invisibility', name: 'Invisibility', price: 110, type: 'consumable', image: '🔍', description: 'Become invisible to ghosts for 10 seconds', uses: 1 }
      ]
    },
    pong: {
      cosmetics: [
        { id: 'pong_paddle_fire', name: 'Fire Paddle', price: 180, type: 'paddle', image: '🔥', description: 'Flaming paddle effect' },
        { id: 'pong_paddle_ice', name: 'Ice Paddle', price: 180, type: 'paddle', image: '❄️', description: 'Frozen paddle effect' },
        { id: 'pong_ball_rainbow', name: 'Rainbow Ball', price: 150, type: 'ball', image: '🌈', description: 'Color-changing ball' },
        { id: 'pong_bg_space', name: 'Space Background', price: 120, type: 'background', image: '🌠', description: 'Cosmic background with stars' }
      ],
      powerUps: [
        { id: 'pong_power_enlarge', name: 'Paddle Extend', price: 50, type: 'consumable', image: '📏', description: 'Temporarily enlarge your paddle', uses: 3 },
        { id: 'pong_power_slow', name: 'Ball Slow', price: 60, type: 'consumable', image: '🐢', description: 'Slow down the ball for 15 seconds', uses: 3 },
        { id: 'pong_power_multi', name: 'Multi-Ball', price: 80, type: 'consumable', image: '🎱', description: 'Split the ball into three', uses: 2 }
      ]
    },
    breakout: {
      cosmetics: [
        { id: 'breakout_paddle_metal', name: 'Metal Paddle', price: 200, type: 'paddle', image: '🔧', description: 'Metallic paddle design' },
        { id: 'breakout_paddle_wood', name: 'Wooden Paddle', price: 150, type: 'paddle', image: '🪵', description: 'Classic wooden paddle' },
        { id: 'breakout_brick_crystal', name: 'Crystal Bricks', price: 220, type: 'brick', image: '💎', description: 'Shimmering crystal bricks' },
        { id: 'breakout_ball_flame', name: 'Flame Ball', price: 180, type: 'ball', image: '🔥', description: 'Ball with fire effect' }
      ],
      powerUps: [
        { id: 'breakout_power_multi', name: 'Multi-Ball', price: 70, type: 'consumable', image: '🎱', description: 'Split into multiple balls', uses: 2 },
        { id: 'breakout_power_laser', name: 'Laser Paddle', price: 90, type: 'consumable', image: '🔫', description: 'Shoot lasers to break bricks', uses: 2 },
        { id: 'breakout_power_sticky', name: 'Sticky Paddle', price: 60, type: 'consumable', image: '🍯', description: 'Ball sticks to paddle for controlled launch', uses: 3 }
      ]
    }
  };
  
  // Get items for current game and tab
  const getItems = () => {
    if (!gameId || !storeItems[gameId]) return [];
    return storeItems[gameId][activeTab] || [];
  };
  
  // Check if item is owned
  const isItemOwned = (itemId) => {
    return ownedItems.includes(itemId);
  };
  
  // Handle item selection
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setShowConfirmation(true);
  };
  
  // Handle purchase confirmation
  const handleConfirmPurchase = () => {
    if (selectedItem && onPurchase) {
      onPurchase(selectedItem);
    }
    setShowConfirmation(false);
    setSelectedItem(null);
  };
  
  // Render store items
  const renderItems = () => {
    const items = getItems();
    
    if (items.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No items available for this game.</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map(item => {
          const owned = isItemOwned(item.id);
          
          return (
            <div 
              key={item.id}
              className={`
                border rounded-lg p-4 transition-all
                ${owned ? 'bg-green-50 border-green-300' : 'border-gray-200 hover:border-blue-300'}
              `}
            >
              <div className="flex items-center mb-2">
                <div className="text-3xl mr-3">{item.image}</div>
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-xs text-gray-500">{item.type}</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              
              {item.uses && (
                <p className="text-xs text-gray-500 mb-3">Uses: {item.uses}x</p>
              )}
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1">⭐</span>
                  <span className="font-bold">{item.price}</span>
                </div>
                
                {owned ? (
                  <span className="text-green-600 text-sm font-medium">Owned</span>
                ) : (
                  <button
                    onClick={() => handleSelectItem(item)}
                    disabled={playerBalance < item.price}
                    className={`
                      py-1 px-3 rounded-md text-sm
                      ${playerBalance >= item.price
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                    `}
                  >
                    {playerBalance >= item.price ? 'Buy' : 'Not enough stars'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  // Render purchase confirmation
  const renderConfirmation = () => {
    if (!selectedItem) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-xl font-bold mb-4">Confirm Purchase</h3>
          
          <div className="flex items-center mb-4">
            <div className="text-4xl mr-4">{selectedItem.image}</div>
            <div>
              <h4 className="font-bold">{selectedItem.name}</h4>
              <p className="text-sm text-gray-600">{selectedItem.description}</p>
            </div>
          </div>
          
          <div className="bg-gray-100 p-3 rounded-md mb-4">
            <div className="flex justify-between">
              <span>Price:</span>
              <span className="font-bold">{selectedItem.price} ⭐</span>
            </div>
            <div className="flex justify-between">
              <span>Your balance:</span>
              <span className="font-bold">{playerBalance} ⭐</span>
            </div>
            <div className="flex justify-between border-t border-gray-300 mt-2 pt-2">
              <span>New balance:</span>
              <span className="font-bold">{playerBalance - selectedItem.price} ⭐</span>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowConfirmation(false)}
              className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmPurchase}
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Confirm Purchase
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <>
      <GameModal
        isOpen={isOpen}
        onClose={onClose}
        title="In-Game Store"
        size="lg"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('cosmetics')}
              className={`py-2 px-4 rounded-md ${
                activeTab === 'cosmetics'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              Cosmetics
            </button>
            <button
              onClick={() => setActiveTab('powerUps')}
              className={`py-2 px-4 rounded-md ${
                activeTab === 'powerUps'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              Power-Ups
            </button>
          </div>
          
          <div className="flex items-center bg-yellow-100 py-1 px-3 rounded-full">
            <span className="text-yellow-500 mr-1">⭐</span>
            <span className="font-bold">{playerBalance}</span>
          </div>
        </div>
        
        {renderItems()}
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Earn stars by completing challenges and achievements!
          </p>
          <button
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
            onClick={() => {/* Open challenges modal */}}
          >
            View Available Challenges
          </button>
        </div>
      </GameModal>
      
      {showConfirmation && renderConfirmation()}
    </>
  );
}

export default InGameStore;
