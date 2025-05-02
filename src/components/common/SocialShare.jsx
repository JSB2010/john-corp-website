import React, { useState } from 'react';
import GameModal from './GameModal';

/**
 * Social Share Component
 * Allows users to share their scores on social media
 */
function SocialShare({ 
  isOpen, 
  onClose, 
  gameId, 
  playerName, 
  score, 
  level,
  achievement = null
}) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  // Generate share text
  const getShareText = () => {
    let text = `I scored ${score} points`;
    
    if (level) {
      text += ` and reached level ${level}`;
    }
    
    text += ` in ${getGameName(gameId)} on John Corp Games!`;
    
    if (achievement) {
      text += ` I also unlocked the "${achievement.title}" achievement!`;
    }
    
    return text;
  };
  
  // Get game name from ID
  const getGameName = (id) => {
    switch (id) {
      case 'tetris':
        return 'Tetris';
      case 'flappybird':
        return 'Flappy Bird';
      case 'pacman':
        return 'Pac-Man';
      default:
        return 'the game';
    }
  };
  
  // Generate share URL
  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    const path = `/games?game=${gameId}&ref=${playerName}`;
    return `${baseUrl}${path}`;
  };
  
  // Share on Twitter
  const shareOnTwitter = () => {
    const text = getShareText();
    const url = getShareUrl();
    const hashtags = `JohnCorpGames,${getGameName(gameId).replace(/\s+/g, '')}`;
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;
    
    window.open(twitterUrl, '_blank');
  };
  
  // Share on Facebook
  const shareOnFacebook = () => {
    const url = getShareUrl();
    
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    
    window.open(facebookUrl, '_blank');
  };
  
  // Share on WhatsApp
  const shareOnWhatsApp = () => {
    const text = getShareText();
    const url = getShareUrl();
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
    
    window.open(whatsappUrl, '_blank');
  };
  
  // Copy link to clipboard
  const copyLink = () => {
    const url = getShareUrl();
    
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  // Generate QR code URL
  const getQRCodeUrl = () => {
    const url = getShareUrl();
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };
  
  // Share via email
  const shareViaEmail = () => {
    const subject = `Check out my score in ${getGameName(gameId)}!`;
    const body = `${getShareText()}\n\nPlay it yourself at: ${getShareUrl()}`;
    
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoUrl;
  };
  
  // Create a challenge
  const createChallenge = () => {
    // This would typically integrate with a backend to create a challenge
    // For now, we'll just copy a challenge link
    const url = `${getShareUrl()}&challenge=${score}`;
    
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <GameModal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Your Score"
      size="md"
    >
      <div className="text-center">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">
            {playerName}, you scored {score} points!
          </h3>
          <p className="text-gray-600">
            Share your achievement with friends
          </p>
        </div>
        
        {showQR ? (
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <img 
                src={getQRCodeUrl()} 
                alt="QR Code" 
                className="w-48 h-48 border rounded-lg"
              />
            </div>
            <button
              onClick={() => setShowQR(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              Back to sharing options
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={shareOnTwitter}
              className="flex flex-col items-center justify-center p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
              Twitter
            </button>
            
            <button
              onClick={shareOnFacebook}
              className="flex flex-col items-center justify-center p-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg"
            >
              <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
            
            <button
              onClick={shareOnWhatsApp}
              className="flex flex-col items-center justify-center p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            >
              <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </button>
            
            <button
              onClick={shareViaEmail}
              className="flex flex-col items-center justify-center p-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
            >
              <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              Email
            </button>
          </div>
        )}
        
        <div className="flex flex-col space-y-3">
          <button
            onClick={copyLink}
            className={`flex items-center justify-center py-2 px-4 rounded-lg border ${
              copied ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
                Copy Link
              </>
            )}
          </button>
          
          <button
            onClick={() => setShowQR(!showQR)}
            className="flex items-center justify-center py-2 px-4 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 11h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v2h-3v-2zm0 4h3v2h-3v-2zM13 11h3v2h-3v-2zm0 4h3v2h-3v-2zm-2 4h2v3h-2v-3zm4 0h3v3h-3v-3z" />
            </svg>
            {showQR ? 'Hide QR Code' : 'Show QR Code'}
          </button>
          
          <button
            onClick={createChallenge}
            className="flex items-center justify-center py-2 px-4 rounded-lg border border-purple-500 bg-purple-100 text-purple-700 hover:bg-purple-200"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
            </svg>
            Challenge a Friend
          </button>
        </div>
      </div>
    </GameModal>
  );
}

export default SocialShare;
