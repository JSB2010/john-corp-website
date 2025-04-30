// Advanced animations for Apple-inspired design

// Scroll reveal animations
export const initScrollReveal = () => {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;
    
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < windowHeight - revealPoint) {
        element.classList.add('active');
      } else {
        element.classList.remove('active');
      }
    });
  };
  
  // Initial check
  revealOnScroll();
  
  // Add scroll event listener
  window.addEventListener('scroll', revealOnScroll);
};

// Parallax effect
export const initParallax = () => {
  const parallaxElements = document.querySelectorAll('.parallax-bg');
  
  const moveParallax = () => {
    parallaxElements.forEach(element => {
      const scrollPosition = window.pageYOffset;
      const parent = element.closest('.parallax');
      const parentTop = parent.offsetTop;
      const speed = element.dataset.speed || 0.5;
      
      const offset = (scrollPosition - parentTop) * speed;
      element.style.transform = `translateY(${offset}px)`;
    });
  };
  
  // Add scroll event listener
  window.addEventListener('scroll', moveParallax);
};

// Navbar scroll effect
export const initNavbarScroll = () => {
  const navbar = document.querySelector('.apple-nav');
  
  if (!navbar) return;
  
  const handleNavbarScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.remove('apple-nav-transparent');
      navbar.classList.add('apple-nav-solid');
    } else {
      navbar.classList.add('apple-nav-transparent');
      navbar.classList.remove('apple-nav-solid');
    }
  };
  
  // Initial check
  handleNavbarScroll();
  
  // Add scroll event listener
  window.addEventListener('scroll', handleNavbarScroll);
};

// Magnetic button effect
export const initMagneticButtons = () => {
  const buttons = document.querySelectorAll('.magnetic-btn');
  
  buttons.forEach(button => {
    button.addEventListener('mousemove', e => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const moveX = (x - centerX) / 10;
      const moveY = (y - centerY) / 10;
      
      button.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translate(0, 0)';
    });
  });
};

// Text scramble effect
export class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);
    this.queue = [];
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  
  update() {
    let output = '';
    let complete = 0;
    
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }
    
    this.el.innerHTML = output;
    
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Initialize all animations
export const initAllAnimations = () => {
  initScrollReveal();
  initParallax();
  initNavbarScroll();
  initMagneticButtons();
  
  // Initialize text scramble for elements with class 'scramble-text'
  document.querySelectorAll('.scramble-text').forEach(el => {
    const fx = new TextScramble(el);
    const originalText = el.innerText;
    
    // Scramble on hover
    el.addEventListener('mouseenter', () => {
      fx.setText(originalText);
    });
  });
};

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initAllAnimations);
