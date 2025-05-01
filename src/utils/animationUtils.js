/**
 * Animation utilities for responsive animations
 */

/**
 * Check if device supports hover
 * @returns {boolean} Whether device supports hover
 */
export const supportsHover = () => {
  return window.matchMedia('(hover: hover)').matches;
};

/**
 * Check if reduced motion is preferred
 * @returns {boolean} Whether reduced motion is preferred
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get appropriate animation duration based on device capabilities
 * @param {number} defaultDuration - Default animation duration in ms
 * @returns {number} Adjusted animation duration
 */
export const getAnimationDuration = (defaultDuration = 800) => {
  if (prefersReducedMotion()) {
    return 0; // No animation for reduced motion preference
  }
  
  // Reduce animation duration on mobile devices for better performance
  if (!supportsHover()) {
    return Math.min(defaultDuration, 600);
  }
  
  return defaultDuration;
};

/**
 * Create staggered animation delays for a list of items
 * @param {number} count - Number of items
 * @param {number} baseDelay - Base delay in ms
 * @param {number} increment - Delay increment in ms
 * @returns {Array} Array of delay values
 */
export const createStaggeredDelays = (count, baseDelay = 0, increment = 100) => {
  return Array.from({ length: count }, (_, i) => baseDelay + i * increment);
};

/**
 * Apply scroll-triggered animations to elements
 * @param {string} selector - CSS selector for elements to animate
 * @param {Object} options - Animation options
 */
export const initScrollAnimations = (selector = '.scroll-animate', options = {}) => {
  const defaultOptions = {
    threshold: 0.1,
    once: true,
    rootMargin: '0px 0px -10% 0px',
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        if (mergedOptions.once) {
          observer.unobserve(entry.target);
        }
      } else if (!mergedOptions.once) {
        entry.target.classList.remove('active');
      }
    });
  }, mergedOptions);
  
  elements.forEach((element) => {
    observer.observe(element);
  });
  
  return observer;
};

/**
 * Apply parallax effect to elements
 * @param {string} selector - CSS selector for elements to apply parallax
 * @param {number} speed - Parallax speed factor (0-1)
 */
export const initParallaxEffect = (selector = '.parallax', speed = 0.5) => {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;
  
  const handleScroll = () => {
    const scrollTop = window.pageYOffset;
    
    elements.forEach((element) => {
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Only apply parallax when element is in viewport
      if (
        scrollTop + windowHeight > elementTop &&
        scrollTop < elementTop + elementHeight
      ) {
        const offset = (scrollTop - elementTop) * speed;
        element.style.transform = `translateY(${offset}px)`;
      }
    });
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial position
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};
