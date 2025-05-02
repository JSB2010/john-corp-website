import React, { useState, useEffect } from 'react';
import { getAchievements, getUnlockedAchievements, getAchievementProgress } from '../../utils/achievements';

/**
 * Achievements Component
 * Displays achievements for a specific game
 */
function Achievements({ gameId, playerName, gameState = {}, showProgress = true }) {
  const [achievements, setAchievements] = useState([]);
  const [unlockedIds, setUnlockedIds] = useState([]);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    // Load achievements data
    const achievementsList = getAchievements(gameId);
    const unlocked = getUnlockedAchievements(gameId, playerName);
    const progressData = showProgress ? getAchievementProgress(gameId, playerName, gameState) : {};
    
    setAchievements(achievementsList);
    setUnlockedIds(unlocked);
    setProgress(progressData);
  }, [gameId, playerName, gameState, showProgress]);

  return (
    <div className="achievements bg-white rounded-lg shadow-md p-4 w-full">
      <h3 className="text-xl font-bold mb-4 text-center border-b pb-2">
        Achievements
      </h3>

      {achievements.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No achievements available for this game.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {achievements.map((achievement) => {
            const isUnlocked = unlockedIds.includes(achievement.id);
            const currentProgress = progress[achievement.id] || 0;
            
            return (
              <div 
                key={achievement.id}
                className={`
                  achievement p-3 rounded-lg border
                  ${isUnlocked 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 bg-gray-50'}
                `}
              >
                <div className="flex items-center">
                  <div className="achievement-icon text-2xl mr-3">
                    {achievement.icon}
                  </div>
                  <div className="achievement-details flex-1">
                    <h4 className={`font-bold ${isUnlocked ? 'text-green-700' : 'text-gray-700'}`}>
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {achievement.description}
                    </p>
                    
                    {showProgress && !isUnlocked && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${currentProgress * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-right mt-1 text-gray-500">
                          {Math.round(currentProgress * 100)}%
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {isUnlocked && (
                    <div className="achievement-status ml-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Unlocked
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Achievements;
