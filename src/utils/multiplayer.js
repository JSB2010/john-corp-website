/**
 * Multiplayer Utility
 * Handles local and online multiplayer functionality
 */

import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, where, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Cache for active multiplayer sessions
const activeSessionsCache = {};

/**
 * Create a new multiplayer session
 * @param {string} gameId - Unique identifier for the game
 * @param {Object} options - Session options
 * @param {string} options.mode - Mode of the game (classic, challenge, etc.)
 * @param {string} options.difficulty - Difficulty level (easy, normal, hard)
 * @param {number} options.maxPlayers - Maximum number of players (default: 2)
 * @param {boolean} options.isPrivate - Whether the session is private (default: false)
 * @returns {Promise<Object>} - Promise that resolves with the session data
 */
export const createMultiplayerSession = async (gameId, options = {}) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User must be logged in to create a multiplayer session');
    }
    
    const sessionData = {
      gameId,
      hostId: user.uid,
      hostName: user.displayName || 'Anonymous',
      players: [{
        id: user.uid,
        name: user.displayName || 'Anonymous',
        isHost: true,
        isReady: true,
        score: 0
      }],
      mode: options.mode || 'classic',
      difficulty: options.difficulty || 'normal',
      maxPlayers: options.maxPlayers || 2,
      isPrivate: options.isPrivate || false,
      status: 'waiting', // waiting, playing, completed
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      gameState: {}
    };
    
    const db = getFirestore();
    const sessionsRef = collection(db, 'multiplayer_sessions');
    const docRef = await addDoc(sessionsRef, sessionData);
    
    const session = {
      id: docRef.id,
      ...sessionData
    };
    
    // Cache the session
    activeSessionsCache[session.id] = session;
    
    return session;
  } catch (error) {
    console.error('Error creating multiplayer session:', error);
    throw error;
  }
};

/**
 * Join an existing multiplayer session
 * @param {string} sessionId - ID of the session to join
 * @returns {Promise<Object>} - Promise that resolves with the updated session data
 */
export const joinMultiplayerSession = async (sessionId) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User must be logged in to join a multiplayer session');
    }
    
    const db = getFirestore();
    const sessionRef = doc(db, 'multiplayer_sessions', sessionId);
    const sessionDoc = await getDoc(sessionRef);
    
    if (!sessionDoc.exists()) {
      throw new Error('Session not found');
    }
    
    const sessionData = sessionDoc.data();
    
    // Check if session is full
    if (sessionData.players.length >= sessionData.maxPlayers) {
      throw new Error('Session is full');
    }
    
    // Check if player is already in the session
    const isPlayerInSession = sessionData.players.some(player => player.id === user.uid);
    if (isPlayerInSession) {
      return {
        id: sessionId,
        ...sessionData
      };
    }
    
    // Add player to session
    const updatedPlayers = [
      ...sessionData.players,
      {
        id: user.uid,
        name: user.displayName || 'Anonymous',
        isHost: false,
        isReady: false,
        score: 0
      }
    ];
    
    await updateDoc(sessionRef, {
      players: updatedPlayers,
      updatedAt: serverTimestamp()
    });
    
    const updatedSession = {
      id: sessionId,
      ...sessionData,
      players: updatedPlayers
    };
    
    // Cache the session
    activeSessionsCache[sessionId] = updatedSession;
    
    return updatedSession;
  } catch (error) {
    console.error('Error joining multiplayer session:', error);
    throw error;
  }
};

/**
 * Get available multiplayer sessions
 * @param {string} gameId - Unique identifier for the game
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum number of sessions to return (default: 10)
 * @param {boolean} options.includePrivate - Whether to include private sessions (default: false)
 * @returns {Promise<Array>} - Promise that resolves with an array of session data
 */
