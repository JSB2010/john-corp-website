import React, { useState, useEffect } from 'react';

/**
 * Game Settings Component
 * Allows users to configure game settings
 */
function GameSettings({ 
  gameId, 
  settings = {}, 
  defaultSettings = {}, 
  onSave,
  onReset
}) {
  const [currentSettings, setCurrentSettings] = useState({ ...defaultSettings, ...settings });

  useEffect(() => {
    // Update settings when props change
    setCurrentSettings({ ...defaultSettings, ...settings });
  }, [settings, defaultSettings]);

  const handleChange = (key, value) => {
    setCurrentSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem(`${gameId}-settings`, JSON.stringify(currentSettings));
    
    // Call onSave callback
    if (onSave) {
      onSave(currentSettings);
    }
  };

  const handleReset = () => {
    // Reset to default settings
    setCurrentSettings({ ...defaultSettings });
    
    // Remove from localStorage
    localStorage.removeItem(`${gameId}-settings`);
    
    // Call onReset callback
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="game-settings bg-white rounded-lg shadow-md p-4 w-full">
      <h3 className="text-xl font-bold mb-4 text-center border-b pb-2">
        Game Settings
      </h3>

      <div className="space-y-4">
        {Object.entries(currentSettings).map(([key, value]) => {
          // Format the key for display
          const formattedKey = key
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
          
          return (
            <div key={key} className="setting-item">
              {typeof value === 'boolean' ? (
                // Boolean toggle
                <div className="flex items-center justify-between">
                  <label htmlFor={key} className="text-sm font-medium text-gray-700">
                    {formattedKey}
                  </label>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id={key}
                      checked={value}
                      onChange={(e) => handleChange(key, e.target.checked)}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label
                      htmlFor={key}
                      className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                        value ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    ></label>
                  </div>
                </div>
              ) : typeof value === 'number' ? (
                // Number slider
                <div>
                  <div className="flex justify-between">
                    <label htmlFor={key} className="text-sm font-medium text-gray-700">
                      {formattedKey}
                    </label>
                    <span className="text-sm text-gray-500">{value}</span>
                  </div>
                  <input
                    type="range"
                    id={key}
                    value={value}
                    onChange={(e) => handleChange(key, Number(e.target.value))}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ) : (
                // Text input
                <div>
                  <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                    {formattedKey}
                  </label>
                  <input
                    type="text"
                    id={key}
                    value={value}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={handleReset}
          className="btn bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
        >
          Reset to Default
        </button>
        <button
          onClick={handleSave}
          className="btn bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default GameSettings;
