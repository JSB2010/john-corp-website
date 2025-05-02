import React from 'react';

/**
 * Game Stats Component
 * Displays game statistics in a clean, organized format
 */
function GameStats({ stats, title = 'Game Stats' }) {
  return (
    <div className="game-stats bg-white rounded-lg shadow-md p-4 w-full">
      <h3 className="text-xl font-bold mb-4 text-center border-b pb-2">
        {title}
      </h3>

      <div className="grid grid-cols-1 gap-3">
        {Object.entries(stats).map(([key, value]) => {
          // Skip null or undefined values
          if (value === null || value === undefined) return null;
          
          // Format the key for display
          const formattedKey = key
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
          
          return (
            <div key={key} className="stat-item flex justify-between items-center">
              <span className="text-gray-600">{formattedKey}:</span>
              
              {typeof value === 'boolean' ? (
                <span className={`font-medium ${value ? 'text-green-600' : 'text-red-600'}`}>
                  {value ? 'Yes' : 'No'}
                </span>
              ) : (
                <span className="font-medium text-gray-900">
                  {typeof value === 'number' && !Number.isInteger(value) 
                    ? value.toFixed(2) 
                    : value.toString()}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GameStats;
