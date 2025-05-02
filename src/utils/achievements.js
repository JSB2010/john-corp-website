/**
 * Achievements Utility
 * Handles tracking and unlocking game achievements
 */

// Achievement definitions for each game
export const ACHIEVEMENTS = {
  tetris: [
    {
      id: 'tetris_beginner',
      title: 'Tetris Beginner',
      description: 'Score 1,000 points in Tetris',
      icon: '🎮',
      requirement: { type: 'score', value: 1000 }
    },
    {
      id: 'tetris_intermediate',
      title: 'Tetris Intermediate',
      description: 'Score 5,000 points in Tetris',
      icon: '🏆',
      requirement: { type: 'score', value: 5000 }
    },
    {
      id: 'tetris_expert',
      title: 'Tetris Expert',
      description: 'Score 10,000 points in Tetris',
      icon: '👑',
      requirement: { type: 'score', value: 10000 }
    },
    {
      id: 'tetris_level5',
      title: 'Level Master',
      description: 'Reach level 5 in Tetris',
      icon: '⭐',
      requirement: { type: 'level', value: 5 }
    },
    {
      id: 'tetris_level10',
      title: 'Level Champion',
      description: 'Reach level 10 in Tetris',
      icon: '🌟',
      requirement: { type: 'level', value: 10 }
    }
  ],
  flappybird: [
    {
      id: 'flappy_beginner',
      title: 'Flappy Beginner',
      description: 'Score 10 points in Flappy Bird',
      icon: '🐦',
      requirement: { type: 'score', value: 10 }
    },
    {
      id: 'flappy_intermediate',
      title: 'Flappy Intermediate',
      description: 'Score 25 points in Flappy Bird',
      icon: '🦅',
      requirement: { type: 'score', value: 25 }
    },
    {
      id: 'flappy_expert',
      title: 'Flappy Expert',
      description: 'Score 50 points in Flappy Bird',
      icon: '🦉',
      requirement: { type: 'score', value: 50 }
    },
    {
      id: 'flappy_invincible',
      title: 'Invincible Bird',
      description: 'Collect 5 power-ups in one game',
      icon: '⚡',
      requirement: { type: 'powerups', value: 5 }
    }
  ],
  pacman: [
    {
      id: 'pacman_beginner',
      title: 'Pac-Man Beginner',
      description: 'Score 1,000 points in Pac-Man',
      icon: '🟡',
      requirement: { type: 'score', value: 1000 }
    },
    {
      id: 'pacman_intermediate',
      title: 'Pac-Man Intermediate',
      description: 'Score 5,000 points in Pac-Man',
      icon: '🏆',
      requirement: { type: 'score', value: 5000 }
    },
    {
      id: 'pacman_expert',
      title: 'Pac-Man Expert',
      description: 'Score 10,000 points in Pac-Man',
      icon: '👑',
      requirement: { type: 'score', value: 10000 }
    },
    {
      id: 'pacman_level3',
      title: 'Level Master',
      description: 'Reach level 3 in Pac-Man',
      icon: '⭐',
      requirement: { type: 'level', value: 3 }
    },
    {
      id: 'pacman_ghost_eater',
      title: 'Ghost Eater',
      description: 'Eat 10 ghosts in one game',
      icon: '👻',
      requirement: { type: 'ghosts', value: 10 }
    }
  ]
};

/**
 * Get all achievements for a specific game
 * @param {string} gameId - Unique identifier for the game
 * @returns {Array} - Array of achievement definitions
 */
export const getAchievements = (gameId) => {
  return ACHIEVEMENTS[gameId] || [];
};

/**
 * Get unlocked achievements for a player
 * @param {string} gameId - Unique identifier for the game
 * @param {string} playerName - Name of the player
 * @returns {Array} - Array of unlocked achievement IDs
 */
export const getUnlockedAchievements = (gameId, playerName) => {
  try {
    const key = `${gameId}-${playerName}-achievements`;
    const achievementsData = localStorage.getItem(key);
    return achievementsData ? JSON.parse(achievementsData) : [];
  } catch (error) {
    console.error('Error getting achievements:', error);
    return [];
  }
};

