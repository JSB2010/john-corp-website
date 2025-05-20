/**
 * Initialize animations for the website
 * This script handles all animation initializations in one place
 */

// Initialize animations when the DOM is loaded
export const initAnimations = () => {
  // Add active class to all elements with reveal class that are in viewport
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .footer-animate');
  
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          
          // Unobserve after animation is triggered if it should only happen once
          if (entry.target.classList.contains('animate-once')) {
            observer.unobserve(entry.target);
          }
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    });
    
    revealElements.forEach(element => {
      observer.observe(element);
    });
  }
  
  // Add staggered animation to product cards
  const productCards = document.querySelectorAll('.product-card');
  if (productCards.length > 0) {
    productCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('reveal');
    });
  }
  
  // Add hover effects to buttons
  const buttons = document.querySelectorAll('.btn');
  if (buttons.length > 0) {
    buttons.forEach(button => {
      if (!button.classList.contains('hover-lift') && !button.classList.contains('hover-scale')) {
        button.classList.add('hover-lift');
      }
    });
  }
};

// Call this function when the DOM is loaded
document.addEventListener('DOMContentLoaded', initAnimations);

export default initAnimations;
