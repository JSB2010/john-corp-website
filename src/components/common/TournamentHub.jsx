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
  doc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  limit,
  increment
} from 'firebase/firestore';

/**
 * Tournament Hub Component
 * Displays available tournaments, allows joining, and shows tournament brackets
 */
function TournamentHub({ isOpen, onClose, onJoinTournament }) {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [tournaments, setTournaments] = useState([]);
  const [myTournaments, setMyTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showTournamentDetails, setShowTournamentDetails] = useState(false);

  // Get current user
  const auth = getAuth();
  const currentUser = auth.currentUser;

  // Load tournaments
  useEffect(() => {
    if (!currentUser || !isOpen) return;

    const db = getFirestore();
    setLoading(true);

    // Get upcoming tournaments
    const unsubscribeUpcoming = onSnapshot(
      query(
        collection(db, 'tournaments'),
        where('status', '==', 'upcoming'),
        where('startTime', '>', new Date()),
        orderBy('startTime', 'asc'),
        limit(10)
      ),
      (snapshot) => {
        try {
          const tournamentsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            startTime: doc.data().startTime?.toDate() || null,
            endTime: doc.data().endTime?.toDate() || null
          }));

          setTournaments(tournamentsData);
          setLoading(false);
        } catch (error) {
          console.error('Error loading tournaments:', error);
          setError('Failed to load tournaments. Please try again.');
          setLoading(false);
        }
      }
    );

    // Get user's tournaments
    const unsubscribeMyTournaments = onSnapshot(
      query(
        collection(db, 'tournamentParticipants'),
        where('userId', '==', currentUser.uid)
      ),
      async (snapshot) => {
        try {
          const participations = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          // Get tournament details for each participation
          const myTournamentsData = [];

          for (const participation of participations) {
            const tournamentSnap = await getDocs(query(collection(db, 'tournaments'), where('__name__', '==', participation.tournamentId)));

            if (!tournamentSnap.empty) {
              const tournamentData = tournamentSnap.docs[0].data();
              myTournamentsData.push({
                id: participation.tournamentId,
                ...tournamentData,
                startTime: tournamentData.startTime?.toDate() || null,
                endTime: tournamentData.endTime?.toDate() || null,
                participationId: participation.id,
                participationStatus: participation.status
              });
            }
          }

          setMyTournaments(myTournamentsData);
        } catch (error) {
          console.error('Error loading my tournaments:', error);
        }
      }
    );

    return () => {
      unsubscribeUpcoming();
      unsubscribeMyTournaments();
    };
  }, [currentUser, isOpen]);

  // Join tournament
  const joinTournament = async (tournamentId) => {
    if (!currentUser) return;

    try {
      const db = getFirestore();
      const participantsRef = collection(db, 'tournamentParticipants');

      // Check if already joined
      const q = query(
        participantsRef,
        where('tournamentId', '==', tournamentId),
        where('userId', '==', currentUser.uid)
      );
      const existingParticipations = await getDocs(q);

      if (!existingParticipations.empty) {
        setError('You have already joined this tournament.');
        return;
      }

      // Join tournament
      await addDoc(participantsRef, {
        tournamentId,
        userId: currentUser.uid,
        displayName: currentUser.displayName || 'Anonymous',
        status: 'registered',
        joinedAt: serverTimestamp(),
        score: 0,
        matches: [],
        eliminated: false
      });

      // Update tournament participant count
      const tournamentRef = doc(db, 'tournaments', tournamentId);
      await updateDoc(tournamentRef, {
        participantCount: increment(1)
      });

      if (onJoinTournament) {
        onJoinTournament(tournamentId);
      }

      // Show success message
      setError(null);
    } catch (error) {
      console.error('Error joining tournament:', error);
      setError('Failed to join tournament. Please try again.');
    }
  };

  // View tournament details
  const viewTournamentDetails = (tournament) => {
    setSelectedTournament(tournament);
    setShowTournamentDetails(true);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'TBD';

    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  // Get time until tournament starts
  const getTimeUntil = (date) => {
    if (!date) return 'TBD';

    const now = new Date();
    const diff = date - now;

    if (diff <= 0) return 'Started';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h`;
    }

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  };

  // Check if user has joined tournament
  const hasJoinedTournament = (tournamentId) => {
    return myTournaments.some(t => t.id === tournamentId);
  };

  // Render upcoming tournaments tab
  const renderUpcomingTab = () => {
    if (loading && tournaments.length === 0) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (tournaments.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No upcoming tournaments available.</p>
          <p className="text-sm text-gray-400">Check back later for new tournaments!</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {tournaments.map(tournament => (
          <div key={tournament.id} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{tournament.name}</h3>
                <p className="text-sm text-gray-600">{tournament.gameId} Tournament</p>
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {getTimeUntil(tournament.startTime)}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Start Time</p>
                <p className="font-medium">{formatDate(tournament.startTime)}</p>
              </div>
              <div>
                <p className="text-gray-500">Players</p>
                <p className="font-medium">{tournament.participantCount || 0}/{tournament.maxParticipants}</p>
              </div>
              <div>
                <p className="text-gray-500">Prize</p>
                <p className="font-medium">{tournament.prizePool} ⭐</p>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => viewTournamentDetails(tournament)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View Details
              </button>

              {hasJoinedTournament(tournament.id) ? (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Registered
                </span>
              ) : (
                <button
                  onClick={() => joinTournament(tournament.id)}
                  disabled={tournament.participantCount >= tournament.maxParticipants}
                  className={`
                    py-1 px-4 rounded-md text-sm
                    ${tournament.participantCount >= tournament.maxParticipants
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'}
                  `}
                >
                  {tournament.participantCount >= tournament.maxParticipants ? 'Full' : 'Join'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render my tournaments tab
  const renderMyTournamentsTab = () => {
    if (loading && myTournaments.length === 0) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (myTournaments.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You haven't joined any tournaments yet.</p>
          <button
            onClick={() => setActiveTab('upcoming')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            Browse Tournaments
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {myTournaments.map(tournament => (
          <div key={tournament.id} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{tournament.name}</h3>
                <p className="text-sm text-gray-600">{tournament.gameId} Tournament</p>
              </div>
              <div className={`
                px-3 py-1 rounded-full text-sm font-medium
                ${tournament.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                  tournament.status === 'active' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'}
              `}>
                {tournament.status === 'upcoming' ? getTimeUntil(tournament.startTime) :
                 tournament.status === 'active' ? 'In Progress' : 'Completed'}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Start Time</p>
                <p className="font-medium">{formatDate(tournament.startTime)}</p>
              </div>
              <div>
                <p className="text-gray-500">Players</p>
                <p className="font-medium">{tournament.participantCount || 0}/{tournament.maxParticipants}</p>
              </div>
              <div>
                <p className="text-gray-500">Your Status</p>
                <p className="font-medium capitalize">{tournament.participationStatus}</p>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => viewTournamentDetails(tournament)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render tournament details
  const renderTournamentDetails = () => {
    if (!selectedTournament) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">{selectedTournament.name}</h2>
              <p className="text-gray-600">{selectedTournament.gameId} Tournament</p>
            </div>
            <button
              onClick={() => setShowTournamentDetails(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-bold mb-2">Tournament Details</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Status</p>
                    <p className="font-medium capitalize">{selectedTournament.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Format</p>
                    <p className="font-medium">{selectedTournament.format || 'Single Elimination'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Start Time</p>
                    <p className="font-medium">{formatDate(selectedTournament.startTime)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">End Time</p>
                    <p className="font-medium">{formatDate(selectedTournament.endTime)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Players</p>
                    <p className="font-medium">{selectedTournament.participantCount || 0}/{selectedTournament.maxParticipants}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Prize Pool</p>
                    <p className="font-medium">{selectedTournament.prizePool} ⭐</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-2">Rules & Requirements</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <ul className="space-y-2 text-sm">
                  {selectedTournament.rules?.map((rule, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {rule}
                    </li>
                  )) || (
                    <li>No specific rules provided.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-2">Description</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm">{selectedTournament.description || 'No description provided.'}</p>
            </div>
          </div>

          {selectedTournament.status === 'active' && (
            <div className="mb-6">
              <h3 className="font-bold mb-2">Bracket</h3>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Tournament bracket visualization would appear here.</p>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            {hasJoinedTournament(selectedTournament.id) ? (
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-md">
                You are registered for this tournament
              </span>
            ) : (
              <button
                onClick={() => joinTournament(selectedTournament.id)}
                disabled={
                  selectedTournament.participantCount >= selectedTournament.maxParticipants ||
                  selectedTournament.status !== 'upcoming'
                }
                className={`
                  py-2 px-4 rounded-md
                  ${selectedTournament.participantCount >= selectedTournament.maxParticipants ||
                    selectedTournament.status !== 'upcoming'
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'}
                `}
              >
                {selectedTournament.participantCount >= selectedTournament.maxParticipants
                  ? 'Tournament Full'
                  : selectedTournament.status !== 'upcoming'
                  ? 'Registration Closed'
                  : 'Join Tournament'}
              </button>
            )}
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
        title="Tournament Hub"
        size="lg"
      >
        <div className="mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`py-2 px-4 ${
                activeTab === 'upcoming'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Upcoming Tournaments
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`py-2 px-4 ${
                activeTab === 'my'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Tournaments
              {myTournaments.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                  {myTournaments.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {activeTab === 'upcoming' && renderUpcomingTab()}
        {activeTab === 'my' && renderMyTournamentsTab()}
      </GameModal>

      {showTournamentDetails && renderTournamentDetails()}
    </>
  );
}

export default TournamentHub;
