import React, { useState, useEffect, useRef } from 'react';
import GameModal from './GameModal';
import GameNotification from './GameNotification';

/**
 * Challenge Mode Component
 * Provides time-based challenges for games
 */
function ChallengeMode({ 
  gameId, 
  playerName,
  onStart,
  onComplete,
  onCancel
}) {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [challengeResult, setChallengeResult] = useState(null);
  const [notifications, setNotifications] = useState([]);
  
  // Timer ref
  const timerRef = useRef(null);
  
  // Available challenges based on game
  const challenges = {
    tetris: [
      {
        id: 'tetris_speed',
        title: 'Speed Challenge',
        description: 'Clear 20 lines in 3 minutes',
        timeLimit: 180, // seconds
        objective: { type: 'lines', target: 20 },
        reward: 'Double points for 1 game'
      },
      {
        id: 'tetris_marathon',
        title: 'Marathon',
        description: 'Score as many points as possible in 5 minutes',
        timeLimit: 300, // seconds
        objective: { type: 'score', target: 'max' },
        reward: 'Unlock special piece'
      },
      {
        id: 'tetris_perfect',
        title: 'Perfect Clear',
        description: 'Get 3 perfect clears in 5 minutes',
        timeLimit: 300, // seconds
        objective: { type: 'perfectClears', target: 3 },
        reward: 'Slow falling speed for 1 game'
      }
    ],
    flappybird: [
      {
        id: 'flappy_endurance',
        title: 'Endurance Run',
        description: 'Survive for 2 minutes',
        timeLimit: 120, // seconds
        objective: { type: 'time', target: 120 },
        reward: 'Extra life for 1 game'
      },
      {
        id: 'flappy_collector',
        title: 'Coin Collector',
        description: 'Collect 15 coins in 1 minute',
        timeLimit: 60, // seconds
        objective: { type: 'coins', target: 15 },
        reward: 'Start with invincibility'
      },
      {
        id: 'flappy_precision',
        title: 'Precision Flying',
        description: 'Pass through 30 narrow gaps',
        timeLimit: 180, // seconds
        objective: { type: 'narrowGaps', target: 30 },
        reward: 'Smaller hitbox for 1 game'
      }
    ],
    pacman: [
      {
        id: 'pacman_ghost_hunter',
        title: 'Ghost Hunter',
        description: 'Eat 15 ghosts in 3 minutes',
        timeLimit: 180, // seconds
        objective: { type: 'ghostsEaten', target: 15 },
        reward: 'Longer power pellet duration'
      },
      {
        id: 'pacman_speed_run',
        title: 'Speed Run',
        description: 'Complete 2 levels in 3 minutes',
        timeLimit: 180, // seconds
        objective: { type: 'levels', target: 2 },
        reward: 'Faster movement speed'
      },
      {
        id: 'pacman_perfect',
        title: 'Perfect Run',
        description: 'Clear a level without being caught',
        timeLimit: 300, // seconds
        objective: { type: 'perfectLevel', target: 1 },
        reward: 'Ghost confusion for 1 game'
      }
    ]
  };
  
  // Get challenges for current game
  const gameChallenges = challenges[gameId] || [];
  
  // Start challenge
  const startChallenge = (challenge) => {
    setSelectedChallenge(challenge);
    setTimeRemaining(challenge.timeLimit);
    setIsActive(true);
    
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up
          clearInterval(timerRef.current);
          handleChallengeEnd(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Notify game to start challenge
    onStart(challenge);
    
    // Add notification
    addNotification(`Challenge started: ${challenge.title}`, 'info');
  };
  
  // Handle challenge completion
  const handleChallengeEnd = (completed = false) => {
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsActive(false);
    
    // Set result
    const result = {
      challenge: selectedChallenge,
      completed,
      timeRemaining,
      timeUsed: selectedChallenge.timeLimit - timeRemaining
    };
    
    setChallengeResult(result);
    setShowResults(true);
    
    // Notify game of challenge completion
    onComplete(result);
    
    // Add notification
    if (completed) {
      addNotification(`Challenge completed: ${selectedChallenge.title}`, 'success');
    } else {
      addNotification(`Challenge failed: ${selectedChallenge.title}`, 'error');
    }
  };
  
  // Add notification
  const addNotification = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const notification = { id, message, type, duration };
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }
    
    return id;
  };
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Render challenge selection
  const renderChallengeSelection = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-center">Select a Challenge</h3>
        
        <div className="grid gap-4">
          {gameChallenges.map(challenge => (
            <div 
              key={challenge.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => startChallenge(challenge)}
            >
              <h4 className="font-bold text-lg">{challenge.title}</h4>
              <p className="text-gray-600 mb-2">{challenge.description}</p>
              <div className="flex justify-between text-sm">
                <span className="text-blue-600">Time: {formatTime(challenge.timeLimit)}</span>
                <span className="text-green-600">Reward: {challenge.reward}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <button
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };
  
  // Render active challenge
  const renderActiveChallenge = () => {
    if (!selectedChallenge) return null;
    
    const { title, description, objective } = selectedChallenge;
    const timePercent = (timeRemaining / selectedChallenge.timeLimit) * 100;
    
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 z-50 w-64">
        <h4 className="font-bold text-center mb-2">{title}</h4>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        
        <div className="mb-2">
          <div className="text-xs text-gray-500 mb-1">Time Remaining:</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
            <div 
              className={`h-2.5 rounded-full ${
                timePercent > 50 ? 'bg-green-600' : 
                timePercent > 20 ? 'bg-yellow-600' : 'bg-red-600'
              }`}
              style={{ width: `${timePercent}%` }}
            ></div>
          </div>
          <div className="text-right text-sm font-bold">{formatTime(timeRemaining)}</div>
        </div>
        
        <div className="text-xs text-gray-500">Objective:</div>
        <div className="text-sm font-medium">
          {objective.type === 'score' ? 'Max score in time limit' : 
           `${objective.target} ${objective.type}`}
        </div>
        
        <button
          onClick={() => handleChallengeEnd(false)}
          className="mt-3 w-full text-xs text-gray-500 hover:text-gray-700"
        >
          Abandon Challenge
        </button>
      </div>
    );
  };
  
  // Render challenge results
  const renderChallengeResults = () => {
    if (!challengeResult) return null;
    
    const { challenge, completed, timeUsed } = challengeResult;
    
    return (
      <GameModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        title="Challenge Results"
        size="sm"
      >
        <div className="text-center">
          <div className={`text-2xl font-bold mb-4 ${completed ? 'text-green-600' : 'text-red-600'}`}>
            {completed ? 'Challenge Completed!' : 'Challenge Failed'}
          </div>
          
          <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
          <p className="text-gray-600 mb-4">{challenge.description}</p>
          
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-left">Time Used:</div>
              <div className="text-right font-bold">{formatTime(timeUsed)}</div>
              
              <div className="text-left">Objective:</div>
              <div className="text-right font-bold">
                {challenge.objective.type === 'score' ? 'Max score' : 
                 `${challenge.objective.target} ${challenge.objective.type}`}
              </div>
              
              {completed && (
                <>
                  <div className="text-left">Reward:</div>
                  <div className="text-right font-bold text-green-600">{challenge.reward}</div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setShowResults(false);
                setSelectedChallenge(null);
              }}
              className="btn bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full"
            >
              New Challenge
            </button>
            
            <button
              onClick={onCancel}
              className="btn bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-full"
            >
              Exit
            </button>
          </div>
        </div>
      </GameModal>
    );
  };
  
  return (
    <div className="challenge-mode">
      {!selectedChallenge && renderChallengeSelection()}
      {isActive && renderActiveChallenge()}
      {renderChallengeResults()}
      
      {/* Notifications */}
      {notifications.map((notification) => (
        <GameNotification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
        />
      ))}
    </div>
  );
}

export default ChallengeMode;
