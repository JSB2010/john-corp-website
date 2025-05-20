/**
 * Scroll animations utility for Apple-inspired animations
 * This script handles revealing elements as they enter the viewport
 */

// Observer options
const observerOptions = {
  root: null, // Use the viewport as the root
  rootMargin: '0px',
  threshold: 0.15 // Trigger when 15% of the element is visible
};

// Initialize the animation observer
export const initScrollAnimations = () => {
  // Elements to animate
  const animatedElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .footer-animate');
  
  if (!animatedElements.length) return;
  
  // Create the observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Add the active class when the element is intersecting
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Unobserve after animation is triggered if it should only happen once
        if (entry.target.classList.contains('animate-once')) {
          observer.unobserve(entry.target);
        }
      } else {
        // Optional: Remove the class when the element is not in view
        // Uncomment the next line to make animations replay when scrolling back up
        // entry.target.classList.remove('active');
      }
    });
  }, observerOptions);
  
  // Observe all animated elements
  animatedElements.forEach(element => {
    observer.observe(element);
  });
  
  return observer;
};

// Add scroll animations to elements dynamically
export const addScrollAnimation = (element, animationType = 'reveal', threshold = 0.15) => {
  if (!element) return;
  
  element.classList.add(animationType);
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { ...observerOptions, threshold });
  
  observer.observe(element);
};

// Apply staggered animations to a group of elements
export const applyStaggeredAnimations = (parentSelector, childSelector, baseDelay = 100, increment = 100) => {
  const parent = document.querySelector(parentSelector);
  if (!parent) return;
  
  const children = parent.querySelectorAll(childSelector);
  
  children.forEach((child, index) => {
    const delay = baseDelay + (index * increment);
    child.style.animationDelay = `${delay}ms`;
    child.classList.add('reveal');
  });
  
  // Initialize the observer for these elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);
  
  children.forEach(child => {
    observer.observe(child);
  });
};

// Initialize animations when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
});

export default initScrollAnimations;
