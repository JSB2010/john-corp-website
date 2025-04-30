import React, { useEffect, useRef } from 'react';

// Animation types
const ANIMATION_TYPES = {
  FADE_IN: 'fade-in',
  SLIDE_UP: 'slide-up',
  SLIDE_LEFT: 'slide-left',
  SLIDE_RIGHT: 'slide-right',
  SCALE_UP: 'scale-up',
  PARALLAX: 'parallax',
};

const AnimationWrapper = ({ 
  children, 
  type = ANIMATION_TYPES.FADE_IN, 
  delay = 0, 
  duration = 1, 
  threshold = 0.2,
  triggerOnce = true,
  className = '',
  style = {}
}) => {
  const elementRef = useRef(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    // Create IntersectionObserver to trigger animation when element is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add active class to trigger animation
            element.classList.add('active');
            
            // Unobserve if triggerOnce is true
            if (triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            // Remove active class if not triggerOnce
            element.classList.remove('active');
          }
        });
      },
      { threshold }
    );
    
    // Start observing
    observer.observe(element);
    
    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [threshold, triggerOnce]);
  
  // Determine animation class based on type
  const getAnimationClass = () => {
    switch (type) {
      case ANIMATION_TYPES.FADE_IN:
        return 'reveal';
      case ANIMATION_TYPES.SLIDE_UP:
        return 'reveal';
      case ANIMATION_TYPES.SLIDE_LEFT:
        return 'reveal-left';
      case ANIMATION_TYPES.SLIDE_RIGHT:
        return 'reveal-right';
      case ANIMATION_TYPES.SCALE_UP:
        return 'reveal-scale';
      case ANIMATION_TYPES.PARALLAX:
        return 'parallax';
      default:
        return 'reveal';
    }
  };
  
  // Custom styles for animation
  const animationStyle = {
    ...style,
    transitionDuration: `${duration}s`,
    transitionDelay: `${delay}s`,
  };
  
  return (
    <div 
      ref={elementRef}
      className={`${getAnimationClass()} ${className}`}
      style={animationStyle}
    >
      {children}
    </div>
  );
};

// Export animation types for easy access
AnimationWrapper.TYPES = ANIMATION_TYPES;

export default AnimationWrapper;
