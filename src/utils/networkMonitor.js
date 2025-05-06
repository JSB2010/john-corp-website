/**
 * Network condition detector with dynamic quality switching
 * 
 * This script enhances video playback by monitoring network conditions
 * and automatically adjusting video quality for optimal playback.
 */

// Initialize network monitoring
const initNetworkMonitoring = () => {
  // Get all video containers
  const videoContainers = document.querySelectorAll('.responsive-video-container');
  
  if (!videoContainers.length) return;
  
  // Check for Network Information API support
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (connection) {
    // Initial network quality check
    checkNetworkQuality(connection, videoContainers);
    
    // Listen for network changes
    connection.addEventListener('change', () => {
      checkNetworkQuality(connection, videoContainers);
    });
  }
  
  // Set up performance observer to detect actual video performance
  if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      // Process performance metrics
      entries.forEach(entry => {
        if (entry.entryType === 'resource' && entry.initiatorType === 'iframe') {
          // Check if loading time is poor and adjust
          if (entry.duration > 5000) { // 5 seconds
            // Find the slow iframe and reduce quality
            videoContainers.forEach(container => {
              const iframe = container.querySelector('iframe');
              if (iframe && iframe.src.includes(entry.name)) {
                adjustVideoQuality(iframe, 'low');
              }
            });
          }
        }
      });
    });
    
    // Observe resource timing
    perfObserver.observe({ entryTypes: ['resource'] });
  }
};

// Check network quality and adjust video settings
const checkNetworkQuality = (connection, videoContainers) => {
  let quality = 'auto';
  
  // Determine quality based on connection
  if (connection.saveData) {
    quality = 'low';
  } else if (connection.effectiveType === '4g' && !connection.saveData) {
    quality = 'high';
  } else if (connection.effectiveType === '3g') {
    quality = 'medium';
  } else if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
    quality = 'low';
  }
  
  // Apply quality to all videos
  videoContainers.forEach(container => {
    const iframe = container.querySelector('iframe');
    if (iframe) {
      adjustVideoQuality(iframe, quality);
    }
  });
  
  // Add visual indicator for user
  updateNetworkIndicator(quality, connection.saveData);
};

// Adjust video quality by updating iframe src
const adjustVideoQuality = (iframe, quality) => {
  const currentSrc = iframe.src;
  const currentQuality = iframe.getAttribute('data-quality') || 'auto';
  
  // Only change if quality is different
  if (currentQuality !== quality) {
    // Update data attribute
    iframe.setAttribute('data-quality', quality);
    
    // Update src with new quality parameter
    if (currentSrc.includes('quality=')) {
      iframe.src = currentSrc.replace(/quality=[^&]+/, `quality=${quality}`);
    } else {
      iframe.src = currentSrc.includes('?') 
        ? `${currentSrc}&quality=${quality}` 
        : `${currentSrc}?quality=${quality}`;
    }
    
    // Log quality change
    console.log(`Video quality adjusted to: ${quality}`);
  }
};

// Update visual network indicator
const updateNetworkIndicator = (quality, saveData) => {
  const indicators = document.querySelectorAll('.network-quality-indicator');
  
  indicators.forEach(indicator => {
    // Update text content
    const textEl = indicator.querySelector('.network-quality-text');
    if (textEl) {
      textEl.textContent = saveData 
        ? 'Data Saver' 
        : quality === 'high' 
          ? 'High Quality' 
          : quality === 'medium' 
            ? 'Standard' 
            : 'Low Quality';
    }
    
    // Update icon/classes
    indicator.className = indicator.className.replace(/quality-(high|medium|low|auto)/g, '');
    indicator.classList.add(`quality-${quality}`);
  });
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initNetworkMonitoring);

// Export for module use
export { 
  initNetworkMonitoring, 
  checkNetworkQuality, 
  adjustVideoQuality 
};