/**
 * Check if an achievement is unlocked
 * @param {string} gameId - Unique identifier for the game
 * @param {string} playerName - Name of the player
 * @param {string} achievementId - ID of the achievement to check
 * @returns {boolean} - True if the achievement is unlocked
 */
export const isAchievementUnlocked = (gameId, playerName, achievementId) => {
  const unlockedAchievements = getUnlockedAchievements(gameId, playerName);
  return unlockedAchievements.includes(achievementId);
};

/**
 * Unlock an achievement for a player
 * @param {string} gameId - Unique identifier for the game
 * @param {string} playerName - Name of the player
 * @param {string} achievementId - ID of the achievement to unlock
 * @returns {boolean} - True if the achievement was newly unlocked
 */
export const unlockAchievement = (gameId, playerName, achievementId) => {
  try {
    const unlockedAchievements = getUnlockedAchievements(gameId, playerName);
    
    // Check if already unlocked
    if (unlockedAchievements.includes(achievementId)) {
      return false;
    }
    
    // Add to unlocked achievements
    unlockedAchievements.push(achievementId);
    
    // Save to localStorage
    const key = `${gameId}-${playerName}-achievements`;
    localStorage.setItem(key, JSON.stringify(unlockedAchievements));
    
    return true;
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return false;
  }
};

/**
 * Check game state against achievements and unlock any that are earned
 * @param {string} gameId - Unique identifier for the game
 * @param {string} playerName - Name of the player
 * @param {Object} gameState - Current state of the game
 * @returns {Array} - Array of newly unlocked achievement IDs
 */
export const checkAchievements = (gameId, playerName, gameState) => {
  const achievements = getAchievements(gameId);
  const unlockedAchievements = getUnlockedAchievements(gameId, playerName);
  const newlyUnlocked = [];
  
  // Check each achievement
  achievements.forEach(achievement => {
    // Skip if already unlocked
    if (unlockedAchievements.includes(achievement.id)) {
      return;
    }
    
    // Check requirement
    const { type, value } = achievement.requirement;
    let achieved = false;
    
    switch (type) {
      case 'score':
        achieved = gameState.score >= value;
        break;
      case 'level':
        achieved = gameState.level >= value;
        break;
      case 'powerups':
        achieved = gameState.powerupsCollected >= value;
        break;
      case 'ghosts':
        achieved = gameState.ghostsEaten >= value;
        break;
      default:
        break;
    }
    
    // Unlock if achieved
    if (achieved) {
      const wasUnlocked = unlockAchievement(gameId, playerName, achievement.id);
      if (wasUnlocked) {
        newlyUnlocked.push(achievement);
      }
    }
  });
  
  return newlyUnlocked;
};

/**
 * Reset all achievements for a player
 * @param {string} gameId - Unique identifier for the game
 * @param {string} playerName - Name of the player
 */
export const resetAchievements = (gameId, playerName) => {
  const key = `${gameId}-${playerName}-achievements`;
  localStorage.removeItem(key);
};

/**
 * Get achievement progress for a player
 * @param {string} gameId - Unique identifier for the game
 * @param {string} playerName - Name of the player
 * @returns {Object} - Object mapping achievement IDs to progress (0-1)
 */
export const getAchievementProgress = (gameId, playerName, gameState) => {
  const achievements = getAchievements(gameId);
  const progress = {};
  
  // Calculate progress for each achievement
  achievements.forEach(achievement => {
    const { type, value } = achievement.requirement;
    let currentValue = 0;
    
    switch (type) {
      case 'score':
        currentValue = gameState.score || 0;
        break;
      case 'level':
        currentValue = gameState.level || 0;
        break;
      case 'powerups':
        currentValue = gameState.powerupsCollected || 0;
        break;
      case 'ghosts':
        currentValue = gameState.ghostsEaten || 0;
        break;
      default:
        break;
    }
    
    // Calculate progress (0-1)
    progress[achievement.id] = Math.min(1, currentValue / value);
  });
  
  return progress;
};
