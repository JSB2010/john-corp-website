import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkAchievements } from '../utils/achievements';
import { addToLeaderboard, qualifiesForLeaderboard } from '../utils/leaderboard';

// Create context
const GameContext = createContext();

/**
 * Game Context Provider
 * Provides game state and functions to all child components
 */
export function GameProvider({ children }) {
  // Player state
  const [playerName, setPlayerName] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  
  // Game state
  const [currentGame, setCurrentGame] = useState(null);
  const [gameSettings, setGameSettings] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newAchievements, setNewAchievements] = useState([]);
  
  // Load player data from localStorage
  useEffect(() => {
    const savedPlayerName = localStorage.getItem('playerName');
    if (savedPlayerName) {
      setPlayerName(savedPlayerName);
    }
    
    // Load premium status
    const premiumGames = JSON.parse(localStorage.getItem('premiumFeatures') || '{}');
    setIsPremium(premiumGames);
  }, []);
  
  // Save player name to localStorage
  const savePlayerName = (name) => {
    localStorage.setItem('playerName', name);
    setPlayerName(name);
  };
  
  // Add notification
  const addNotification = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const notification = { id, message, type, duration };
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  };
  
  // Remove notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // Start game
  const startGame = (gameId, settings = {}) => {
    setCurrentGame(gameId);
    setGameSettings(settings);
    
    // Load game-specific settings
    const savedSettings = localStorage.getItem(`${gameId}-settings`);
    if (savedSettings) {
      try {
        setGameSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading game settings:', error);
      }
    }
  };
  
  // End game and save score
  const endGame = (gameState) => {
    if (!currentGame || !playerName) return;
    
    const { score, level } = gameState;
    
    // Check for new achievements
    const newlyUnlocked = checkAchievements(currentGame, playerName, gameState);
    
    // Show achievement notifications
    if (newlyUnlocked.length > 0) {
      setNewAchievements(newlyUnlocked);
      
      // Add notification for each achievement
      newlyUnlocked.forEach(achievement => {
        addNotification(`Achievement Unlocked: ${achievement.title}`, 'success', 5000);
      });
    }
    
    // Check if score qualifies for leaderboard
    if (qualifiesForLeaderboard(currentGame, score)) {
      // Add to leaderboard
      const entry = {
        playerName,
        score,
        level,
        date: new Date().toISOString()
      };
      
      const added = addToLeaderboard(currentGame, entry);
      
      if (added) {
        addNotification('New high score!', 'success', 5000);
      }
    }
  };
  
  // Toggle premium status for a game
  const togglePremium = (gameId, status) => {
    const premiumGames = JSON.parse(localStorage.getItem('premiumFeatures') || '{}');
    premiumGames[gameId] = status;
    localStorage.setItem('premiumFeatures', JSON.stringify(premiumGames));
    setIsPremium(premiumGames);
  };
  
  // Context value
  const value = {
    // Player
    playerName,
    setPlayerName: savePlayerName,
    isPremium,
    
    // Game
    currentGame,
    gameSettings,
    startGame,
    endGame,
    togglePremium,
    
    // UI
    notifications,
    addNotification,
    removeNotification,
    showLeaderboard,
    setShowLeaderboard,
    showAchievements,
    setShowAchievements,
    showSettings,
    setShowSettings,
    newAchievements,
    setNewAchievements
  };
  
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

// Custom hook for using the game context
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export default GameContext;
