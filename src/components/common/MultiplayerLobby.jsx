import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import {
  createMultiplayerSession,
  getAvailableSessions,
  joinMultiplayerSession,
  updatePlayerStatus,
  startMultiplayerGame,
  setupLocalMultiplayer
} from '../../utils/multiplayer';

/**
 * Multiplayer Lobby Component
 * Allows users to create or join multiplayer games
 */
function MultiplayerLobby({ 
  gameId, 
  onStartGame, 
  onCancel,
  supportedModes = ['classic'],
  supportedDifficulties = ['normal']
}) {
  const [tab, setTab] = useState('online'); // online, local
  const [availableSessions, setAvailableSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  
  // Form state for creating a session
  const [createSessionForm, setCreateSessionForm] = useState({
    mode: supportedModes[0],
    difficulty: supportedDifficulties[0],
    maxPlayers: 2,
    isPrivate: false
  });
  
  // Form state for local multiplayer
  const [localMultiplayerForm, setLocalMultiplayerForm] = useState({
    numPlayers: 2,
    mode: supportedModes[0],
    difficulty: supportedDifficulties[0],
    turnBased: false
  });
  
  // Get current user
  const auth = getAuth();
  const user = auth.currentUser;
  
  // Load available sessions
  useEffect(() => {
    if (tab === 'online') {
      loadAvailableSessions();
    }
  }, [tab]);
  
  // Load available sessions
  const loadAvailableSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const sessions = await getAvailableSessions(gameId);
      setAvailableSessions(sessions);
    } catch (error) {
      console.error('Error loading available sessions:', error);
      setError('Failed to load available sessions. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Create a new session
  const handleCreateSession = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const session = await createMultiplayerSession(gameId, createSessionForm);
      setCurrentSession(session);
    } catch (error) {
      console.error('Error creating session:', error);
      setError('Failed to create session. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Join an existing session
  const handleJoinSession = async (sessionId) => {
    try {
      setLoading(true);
      setError(null);
      
      const session = await joinMultiplayerSession(sessionId);
      setCurrentSession(session);
    } catch (error) {
      console.error('Error joining session:', error);
      setError('Failed to join session. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Update player ready status
  const handleToggleReady = async () => {
    if (!currentSession) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Find current player
      const currentPlayer = currentSession.players.find(player => player.id === user.uid);
      if (!currentPlayer) return;
      
      // Toggle ready status
      const updatedSession = await updatePlayerStatus(currentSession.id, !currentPlayer.isReady);
      setCurrentSession(updatedSession);
    } catch (error) {
      console.error('Error updating ready status:', error);
      setError('Failed to update ready status. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Start the game
  const handleStartGame = async () => {
    if (!currentSession) return;
    
    try {
      setLoading(true);
      setError(null);
      
      if (currentSession.isLocal) {
        // Start local multiplayer game
        onStartGame(currentSession);
      } else {
        // Start online multiplayer game
        const updatedSession = await startMultiplayerGame(currentSession.id);
        onStartGame(updatedSession);
      }
    } catch (error) {
      console.error('Error starting game:', error);
      setError('Failed to start game. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Set up local multiplayer
  const handleSetupLocalMultiplayer = () => {
    try {
      const { numPlayers, mode, difficulty, turnBased } = localMultiplayerForm;
      
      const session = setupLocalMultiplayer(gameId, numPlayers, {
        mode,
        difficulty,
        turnBased
      });
      
      setCurrentSession(session);
    } catch (error) {
      console.error('Error setting up local multiplayer:', error);
      setError('Failed to set up local multiplayer. Please try again.');
    }
  };
  
  // Render session list
  const renderSessionList = () => {
    if (loading && availableSessions.length === 0) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }
    
    if (availableSessions.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No available sessions. Create a new one!
        </div>
      );
    }
    
    return (
      <div className="space-y-4 mt-4">
        {availableSessions.map(session => (
          <div 
            key={session.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold">{session.hostName}'s Game</h4>
                <div className="text-sm text-gray-600">
                  <span className="mr-4">Mode: {session.mode}</span>
                  <span className="mr-4">Difficulty: {session.difficulty}</span>
                  <span>Players: {session.players.length}/{session.maxPlayers}</span>
                </div>
              </div>
              <button
                onClick={() => handleJoinSession(session.id)}
                className="btn bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                disabled={loading}
              >
                Join
              </button>
            </div>
          </div>
        ))}
        
        <div className="text-center mt-4">
          <button
            onClick={loadAvailableSessions}
            className="text-blue-600 hover:text-blue-800"
            disabled={loading}
          >
            Refresh List
          </button>
        </div>
      </div>
    );
  };
  
  // Render create session form
  const renderCreateSessionForm = () => {
    return (
      <div className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Game Mode
          </label>
          <select
            value={createSessionForm.mode}
            onChange={(e) => setCreateSessionForm(prev => ({ ...prev, mode: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {supportedModes.map(mode => (
              <option key={mode} value={mode}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty
          </label>
          <select
            value={createSessionForm.difficulty}
            onChange={(e) => setCreateSessionForm(prev => ({ ...prev, difficulty: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {supportedDifficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Players
          </label>
          <select
            value={createSessionForm.maxPlayers}
            onChange={(e) => setCreateSessionForm(prev => ({ ...prev, maxPlayers: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={2}>2 Players</option>
            <option value={3}>3 Players</option>
            <option value={4}>4 Players</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPrivate"
            checked={createSessionForm.isPrivate}
            onChange={(e) => setCreateSessionForm(prev => ({ ...prev, isPrivate: e.target.checked }))}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-700">
            Private Session (Invite Only)
          </label>
        </div>
        
        <div className="pt-4">
          <button
            onClick={handleCreateSession}
            className="w-full btn bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
            disabled={loading}
          >
            Create Session
          </button>
        </div>
      </div>
    );
  };
  
  // Render local multiplayer form
  const renderLocalMultiplayerForm = () => {
    return (
      <div className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Players
          </label>
          <select
            value={localMultiplayerForm.numPlayers}
            onChange={(e) => setLocalMultiplayerForm(prev => ({ ...prev, numPlayers: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={2}>2 Players</option>
            <option value={3}>3 Players</option>
            <option value={4}>4 Players</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Game Mode
          </label>
          <select
            value={localMultiplayerForm.mode}
            onChange={(e) => setLocalMultiplayerForm(prev => ({ ...prev, mode: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {supportedModes.map(mode => (
              <option key={mode} value={mode}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty
          </label>
          <select
            value={localMultiplayerForm.difficulty}
            onChange={(e) => setLocalMultiplayerForm(prev => ({ ...prev, difficulty: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {supportedDifficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="turnBased"
            checked={localMultiplayerForm.turnBased}
            onChange={(e) => setLocalMultiplayerForm(prev => ({ ...prev, turnBased: e.target.checked }))}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="turnBased" className="ml-2 block text-sm text-gray-700">
            Turn-Based Mode
          </label>
        </div>
        
        <div className="pt-4">
          <button
            onClick={handleSetupLocalMultiplayer}
            className="w-full btn bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            Start Local Multiplayer
          </button>
        </div>
      </div>
    );
  };
  
  // Render session lobby
  const renderSessionLobby = () => {
    if (!currentSession) return null;
    
    const isHost = currentSession.isLocal || (user && currentSession.hostId === user.uid);
    const allPlayersReady = currentSession.players.every(player => player.isReady || player.isLocal);
    const currentPlayer = currentSession.players.find(player => player.id === user?.uid);
    
    return (
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Game Settings</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Mode:</div>
            <div className="font-medium">{currentSession.mode}</div>
            
            <div>Difficulty:</div>
            <div className="font-medium">{currentSession.difficulty}</div>
            
            {currentSession.isLocal ? (
              <>
                <div>Type:</div>
                <div className="font-medium">Local Multiplayer</div>
                
                <div>Turn-Based:</div>
                <div className="font-medium">{currentSession.turnBased ? 'Yes' : 'No'}</div>
              </>
            ) : (
              <>
                <div>Host:</div>
                <div className="font-medium">{currentSession.hostName}</div>
                
                <div>Private:</div>
                <div className="font-medium">{currentSession.isPrivate ? 'Yes' : 'No'}</div>
              </>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="font-bold text-lg mb-2">Players</h3>
          <div className="space-y-2">
            {currentSession.players.map((player, index) => (
              <div 
                key={player.id}
                className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">{player.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <div className="font-medium">{player.name}</div>
                    <div className="text-xs text-gray-500">
                      {player.isHost && 'Host • '}
                      {player.isLocal ? `Player ${index + 1}` : (player.isReady ? 'Ready' : 'Not Ready')}
                    </div>
                  </div>
                </div>
                
                {player.id === user?.uid && !player.isLocal && (
                  <button
                    onClick={handleToggleReady}
                    className={`px-3 py-1 rounded-full text-sm ${
                      player.isReady 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                    disabled={loading}
                  >
                    {player.isReady ? 'Ready' : 'Not Ready'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <button
            onClick={onCancel}
            className="btn bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
          >
            Cancel
          </button>
          
          {isHost && (
            <button
              onClick={handleStartGame}
              className="btn bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
              disabled={loading || (!currentSession.isLocal && !allPlayersReady)}
            >
              Start Game
            </button>
          )}
          
          {!isHost && currentPlayer && (
            <div className="text-sm text-gray-600 italic pt-2">
              Waiting for host to start the game...
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Main render
  if (currentSession) {
    return renderSessionLobby();
  }
  
  return (
    <div className="multiplayer-lobby">
      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 font-medium ${
            tab === 'online' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setTab('online')}
        >
          Online Multiplayer
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            tab === 'local' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setTab('local')}
        >
          Local Multiplayer
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            tab === 'create' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setTab('create')}
        >
          Create Game
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {tab === 'online' && renderSessionList()}
      {tab === 'create' && renderCreateSessionForm()}
      {tab === 'local' && renderLocalMultiplayerForm()}
      
      <div className="mt-6 text-center">
        <button
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default MultiplayerLobby;
