import React, { useState, useEffect } from 'react';
import GameModal from './GameModal';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';

/**
 * Friends List Component
 * Displays the user's friends and allows sending/accepting friend requests and challenges
 */
function FriendsList({ isOpen, onClose, onChallenge }) {
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  
  // Get current user
  const auth = getAuth();
  const currentUser = auth.currentUser;
  
  // Load friends and friend requests
  useEffect(() => {
    if (!currentUser || !isOpen) return;
    
    const db = getFirestore();
    setLoading(true);
    
    // Get friends
    const unsubscribeFriends = onSnapshot(
      query(
        collection(db, 'friendships'),
        where('status', '==', 'accepted'),
        where('participants', 'array-contains', currentUser.uid)
      ),
      async (snapshot) => {
        try {
          const friendsData = [];
          
          for (const doc of snapshot.docs) {
            const friendship = doc.data();
            const friendId = friendship.participants.find(id => id !== currentUser.uid);
            
            // Get friend user data
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('uid', '==', friendId));
            const userSnapshot = await getDocs(q);
            
            if (!userSnapshot.empty) {
              const userData = userSnapshot.docs[0].data();
              friendsData.push({
                id: friendId,
                name: userData.displayName || 'Unknown User',
                avatar: userData.photoURL || null,
                status: userData.status || 'offline',
                lastActive: userData.lastActive?.toDate() || null,
                friendshipId: doc.id
              });
            }
          }
          
          setFriends(friendsData);
          setLoading(false);
        } catch (error) {
          console.error('Error loading friends:', error);
          setError('Failed to load friends. Please try again.');
          setLoading(false);
        }
      }
    );
    
    // Get friend requests
    const unsubscribeRequests = onSnapshot(
      query(
        collection(db, 'friendships'),
        where('status', '==', 'pending'),
        where('receiverId', '==', currentUser.uid)
      ),
      async (snapshot) => {
        try {
          const requestsData = [];
          
          for (const doc of snapshot.docs) {
            const request = doc.data();
            
            // Get sender user data
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('uid', '==', request.senderId));
            const userSnapshot = await getDocs(q);
            
            if (!userSnapshot.empty) {
              const userData = userSnapshot.docs[0].data();
              requestsData.push({
                id: request.senderId,
                name: userData.displayName || 'Unknown User',
                avatar: userData.photoURL || null,
                requestId: doc.id,
                timestamp: request.timestamp?.toDate() || null
              });
            }
          }
          
          setFriendRequests(requestsData);
        } catch (error) {
          console.error('Error loading friend requests:', error);
        }
      }
    );
    
    return () => {
      unsubscribeFriends();
      unsubscribeRequests();
    };
  }, [currentUser, isOpen]);
  
  // Search for users
  const handleSearch = async () => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }
    
    try {
      setLoading(true);
      const db = getFirestore();
      const usersRef = collection(db, 'users');
      
      // Search by display name (case insensitive)
      // In a real app, you would use a more sophisticated search method
      const q = query(usersRef, where('displayNameLower', '>=', searchQuery.toLowerCase()));
      const querySnapshot = await getDocs(q);
      
      const results = [];
      querySnapshot.forEach(doc => {
        const userData = doc.data();
        
        // Don't include current user or existing friends in results
        if (
          userData.uid !== currentUser.uid && 
          !friends.some(friend => friend.id === userData.uid)
        ) {
          results.push({
            id: userData.uid,
            name: userData.displayName || 'Unknown User',
            avatar: userData.photoURL || null,
            status: userData.status || 'offline'
          });
        }
      });
      
      setSearchResults(results);
      setLoading(false);
    } catch (error) {
      console.error('Error searching users:', error);
      setError('Failed to search users. Please try again.');
      setLoading(false);
    }
  };
  
  // Send friend request
  const sendFriendRequest = async (userId) => {
    if (!currentUser) return;
    
    try {
      const db = getFirestore();
      const friendshipsRef = collection(db, 'friendships');
      
      // Check if request already exists
      const q = query(
        friendshipsRef,
        where('senderId', '==', currentUser.uid),
        where('receiverId', '==', userId)
      );
      const existingRequests = await getDocs(q);
      
      if (!existingRequests.empty) {
        setError('Friend request already sent.');
        return;
      }
      
      // Create new friend request
      await addDoc(friendshipsRef, {
        senderId: currentUser.uid,
        receiverId: userId,
        status: 'pending',
        participants: [currentUser.uid, userId],
        timestamp: serverTimestamp()
      });
      
      // Update search results
      setSearchResults(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, requestSent: true } 
            : user
        )
      );
    } catch (error) {
      console.error('Error sending friend request:', error);
      setError('Failed to send friend request. Please try again.');
    }
  };
  
  // Accept friend request
  const acceptFriendRequest = async (requestId) => {
    try {
      const db = getFirestore();
      const requestRef = doc(db, 'friendships', requestId);
      
      await updateDoc(requestRef, {
        status: 'accepted',
        acceptedAt: serverTimestamp()
      });
      
      // Remove from requests list
      setFriendRequests(prev => prev.filter(request => request.requestId !== requestId));
    } catch (error) {
      console.error('Error accepting friend request:', error);
      setError('Failed to accept friend request. Please try again.');
    }
  };
  
  // Decline friend request
  const declineFriendRequest = async (requestId) => {
    try {
      const db = getFirestore();
      const requestRef = doc(db, 'friendships', requestId);
      
      await deleteDoc(requestRef);
      
      // Remove from requests list
      setFriendRequests(prev => prev.filter(request => request.requestId !== requestId));
    } catch (error) {
      console.error('Error declining friend request:', error);
      setError('Failed to decline friend request. Please try again.');
    }
  };
  
  // Remove friend
  const removeFriend = async (friendshipId) => {
    try {
      const db = getFirestore();
      const friendshipRef = doc(db, 'friendships', friendshipId);
      
      await deleteDoc(friendshipRef);
      
      // Remove from friends list
      setFriends(prev => prev.filter(friend => friend.friendshipId !== friendshipId));
    } catch (error) {
      console.error('Error removing friend:', error);
      setError('Failed to remove friend. Please try again.');
    }
  };
  
  // Challenge friend
  const challengeFriend = (friend) => {
    setSelectedFriend(friend);
    setShowChallengeModal(true);
  };
  
  // Send challenge
  const sendChallenge = async (gameId, settings) => {
    if (!selectedFriend || !currentUser) return;
    
    try {
      const db = getFirestore();
      const challengesRef = collection(db, 'challenges');
      
      const challenge = {
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'Unknown User',
        receiverId: selectedFriend.id,
        receiverName: selectedFriend.name,
        gameId,
        settings,
        status: 'pending',
        timestamp: serverTimestamp(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      };
      
      await addDoc(challengesRef, challenge);
      
      setShowChallengeModal(false);
      setSelectedFriend(null);
      
      if (onChallenge) {
        onChallenge(challenge);
      }
    } catch (error) {
      console.error('Error sending challenge:', error);
      setError('Failed to send challenge. Please try again.');
    }
  };
  
  // Format last active time
  const formatLastActive = (date) => {
    if (!date) return 'Unknown';
    
    const now = new Date();
    const diff = now - date;
    
    // Less than a minute
    if (diff < 60 * 1000) {
      return 'Just now';
    }
    
    // Less than an hour
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a day
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a week
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
    
    // Format as date
    return date.toLocaleDateString();
  };
  
  // Render friends tab
  const renderFriendsTab = () => {
    if (loading && friends.length === 0) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }
    
    if (friends.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You don't have any friends yet.</p>
          <button
            onClick={() => setActiveTab('add')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            Find Friends
          </button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {friends.map(friend => (
          <div key={friend.id} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center">
              {friend.avatar ? (
                <img 
                  src={friend.avatar} 
                  alt={friend.name} 
                  className="w-10 h-10 rounded-full mr-3"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                  <span className="text-gray-600">{friend.name.charAt(0)}</span>
                </div>
              )}
              
              <div>
                <h3 className="font-medium">{friend.name}</h3>
                <div className="flex items-center text-sm">
                  <span 
                    className={`w-2 h-2 rounded-full mr-1 ${
                      friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  ></span>
                  <span className="text-gray-500">
                    {friend.status === 'online' 
                      ? 'Online' 
                      : `Last active ${formatLastActive(friend.lastActive)}`
                    }
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => challengeFriend(friend)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-sm"
              >
                Challenge
              </button>
              <button
                onClick={() => removeFriend(friend.friendshipId)}
                className="text-red-600 hover:text-red-800"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Render requests tab
  const renderRequestsTab = () => {
    if (loading && friendRequests.length === 0) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }
    
    if (friendRequests.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">You don't have any friend requests.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {friendRequests.map(request => (
          <div key={request.id} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center">
              {request.avatar ? (
                <img 
                  src={request.avatar} 
                  alt={request.name} 
                  className="w-10 h-10 rounded-full mr-3"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                  <span className="text-gray-600">{request.name.charAt(0)}</span>
                </div>
              )}
              
              <div>
                <h3 className="font-medium">{request.name}</h3>
                <p className="text-sm text-gray-500">
                  Sent {request.timestamp ? formatLastActive(request.timestamp) : 'recently'}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => acceptFriendRequest(request.requestId)}
                className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md text-sm"
              >
                Accept
              </button>
              <button
                onClick={() => declineFriendRequest(request.requestId)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded-md text-sm"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Render add friends tab
  const renderAddFriendsTab = () => {
    return (
      <div>
        <div className="mb-6">
          <div className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={searchQuery.length < 3}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md disabled:bg-blue-300"
            >
              Search
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Enter at least 3 characters to search</p>
        </div>
        
        {loading && searchQuery.length >= 3 ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-4">
            {searchResults.map(user => (
              <div key={user.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                      <span className="text-gray-600">{user.name.charAt(0)}</span>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <div className="flex items-center text-sm">
                      <span 
                        className={`w-2 h-2 rounded-full mr-1 ${
                          user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      ></span>
                      <span className="text-gray-500">
                        {user.status === 'online' ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => sendFriendRequest(user.id)}
                  disabled={user.requestSent}
                  className={`
                    py-1 px-3 rounded-md text-sm
                    ${user.requestSent
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'}
                  `}
                >
                  {user.requestSent ? 'Request Sent' : 'Add Friend'}
                </button>
              </div>
            ))}
          </div>
        ) : searchQuery.length >= 3 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No users found matching "{searchQuery}"</p>
          </div>
        ) : null}
      </div>
    );
  };
  
  // Render challenge modal
  const renderChallengeModal = () => {
    if (!selectedFriend) return null;
    
    const games = [
      { id: 'tetris', name: 'Tetris', image: '🧱' },
      { id: 'flappyBird', name: 'Flappy Bird', image: '🐦' },
      { id: 'pacMan', name: 'Pac-Man', image: '🟡' },
      { id: 'snake', name: 'Snake', image: '🐍' },
      { id: 'pong', name: 'Pong', image: '🏓' },
      { id: 'breakout', name: 'Breakout', image: '🧱' }
    ];
    
    const [selectedGame, setSelectedGame] = useState(games[0].id);
    const [gameSettings, setGameSettings] = useState({
      difficulty: 'normal',
      timeLimit: 300, // 5 minutes
      scoreTarget: 1000
    });
    
    const handleSettingChange = (setting, value) => {
      setGameSettings(prev => ({
        ...prev,
        [setting]: value
      }));
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-xl font-bold mb-4">Challenge {selectedFriend.name}</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Game
            </label>
            <div className="grid grid-cols-3 gap-2">
              {games.map(game => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(game.id)}
                  className={`
                    p-3 border rounded-md flex flex-col items-center
                    ${selectedGame === game.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                  `}
                >
                  <span className="text-2xl mb-1">{game.image}</span>
                  <span className="text-sm">{game.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <div className="flex space-x-2">
              {['easy', 'normal', 'hard'].map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => handleSettingChange('difficulty', difficulty)}
                  className={`
                    flex-1 py-2 px-3 border rounded-md capitalize
                    ${gameSettings.difficulty === difficulty ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                  `}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Limit
            </label>
            <select
              value={gameSettings.timeLimit}
              onChange={(e) => handleSettingChange('timeLimit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value={180}>3 minutes</option>
              <option value={300}>5 minutes</option>
              <option value={600}>10 minutes</option>
              <option value={0}>No limit</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Score Target
            </label>
            <input
              type="number"
              value={gameSettings.scoreTarget}
              onChange={(e) => handleSettingChange('scoreTarget', parseInt(e.target.value))}
              min={100}
              step={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowChallengeModal(false)}
              className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={() => sendChallenge(selectedGame, gameSettings)}
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Send Challenge
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <>
      <GameModal
        isOpen={isOpen}
        onClose={onClose}
        title="Friends"
        size="lg"
      >
        <div className="mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('friends')}
              className={`py-2 px-4 ${
                activeTab === 'friends'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Friends
              {friends.length > 0 && (
                <span className="ml-2 bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                  {friends.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-2 px-4 ${
                activeTab === 'requests'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Requests
              {friendRequests.length > 0 && (
                <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                  {friendRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`py-2 px-4 ${
                activeTab === 'add'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Add Friends
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {activeTab === 'friends' && renderFriendsTab()}
        {activeTab === 'requests' && renderRequestsTab()}
        {activeTab === 'add' && renderAddFriendsTab()}
      </GameModal>
      
      {showChallengeModal && renderChallengeModal()}
    </>
  );
}

export default FriendsList;