export const getAvailableSessions = async (gameId, options = {}) => {
  try {
    const db = getFirestore();
    const sessionsRef = collection(db, 'multiplayer_sessions');
    
    // Build query
    let q = query(
      sessionsRef,
      where('gameId', '==', gameId),
      where('status', '==', 'waiting')
    );
    
    // Filter out private sessions if not requested
    if (!options.includePrivate) {
      q = query(q, where('isPrivate', '==', false));
    }
    
    // Add ordering and limit
    q = query(
      q,
      orderBy('createdAt', 'desc'),
      limit(options.limit || 10)
    );
    
    const querySnapshot = await getDocs(q);
    const sessions = [];
    
    querySnapshot.forEach(doc => {
      sessions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return sessions;
  } catch (error) {
    console.error('Error getting available sessions:', error);
    throw error;
  }
};

/**
 * Update player status in a session
 * @param {string} sessionId - ID of the session
 * @param {boolean} isReady - Whether the player is ready
 * @returns {Promise<Object>} - Promise that resolves with the updated session data
 */
export const updatePlayerStatus = async (sessionId, isReady) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User must be logged in to update player status');
    }
    
    const db = getFirestore();
    const sessionRef = doc(db, 'multiplayer_sessions', sessionId);
    const sessionDoc = await getDoc(sessionRef);
    
    if (!sessionDoc.exists()) {
      throw new Error('Session not found');
    }
    
    const sessionData = sessionDoc.data();
    
    // Update player status
    const updatedPlayers = sessionData.players.map(player => {
      if (player.id === user.uid) {
        return {
          ...player,
          isReady
        };
      }
      return player;
    });
    
    await updateDoc(sessionRef, {
      players: updatedPlayers,
      updatedAt: serverTimestamp()
    });
    
    const updatedSession = {
      id: sessionId,
      ...sessionData,
      players: updatedPlayers
    };
    
    // Cache the session
    activeSessionsCache[sessionId] = updatedSession;
    
    return updatedSession;
  } catch (error) {
    console.error('Error updating player status:', error);
    throw error;
  }
};

/**
 * Start a multiplayer game
 * @param {string} sessionId - ID of the session
 * @returns {Promise<Object>} - Promise that resolves with the updated session data
 */
export const startMultiplayerGame = async (sessionId) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User must be logged in to start a multiplayer game');
    }
    
    const db = getFirestore();
    const sessionRef = doc(db, 'multiplayer_sessions', sessionId);
    const sessionDoc = await getDoc(sessionRef);
    
    if (!sessionDoc.exists()) {
      throw new Error('Session not found');
    }
    
    const sessionData = sessionDoc.data();
    
    // Check if user is the host
    const isHost = sessionData.hostId === user.uid;
    if (!isHost) {
      throw new Error('Only the host can start the game');
    }
    
    // Check if all players are ready
    const allPlayersReady = sessionData.players.every(player => player.isReady);
    if (!allPlayersReady) {
      throw new Error('All players must be ready to start the game');
    }
    
    await updateDoc(sessionRef, {
      status: 'playing',
      updatedAt: serverTimestamp()
    });
    
    const updatedSession = {
      id: sessionId,
      ...sessionData,
      status: 'playing'
    };
    
    // Cache the session
    activeSessionsCache[sessionId] = updatedSession;
    
    return updatedSession;
  } catch (error) {
    console.error('Error starting multiplayer game:', error);
    throw error;
  }
};

/**
 * Update player score in a session
 * @param {string} sessionId - ID of the session
 * @param {number} score - Player's score
 * @returns {Promise<Object>} - Promise that resolves with the updated session data
 */
export const updatePlayerScore = async (sessionId, score) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User must be logged in to update score');
    }
    
    const db = getFirestore();
    const sessionRef = doc(db, 'multiplayer_sessions', sessionId);
    const sessionDoc = await getDoc(sessionRef);
    
    if (!sessionDoc.exists()) {
      throw new Error('Session not found');
    }
    
    const sessionData = sessionDoc.data();
    
    // Update player score
    const updatedPlayers = sessionData.players.map(player => {
      if (player.id === user.uid) {
        return {
          ...player,
          score
        };
      }
      return player;
    });
    
    await updateDoc(sessionRef, {
      players: updatedPlayers,
      updatedAt: serverTimestamp()
    });
    
    const updatedSession = {
      id: sessionId,
      ...sessionData,
      players: updatedPlayers
    };
    
    // Cache the session
    activeSessionsCache[sessionId] = updatedSession;
    
    return updatedSession;
  } catch (error) {
    console.error('Error updating player score:', error);
    throw error;
  }
};

/**
 * End a multiplayer game
 * @param {string} sessionId - ID of the session
 * @returns {Promise<Object>} - Promise that resolves with the updated session data
 */
