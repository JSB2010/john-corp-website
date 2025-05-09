import React, { useState, useRef, useEffect } from 'react'
import { useConnectionQuality, preloadVideoThumbnails } from '../utils/videoUtils'

function Filmmaking() {
  console.log("Filmmaking component rendering START");
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [showFilmDetails, setShowFilmDetails] = useState(false);
  const detailsRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const { connectionQuality, saveData, isLowBandwidth } = useConnectionQuality();
  
  // Log component lifecycle for debugging
  useEffect(() => {
    console.log("Filmmaking component mounted");
    
    return () => {
      console.log("Filmmaking component unmounted");
    };
  }, []);
  
  // Check if the device is mobile or has a small screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on initial load
    checkMobile();
    
    // Check on window resize
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Define films array with complete information
  const films = [
    {
      id: 1,
      title: "The Greater Norway Movement",
      year: 2023,
      director: "John Cunningham",
      genre: "Documentary",
      duration: "8 mins",
      description: "An exploration of Norway's cultural and political influence across Scandinavia, examining how Norwegian values have shaped regional development.",
      thumbnail: "/placeholder-norway.svg",
      embedCode: '<iframe width="560" height="315" src="https://smmall.cloud/embed/askthekidz/MTc0NjU0NDE1MjQ0NA" title="Smmall Cloud video player" frameborder="0" allow="autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      isPrimary: true,
      awards: ["Best Documentary - Nordic Film Festival 2023", "Official Selection - Toronto International Film Festival"]
    },
    {
      id: 2,
      title: "John Corp Ad",
      year: 2025,
      director: "Sonnor Ciegal",
      genre: "Commercial Campaign",
      duration: "3 min",
      description: "Award-winning commercial series showcasing the strength of John Corp's innovative solutions across various industries.",
      thumbnail: "/placeholder-commercial.svg",
      embedCode: '<iframe width="560" height="315" src="https://smmall.cloud/embed/askthekidz/MTc0NjU0NDE1MjQ0Nw" title="Smmall Cloud video player" frameborder="0" allow="autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      awards: ["Gold - Advertising Film Festival", "Best Cinematography - Commercial Awards"]
    }
  ];

  // Preload thumbnails for better performance (only for high-bandwidth connections)
  useEffect(() => {
    if (!isLowBandwidth) {
      preloadVideoThumbnails(films);
    }
  }, [isLowBandwidth, films]);

  // Handle film selection
  const handleFilmClick = (film) => {
    setSelectedFilm(film);
    setShowFilmDetails(true);
    console.log(`Selected film: ${film.title}`);
  };

  // Close film details modal
  const closeFilmDetails = () => {
    setShowFilmDetails(false);
    setTimeout(() => {
      setSelectedFilm(null);
    }, 300); // Delay to allow for transition
  };

  // Create HTML for embedding films
  const createFilmPreview = (film) => {
    return `
<div class="film-container">
  <div class="responsive-video-container">
    <div class="video-placeholder" style="background-image: url('${film.thumbnail}')">
      <div class="video-thumbnail-play">
        <svg viewBox="0 0 24 24" fill="white">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
    </div>
    ${film.embedCode}
  </div>
</div>`;
  };

  return (
    <div className="filmmaking-container py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mb-2">
        <span className="block">Filmmaking</span>
        <span className="block text-blue-600 text-2xl sm:text-3xl">John Corp Productions</span>
      </h1>
      <p className="mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        Creating compelling visual stories that captivate audiences and communicate our vision for a better world.
      </p>
      
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {films.map((film) => (
          <div 
            key={film.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            role="button"
            tabIndex={0}
            onClick={() => handleFilmClick(film)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleFilmClick(film);
              }
            }}
          >
            <div className="relative pb-[56.25%] bg-gray-200">
              <img 
                src={film.thumbnail} 
                alt={`${film.title} thumbnail`} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-blue-600 bg-opacity-80 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{film.title}</h2>
              <p className="text-gray-600 mb-2 italic">{film.year} • {film.duration} • Directed by {film.director}</p>
              <p className="text-gray-700">{film.description}</p>
              {film.awards && film.awards.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Awards:</h3>
                  <ul className="text-sm text-gray-600">
                    {film.awards.map((award, index) => (
                      <li key={index} className="mb-1">• {award}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Film Detail Modal */}
      {showFilmDetails && selectedFilm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-lg max-w-4xl w-full mx-auto shadow-xl"
            ref={detailsRef}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl font-bold text-gray-900">{selectedFilm.title}</h2>
                <button 
                  onClick={closeFilmDetails}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="responsive-video-container mb-6 rounded overflow-hidden">
                <div dangerouslySetInnerHTML={{ __html: selectedFilm.embedCode }} />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">About this film</h3>
                  <p className="text-gray-700 mb-4">{selectedFilm.description}</p>
                  <div className="text-sm text-gray-600">
                    <p><span className="font-medium">Director:</span> {selectedFilm.director}</p>
                    <p><span className="font-medium">Year:</span> {selectedFilm.year}</p>
                    <p><span className="font-medium">Duration:</span> {selectedFilm.duration}</p>
                    <p><span className="font-medium">Genre:</span> {selectedFilm.genre}</p>
                  </div>
                </div>
                
                {selectedFilm.awards && selectedFilm.awards.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Awards & Recognition</h3>
                    <ul className="text-gray-700">
                      {selectedFilm.awards.map((award, index) => (
                        <li key={index} className="mb-2 flex">
                          <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 1l2.928 6.856 6.072.584-4.536 4.536.896 6.024L10 16.2l-5.36 2.8.896-6.024L1 8.44l6.072-.584L10 1z" clipRule="evenodd" />
                          </svg>
                          {award}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Filmmaking;
