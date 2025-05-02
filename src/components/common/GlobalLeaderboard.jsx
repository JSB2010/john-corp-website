import React, { useState, useEffect } from 'react';
import { getGlobalLeaderboard, getWeeklyLeaderboard, getMonthlyLeaderboard } from '../../utils/firebaseLeaderboard';
import { getAuth } from 'firebase/auth';

/**
 * Global Leaderboard Component
 * Displays high scores from Firebase for a specific game
 */
function GlobalLeaderboard({ gameId, title, maxEntries = 10 }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFrame, setTimeFrame] = useState('all'); // all, weekly, monthly
  const [currentUserId, setCurrentUserId] = useState(null);
  
  useEffect(() => {
    // Get current user ID
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setCurrentUserId(user.uid);
    }
    
    // Load leaderboard data
    loadLeaderboard();
  }, [gameId, maxEntries, timeFrame]);
  
  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      
      switch (timeFrame) {
        case 'weekly':
          data = await getWeeklyLeaderboard(gameId, maxEntries);
          break;
        case 'monthly':
          data = await getMonthlyLeaderboard(gameId, maxEntries);
          break;
        default:
          data = await getGlobalLeaderboard(gameId, { limit: maxEntries });
          break;
      }
      
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setError('Failed to load leaderboard. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Format date string
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return 'Unknown date';
    }
  };
  
  // Handle time frame change
  const handleTimeFrameChange = (newTimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

  return (
    <div className="global-leaderboard bg-white rounded-lg shadow-md p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">
          {title || 'Global Leaderboard'}
        </h3>
        
        <div className="flex space-x-2">
          <button
            onClick={() => handleTimeFrameChange('all')}
            className={`px-3 py-1 text-sm rounded-full ${
              timeFrame === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => handleTimeFrameChange('monthly')}
            className={`px-3 py-1 text-sm rounded-full ${
              timeFrame === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => handleTimeFrameChange('weekly')}
            className={`px-3 py-1 text-sm rounded-full ${
              timeFrame === 'weekly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No scores yet. Be the first to set a high score!
        </div>
      ) : (
        <div className="overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Rank
                </th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Player
                </th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Score
                </th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Level
                </th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr 
                  key={entry.id}
                  className={`
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    ${entry.userId === currentUserId ? 'bg-blue-50' : ''}
                  `}
                >
                  <td className="py-2 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`
                        ${index === 0 ? 'text-yellow-500' : ''}
                        ${index === 1 ? 'text-gray-400' : ''}
                        ${index === 2 ? 'text-yellow-700' : ''}
                        font-bold
                      `}>
                        {index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {entry.playerName}
                      {entry.userId === currentUserId && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-bold">
                      {entry.score.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {entry.level}
                    </div>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(entry.timestamp)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <button
          onClick={loadLeaderboard}
          className="text-blue-600 hover:text-blue-800 text-sm"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh Leaderboard'}
        </button>
      </div>
    </div>
  );
}

export default GlobalLeaderboard;
