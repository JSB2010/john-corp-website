/**
 * Leaderboard Utility
 * Handles storing and retrieving high scores
 */

// Maximum number of entries to store in leaderboard
const MAX_LEADERBOARD_ENTRIES = 10;

/**
 * Get the leaderboard for a specific game
 * @param {string} gameId - Unique identifier for the game
 * @returns {Array} - Array of leaderboard entries sorted by score (highest first)
 */
export const getLeaderboard = (gameId) => {
  try {
    const leaderboardData = localStorage.getItem(`${gameId}-leaderboard`);
    return leaderboardData ? JSON.parse(leaderboardData) : [];
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
};

/**
 * Add a new score to the leaderboard
 * @param {string} gameId - Unique identifier for the game
 * @param {Object} entry - Leaderboard entry
 * @param {string} entry.playerName - Name of the player
 * @param {number} entry.score - Score achieved
 * @param {number} entry.level - Level reached
 * @param {Date} entry.date - Date when the score was achieved
 * @returns {boolean} - True if the score was added to the leaderboard
 */
export const addToLeaderboard = (gameId, entry) => {
  try {
    // Get current leaderboard
    const leaderboard = getLeaderboard(gameId);
    
    // Add new entry
    const newEntry = {
      ...entry,
      date: entry.date || new Date().toISOString()
    };
    
    // Add to leaderboard
    leaderboard.push(newEntry);
    
    // Sort by score (highest first)
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Limit to max entries
    const trimmedLeaderboard = leaderboard.slice(0, MAX_LEADERBOARD_ENTRIES);
    
    // Save to localStorage
    localStorage.setItem(`${gameId}-leaderboard`, JSON.stringify(trimmedLeaderboard));
    
    // Return true if the entry made it to the leaderboard
    return trimmedLeaderboard.some(item => 
      item.playerName === newEntry.playerName && 
      item.score === newEntry.score && 
      item.date === newEntry.date
    );
  } catch (error) {
    console.error('Error adding to leaderboard:', error);
    return false;
  }
};

/**
 * Check if a score qualifies for the leaderboard
 * @param {string} gameId - Unique identifier for the game
 * @param {number} score - Score to check
 * @returns {boolean} - True if the score qualifies for the leaderboard
 */
export const qualifiesForLeaderboard = (gameId, score) => {
  const leaderboard = getLeaderboard(gameId);
  
  // If leaderboard isn't full yet, any score qualifies
  if (leaderboard.length < MAX_LEADERBOARD_ENTRIES) {
    return true;
  }
  
  // Check if score is higher than the lowest score on the leaderboard
  const lowestScore = leaderboard[leaderboard.length - 1].score;
  return score > lowestScore;
};

/**
 * Get the player's highest score
 * @param {string} gameId - Unique identifier for the game
 * @param {string} playerName - Name of the player
 * @returns {number} - Highest score achieved by the player
 */
export const getPlayerHighScore = (gameId, playerName) => {
  const leaderboard = getLeaderboard(gameId);
  const playerEntries = leaderboard.filter(entry => entry.playerName === playerName);
  
  if (playerEntries.length === 0) {
    return 0;
  }
  
  // Get highest score
  return Math.max(...playerEntries.map(entry => entry.score));
};

/**
 * Clear the leaderboard for a specific game
 * @param {string} gameId - Unique identifier for the game
 */
export const clearLeaderboard = (gameId) => {
  localStorage.removeItem(`${gameId}-leaderboard`);
};

/**
 * Get the player's rank on the leaderboard
 * @param {string} gameId - Unique identifier for the game
 * @param {string} playerName - Name of the player
 * @param {number} score - Score to check
 * @returns {number} - Rank of the player (1-based, 0 if not on leaderboard)
 */
export const getPlayerRank = (gameId, playerName, score) => {
  const leaderboard = getLeaderboard(gameId);
  
  for (let i = 0; i < leaderboard.length; i++) {
    if (leaderboard[i].playerName === playerName && leaderboard[i].score === score) {
      return i + 1;
    }
  }
  
  return 0;
};
