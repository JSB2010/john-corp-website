import React, { useState, useEffect } from 'react';

/**
 * Player Profile Component
 * Allows the user to set their player name and view their profile
 */
function PlayerProfile({ onSave, initialName = '' }) {
  const [playerName, setPlayerName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(!initialName);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load player name from localStorage if not provided
    if (!initialName) {
      const savedName = localStorage.getItem('playerName');
      if (savedName) {
        setPlayerName(savedName);
        setIsEditing(false);
      }
    }
  }, [initialName]);

  const handleSave = () => {
    // Validate player name
    if (!playerName.trim()) {
      setError('Please enter a name');
      return;
    }

    if (playerName.length > 15) {
      setError('Name must be 15 characters or less');
      return;
    }

    // Save player name
    localStorage.setItem('playerName', playerName);
    setIsEditing(false);
    setError('');

    // Call onSave callback
    if (onSave) {
      onSave(playerName);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="player-profile bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-bold mb-4 text-center border-b pb-2">
        Player Profile
      </h3>

      {isEditing ? (
        <div className="flex flex-col">
          <div className="mb-4">
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                ${error ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="Enter your name"
              maxLength={15}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          <button
            onClick={handleSave}
            className="btn bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            Save Profile
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-blue-600">
              {playerName.charAt(0).toUpperCase()}
            </span>
          </div>

          <h4 className="text-lg font-bold mb-4">
            {playerName}
          </h4>

          <button
            onClick={handleEdit}
            className="btn bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded-md text-sm"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}

export default PlayerProfile;
