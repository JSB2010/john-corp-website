import { useEffect, useRef } from 'react';

// Animation types
const ANIMATION_TYPES = {
  FADE_UP: 'fade-up',
  FADE_DOWN: 'fade-down',
  FADE_LEFT: 'fade-left',
  FADE_RIGHT: 'fade-right',
  ZOOM_IN: 'zoom-in',
  ZOOM_OUT: 'zoom-out',
};

export function ScrollReveal({ 
  children, 
  type = ANIMATION_TYPES.FADE_UP, 
  delay = 0, 
  duration = 800, 
  threshold = 0.1,
  once = true,
  className = '',
}) {
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Initial setup - hide the element
    element.style.opacity = '0';
    
    // Set transition properties based on animation type
    let transform = '';
    switch (type) {
      case ANIMATION_TYPES.FADE_UP:
        transform = 'translateY(30px)';
        break;
      case ANIMATION_TYPES.FADE_DOWN:
        transform = 'translateY(-30px)';
        break;
      case ANIMATION_TYPES.FADE_LEFT:
        transform = 'translateX(30px)';
        break;
      case ANIMATION_TYPES.FADE_RIGHT:
        transform = 'translateX(-30px)';
        break;
      case ANIMATION_TYPES.ZOOM_IN:
        transform = 'scale(0.9)';
        break;
      case ANIMATION_TYPES.ZOOM_OUT:
        transform = 'scale(1.1)';
        break;
      default:
        transform = 'translateY(30px)';
    }
    
    element.style.transform = transform;
    element.style.transition = `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
    element.style.transitionDelay = `${delay}ms`;
    element.style.willChange = 'opacity, transform';

    // Create Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate in
            element.style.opacity = '1';
            element.style.transform = 'translate(0, 0) scale(1)';
            
            // If once is true, unobserve after animation
            if (once && !hasAnimated.current) {
              hasAnimated.current = true;
              observer.unobserve(element);
            }
          } else if (!once) {
            // Animate out if not once
            element.style.opacity = '0';
            element.style.transform = transform;
          }
        });
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [type, delay, duration, threshold, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// Export animation types for easy access
ScrollReveal.ANIMATION_TYPES = ANIMATION_TYPES;
