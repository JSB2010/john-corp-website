import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../../utils/leaderboard';
import { getGlobalLeaderboard, getWeeklyLeaderboard, getMonthlyLeaderboard } from '../../utils/firebaseLeaderboard';
import { getAuth } from 'firebase/auth';

/**
 * Leaderboard Component
 * Displays high scores for a specific game
 */
function Leaderboard({ gameId, title, maxEntries = 10, useFirebase = false, timeFrame = 'all' }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Get current user ID if using Firebase
    if (useFirebase) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        setCurrentUserId(user.uid);
      }
    }

    // Load leaderboard data
    loadLeaderboard();
  }, [gameId, maxEntries, useFirebase, timeFrame]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      if (useFirebase) {
        // Load from Firebase
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
      } else {
        // Load from localStorage
        const data = getLeaderboard(gameId);
        setLeaderboard(data.slice(0, maxEntries));
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setError('Failed to load leaderboard. Please try again later.');

      // Fallback to localStorage if Firebase fails
      if (useFirebase) {
        const data = getLeaderboard(gameId);
        setLeaderboard(data.slice(0, maxEntries));
      }
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

  return (
    <div className="leaderboard bg-white rounded-lg shadow-md p-4 w-full">
      <h3 className="text-xl font-bold mb-4 text-center border-b pb-2">
        {title || 'Leaderboard'}
      </h3>

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
                  key={`${entry.playerName}-${entry.score}-${index}`}
                  className={`
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    ${useFirebase && entry.userId === currentUserId ? 'bg-blue-50' : ''}
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
                      {useFirebase && entry.userId === currentUserId && (
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
                      {formatDate(useFirebase ? entry.timestamp : entry.date)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {useFirebase && (
        <div className="mt-4 text-center">
          <button
            onClick={loadLeaderboard}
            className="text-blue-600 hover:text-blue-800 text-sm"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh Leaderboard'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
