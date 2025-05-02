/**
 * Firebase Leaderboard Utility
 * Handles storing and retrieving high scores from Firebase
 */

import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, where, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

/**
 * Get the global leaderboard for a specific game
 * @param {string} gameId - Unique identifier for the game
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum number of entries to return (default: 10)
 * @param {string} options.timeFrame - Time frame for leaderboard (all, weekly, monthly)
 * @returns {Promise<Array>} - Promise that resolves with an array of leaderboard entries
 */
export const getGlobalLeaderboard = async (gameId, options = {}) => {
  try {
    const db = getFirestore();
    const leaderboardRef = collection(db, 'leaderboards');
    
    // Build query
    let q = query(
      leaderboardRef,
      where('gameId', '==', gameId)
    );
    
    // Apply time frame filter
    if (options.timeFrame === 'weekly') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      q = query(q, where('timestamp', '>=', weekAgo));
    } else if (options.timeFrame === 'monthly') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      q = query(q, where('timestamp', '>=', monthAgo));
    }
    
    // Add ordering and limit
    q = query(
      q,
      orderBy('score', 'desc'),
      limit(options.limit || 10)
    );
    
    const querySnapshot = await getDocs(q);
    const leaderboard = [];
    
    querySnapshot.forEach(doc => {
      leaderboard.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
      });
    });
    
    return leaderboard;
  } catch (error) {
    console.error('Error getting global leaderboard:', error);
    throw error;
  }
};

/**
 * Get the user's personal best scores
 * @param {string} gameId - Unique identifier for the game (optional, if not provided returns for all games)
 * @param {number} limit - Maximum number of entries to return (default: 10)
 * @returns {Promise<Array>} - Promise that resolves with an array of leaderboard entries
 */
export const getUserBestScores = async (gameId = null, limit = 10) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User must be logged in to get personal best scores');
    }
    
    const db = getFirestore();
    const leaderboardRef = collection(db, 'leaderboards');
    
    // Build query
    let q = query(
      leaderboardRef,
      where('userId', '==', user.uid)
    );
    
    // Filter by game if provided
    if (gameId) {
      q = query(q, where('gameId', '==', gameId));
    }
    
    // Add ordering and limit
    q = query(
      q,
      orderBy('score', 'desc'),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    const scores = [];
    
    querySnapshot.forEach(doc => {
      scores.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
      });
    });
    
    return scores;
  } catch (error) {
    console.error('Error getting user best scores:', error);
    throw error;
  }
};

/**
 * Add a new score to the global leaderboard
 * @param {string} gameId - Unique identifier for the game
 * @param {Object} entry - Leaderboard entry
 * @param {number} entry.score - Score achieved
 * @param {number} entry.level - Level reached
 * @param {Object} entry.gameState - Additional game state information
 * @returns {Promise<string>} - Promise that resolves with the ID of the new leaderboard entry
 */
export const addToGlobalLeaderboard = async (gameId, entry) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User must be logged in to add to global leaderboard');
    }
    
    const db = getFirestore();
    const leaderboardRef = collection(db, 'leaderboards');
    
    const leaderboardEntry = {
      gameId,
      userId: user.uid,
      playerName: user.displayName || 'Anonymous',
      score: entry.score,
      level: entry.level || 1,
      gameState: entry.gameState || {},
      timestamp: serverTimestamp()
    };
    
    const docRef = await addDoc(leaderboardRef, leaderboardEntry);
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding to global leaderboard:', error);
    throw error;
  }
};

/**
 * Get the user's rank on the global leaderboard
 * @param {string} gameId - Unique identifier for the game
 * @param {number} score - Score to check
 * @returns {Promise<number>} - Promise that resolves with the user's rank (1-based, 0 if not on leaderboard)
 */
export const getUserRank = async (gameId, score) => {
  try {
    const db = getFirestore();
    const leaderboardRef = collection(db, 'leaderboards');
    
    // Get all scores higher than the user's score
    const q = query(
      leaderboardRef,
      where('gameId', '==', gameId),
      where('score', '>', score)
    );
    
    const querySnapshot = await getDocs(q);
    
    // User's rank is the number of higher scores + 1
    return querySnapshot.size + 1;
  } catch (error) {
    console.error('Error getting user rank:', error);
    throw error;
  }
};

/**
 * Get the weekly leaderboard for a specific game
 * @param {string} gameId - Unique identifier for the game
 * @param {number} limit - Maximum number of entries to return (default: 10)
 * @returns {Promise<Array>} - Promise that resolves with an array of leaderboard entries
 */
export const getWeeklyLeaderboard = async (gameId, limit = 10) => {
  return getGlobalLeaderboard(gameId, { limit, timeFrame: 'weekly' });
};

/**
 * Get the monthly leaderboard for a specific game
 * @param {string} gameId - Unique identifier for the game
 * @param {number} limit - Maximum number of entries to return (default: 10)
 * @returns {Promise<Array>} - Promise that resolves with an array of leaderboard entries
 */
export const getMonthlyLeaderboard = async (gameId, limit = 10) => {
  return getGlobalLeaderboard(gameId, { limit, timeFrame: 'monthly' });
};

/**
 * Check if a score qualifies for the global leaderboard
 * @param {string} gameId - Unique identifier for the game
 * @param {number} score - Score to check
 * @returns {Promise<boolean>} - Promise that resolves with true if the score qualifies
 */
export const qualifiesForGlobalLeaderboard = async (gameId, score) => {
  try {
    const db = getFirestore();
    const leaderboardRef = collection(db, 'leaderboards');
    
    // Get the lowest score on the leaderboard
    const q = query(
      leaderboardRef,
      where('gameId', '==', gameId),
      orderBy('score', 'asc'),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    // If leaderboard has less than 10 entries, any score qualifies
    if (querySnapshot.empty) {
      return true;
    }
    
    // Check if score is higher than the lowest score
    const lowestScore = querySnapshot.docs[0].data().score;
    return score > lowestScore;
  } catch (error) {
    console.error('Error checking if score qualifies for global leaderboard:', error);
    throw error;
  }
};
