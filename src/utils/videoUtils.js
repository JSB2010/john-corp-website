// Video utility functions for responsive playback
import { useEffect, useState } from 'react';

/**
 * Custom hook to detect network connection quality
 * @returns {Object} connectionQuality and related methods
 */
export const useConnectionQuality = () => {
  const [connectionQuality, setConnectionQuality] = useState('auto');
  const [saveData, setSaveData] = useState(false);
  
  useEffect(() => {
    // Check for Network Information API
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    const updateConnectionQuality = () => {
      if (!connection) {
        setConnectionQuality('auto');
        return;
      }
      
      // Save data mode detection
      setSaveData(connection.saveData === true);
      
      // Determine quality based on connection type and speed
      if (connection.saveData) {
        setConnectionQuality('low');
      } else if (connection.effectiveType === '4g' && !connection.saveData) {
        setConnectionQuality('high');
      } else if (connection.effectiveType === '3g') {
        setConnectionQuality('medium');
      } else if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
        setConnectionQuality('low');
      } else {
        setConnectionQuality('auto');
      }
    };
    
    // Initial check
    updateConnectionQuality();
    
    // Listen for connection changes
    if (connection) {
      connection.addEventListener('change', updateConnectionQuality);
    }
    
    // Cleanup event listener
    return () => {
      if (connection) {
        connection.removeEventListener('change', updateConnectionQuality);
      }
    };
  }, []);

  return {
    connectionQuality,
    saveData,
    isHighSpeed: connectionQuality === 'high',
    isLowBandwidth: connectionQuality === 'low' || saveData
  };
};

/**
 * Updates video embed code with quality parameters
 * @param {string} embedCode - The original embed code
 * @param {string} quality - The desired quality ('high', 'medium', 'low', 'auto')
 * @returns {string} - Modified embed code with quality parameters
 */
export const getQualityEmbedCode = (embedCode, quality = 'auto') => {
  // Extracted src from embed code
  const srcMatch = embedCode.match(/src="([^"]+)"/);
  if (!srcMatch || !srcMatch[1]) return embedCode;
  
  const iframeSrc = srcMatch[1];
  
  // Add quality parameter
  const enhancedSrc = iframeSrc.includes('?') 
    ? `${iframeSrc}&quality=${quality}` 
    : `${iframeSrc}?quality=${quality}`;
  
  // Replace original src with enhanced one
  return embedCode.replace(iframeSrc, enhancedSrc);
};

/**
 * Enables Picture-in-Picture functionality for iframe videos
 * @param {HTMLIFrameElement} iframe - The iframe element
 */
export const enablePictureInPicture = (iframe) => {
  if (!iframe) return;
  
  try {
    // For browsers that support PiP API on iframes
    if (document.pictureInPictureEnabled && iframe.requestPictureInPicture) {
      iframe.requestPictureInPicture();
    } else {
      // Fallback - try to use the embed provider's PiP feature via URL parameters
      const currentSrc = iframe.src;
      if (!currentSrc.includes('pip=1')) {
        iframe.src = currentSrc.includes('?') 
          ? `${currentSrc}&pip=1` 
          : `${currentSrc}?pip=1`;
      }
    }
  } catch (error) {
    console.error("Picture-in-Picture failed:", error);
  }
};

/**
 * Preload video thumbnails for better performance
 * @param {Array} videoItems - Array of objects with thumbnail properties
 */
export const preloadVideoThumbnails = (videoItems) => {
  if (!videoItems || !Array.isArray(videoItems)) return;
  
  videoItems.forEach(item => {
    if (item.thumbnail) {
      const img = new Image();
      img.src = item.thumbnail;
    }
  });
};

/**
 * Adds keyboard navigation for video controls
 * @param {HTMLElement} container - Container element for the video player
 */
export const setupKeyboardNavigation = (container) => {
  if (!container) return;
  
  // Find all focusable elements within the container
  const focusableElements = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  // Focus trap for modal dialogs
  container.addEventListener('keydown', (e) => {
    // Tab key
    if (e.key === 'Tab') {
      // Shift + Tab
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } 
      // Tab
      else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  });
};

/**
 * Track video playback metrics
 * @param {string} videoId - The ID of the video
 * @param {string} eventType - The type of event (play, pause, complete)
 */
export const trackVideoAnalytics = (videoId, eventType = 'play') => {
  // Simple analytics tracking
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'videoEvent',
      videoId,
      eventType,
      timestamp: new Date().toISOString(),
    });
  }
  
  // Log for development
  console.log(`Video ${eventType}: ${videoId}`);
};

/**
 * Toggle fullscreen mode for a video container
 * @param {HTMLElement} container - The container element to toggle fullscreen
 */
export const toggleFullscreen = (container) => {
  if (!container) return;
  
  try {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) { /* Safari */
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) { /* IE11 */
        container.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    }
  } catch (error) {
    console.error("Fullscreen toggle failed:", error);
  }
};

/**
 * Setup closed captions/subtitles if available
 * @param {HTMLIFrameElement} iframe - The iframe element
 * @param {string} language - The language code for captions (e.g., 'en', 'es')
 */
export const setupClosedCaptions = (iframe, language = 'en') => {
  if (!iframe) return;
  
  try {
    const currentSrc = iframe.src;
    // Add cc parameter to enable closed captions
    if (!currentSrc.includes('cc=')) {
      iframe.src = currentSrc.includes('?') 
        ? `${currentSrc}&cc=1&cc_lang=${language}` 
        : `${currentSrc}?cc=1&cc_lang=${language}`;
    }
    // If already has cc parameter, just update the language
    else if (!currentSrc.includes(`cc_lang=${language}`)) {
      iframe.src = currentSrc.replace(/cc_lang=[^&]+/, `cc_lang=${language}`);
    }
  } catch (error) {
    console.error("Closed captions setup failed:", error);
  }
};

/**
 * Create a simple video playback progress tracker
 * @param {HTMLIFrameElement} iframe - The iframe element
 * @param {HTMLElement} progressContainer - Container for the progress bar
 */
export const createProgressTracker = (iframe, progressContainer) => {
  if (!iframe || !progressContainer) return;
  
  // Create progress bar element
  const progressBar = document.createElement('div');
  progressBar.className = 'video-progress-bar';
  
  // Create progress indicator
  const progressIndicator = document.createElement('div');
  progressIndicator.className = 'video-progress-indicator';
  
  progressBar.appendChild(progressIndicator);
  progressContainer.appendChild(progressBar);
  
  // Setup message listener to receive progress updates from iframe
  window.addEventListener('message', (event) => {
    // Verify origin for security
    if (iframe.src.includes(event.origin)) {
      try {
        const data = JSON.parse(event.data);
        
        // Handle progress update message
        if (data.type === 'progress' && typeof data.value === 'number') {
          progressIndicator.style.width = `${data.value * 100}%`;
        }
      } catch (e) {
        // Not a JSON message or not from our video
      }
    }
  });
  
  // Add click handler to seek
  progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    
    // Send seek message to iframe
    const message = JSON.stringify({
      type: 'seek',
      value: position
    });
    
    try {
      iframe.contentWindow.postMessage(message, '*');
    } catch (error) {
      console.error("Seek command failed:", error);
    }
  });
  
  return { progressBar, progressIndicator };
};

export default {
  useConnectionQuality,
  getQualityEmbedCode,
  enablePictureInPicture,
  preloadVideoThumbnails,
  setupKeyboardNavigation,
  trackVideoAnalytics,
  toggleFullscreen,
  setupClosedCaptions,
  createProgressTracker
};