export const endMultiplayerGame = async (sessionId) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User must be logged in to end a multiplayer game');
    }
    
    const db = getFirestore();
    const sessionRef = doc(db, 'multiplayer_sessions', sessionId);
    const sessionDoc = await getDoc(sessionRef);
    
    if (!sessionDoc.exists()) {
      throw new Error('Session not found');
    }
    
    const sessionData = sessionDoc.data();
    
    // Check if user is the host
    const isHost = sessionData.hostId === user.uid;
    if (!isHost) {
      throw new Error('Only the host can end the game');
    }
    
    await updateDoc(sessionRef, {
      status: 'completed',
      updatedAt: serverTimestamp()
    });
    
    const updatedSession = {
      id: sessionId,
      ...sessionData,
      status: 'completed'
    };
    
    // Remove from cache
    delete activeSessionsCache[sessionId];
    
    return updatedSession;
  } catch (error) {
    console.error('Error ending multiplayer game:', error);
    throw error;
  }
};

/**
 * Leave a multiplayer session
 * @param {string} sessionId - ID of the session
 * @returns {Promise<void>} - Promise that resolves when the player has left the session
 */
export const leaveMultiplayerSession = async (sessionId) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User must be logged in to leave a session');
    }
    
    const db = getFirestore();
    const sessionRef = doc(db, 'multiplayer_sessions', sessionId);
    const sessionDoc = await getDoc(sessionRef);
    
    if (!sessionDoc.exists()) {
      throw new Error('Session not found');
    }
    
    const sessionData = sessionDoc.data();
    
    // Check if user is the host
    const isHost = sessionData.hostId === user.uid;
    
    if (isHost) {
      // If host leaves, end the session
      await updateDoc(sessionRef, {
        status: 'completed',
        updatedAt: serverTimestamp()
      });
    } else {
      // Remove player from session
      const updatedPlayers = sessionData.players.filter(player => player.id !== user.uid);
      
      await updateDoc(sessionRef, {
        players: updatedPlayers,
        updatedAt: serverTimestamp()
      });
    }
    
    // Remove from cache
    delete activeSessionsCache[sessionId];
    
    return;
  } catch (error) {
    console.error('Error leaving multiplayer session:', error);
    throw error;
  }
};

/**
 * Set up local multiplayer
 * @param {string} gameId - Unique identifier for the game
 * @param {number} numPlayers - Number of players (2-4)
 * @param {Object} options - Game options
 * @returns {Object} - Local multiplayer session data
 */
export const setupLocalMultiplayer = (gameId, numPlayers = 2, options = {}) => {
  // Validate number of players
  if (numPlayers < 2 || numPlayers > 4) {
    throw new Error('Number of players must be between 2 and 4');
  }
  
  // Create players array
  const players = Array.from({ length: numPlayers }, (_, i) => ({
    id: `local-player-${i + 1}`,
    name: `Player ${i + 1}`,
    isLocal: true,
    score: 0,
    lives: options.lives || 3
  }));
  
  // Create session data
  const sessionData = {
    id: `local-${gameId}-${Date.now()}`,
    gameId,
    isLocal: true,
    players,
    currentPlayerIndex: 0,
    mode: options.mode || 'classic',
    difficulty: options.difficulty || 'normal',
    turnBased: options.turnBased || false,
    createdAt: new Date().toISOString()
  };
  
  // Cache the session
  activeSessionsCache[sessionData.id] = sessionData;
  
  return sessionData;
};

/**
 * Update local multiplayer state
 * @param {string} sessionId - ID of the local session
 * @param {Object} updates - Updates to apply to the session
 * @returns {Object} - Updated session data
 */
export const updateLocalMultiplayer = (sessionId, updates) => {
  // Get session from cache
  const session = activeSessionsCache[sessionId];
  
  if (!session) {
    throw new Error('Local multiplayer session not found');
  }
  
  // Apply updates
  const updatedSession = {
    ...session,
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  // Cache the updated session
  activeSessionsCache[sessionId] = updatedSession;
  
  return updatedSession;
};

/**
 * End local multiplayer session
 * @param {string} sessionId - ID of the local session
 * @returns {Object} - Final session data
 */
export const endLocalMultiplayer = (sessionId) => {
  // Get session from cache
  const session = activeSessionsCache[sessionId];
  
  if (!session) {
    throw new Error('Local multiplayer session not found');
  }
  
  // Mark as completed
  const finalSession = {
    ...session,
    status: 'completed',
    endedAt: new Date().toISOString()
  };
  
  // Remove from cache
  delete activeSessionsCache[sessionId];
  
  return finalSession;
};

/**
 * Get active multiplayer sessions
 * @returns {Object} - Object mapping session IDs to session data
 */
export const getActiveSessions = () => {
  return { ...activeSessionsCache };
};
