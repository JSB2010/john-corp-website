/**
 * Visual Effects Utility
 * Provides enhanced visual effects for games
 */

/**
 * Create a particle effect
 * @param {Object} options - Particle effect options
 * @param {number} options.x - X position of the effect
 * @param {number} options.y - Y position of the effect
 * @param {number} options.count - Number of particles to create
 * @param {Array} options.colors - Array of colors to use for particles
 * @param {number} options.minSize - Minimum particle size
 * @param {number} options.maxSize - Maximum particle size
 * @param {number} options.minSpeed - Minimum particle speed
 * @param {number} options.maxSpeed - Maximum particle speed
 * @param {number} options.gravity - Gravity effect on particles
 * @param {number} options.lifetime - Lifetime of particles in milliseconds
 * @param {boolean} options.fadeOut - Whether particles should fade out
 * @returns {Array} - Array of particle objects
 */
export const createParticleEffect = (options = {}) => {
  const {
    x = 0,
    y = 0,
    count = 20,
    colors = ['#ff0000', '#00ff00', '#0000ff'],
    minSize = 2,
    maxSize = 8,
    minSpeed = 1,
    maxSpeed = 5,
    gravity = 0.1,
    lifetime = 1000,
    fadeOut = true
  } = options;
  
  const particles = [];
  
  for (let i = 0; i < count; i++) {
    const size = Math.random() * (maxSize - minSize) + minSize;
    const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
    const angle = Math.random() * Math.PI * 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particles.push({
      x,
      y,
      size,
      color,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity,
      lifetime,
      birth: Date.now(),
      fadeOut,
      alpha: 1
    });
  }
  
  return particles;
};

/**
 * Update particles
 * @param {Array} particles - Array of particle objects
 * @returns {Array} - Updated array of particles with expired particles removed
 */
export const updateParticles = (particles) => {
  const now = Date.now();
  
  return particles.filter(particle => {
    // Update position
    particle.x += particle.vx;
    particle.y += particle.vy;
    
    // Apply gravity
    particle.vy += particle.gravity;
    
    // Calculate age
    const age = now - particle.birth;
    const lifePercent = age / particle.lifetime;
    
    // Update alpha if fading out
    if (particle.fadeOut) {
      particle.alpha = 1 - lifePercent;
    }
    
    // Remove if expired
    return age < particle.lifetime;
  });
};

/**
 * Draw particles on canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Array} particles - Array of particle objects
 */
export const drawParticles = (ctx, particles) => {
  particles.forEach(particle => {
    ctx.globalAlpha = particle.alpha;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });
  
  ctx.globalAlpha = 1;
};

/**
 * Create a screen shake effect
 * @param {Object} options - Screen shake options
 * @param {number} options.intensity - Intensity of the shake
 * @param {number} options.duration - Duration of the shake in milliseconds
 * @param {Function} options.onShake - Callback function called with (x, y) offset on each frame
 * @returns {Object} - Screen shake controller
 */
export const createScreenShake = (options = {}) => {
  const {
    intensity = 5,
    duration = 500,
    onShake = () => {}
  } = options;
  
  let active = false;
  let startTime = 0;
  let requestId = null;
  
  const start = () => {
    if (active) return;
    
    active = true;
    startTime = Date.now();
    
    const update = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const remaining = 1 - progress;
      
      if (progress < 1) {
        const xOffset = (Math.random() * 2 - 1) * intensity * remaining;
        const yOffset = (Math.random() * 2 - 1) * intensity * remaining;
        
        onShake(xOffset, yOffset);
        
        requestId = requestAnimationFrame(update);
      } else {
        onShake(0, 0);
        active = false;
      }
    };
    
    update();
  };
  
  const stop = () => {
    if (!active) return;
    
    if (requestId) {
      cancelAnimationFrame(requestId);
      requestId = null;
    }
    
    onShake(0, 0);
    active = false;
  };
  
  return {
    start,
    stop,
    isActive: () => active
  };
};

/**
 * Create a flash effect
 * @param {Object} options - Flash effect options
 * @param {string} options.color - Color of the flash
 * @param {number} options.duration - Duration of the flash in milliseconds
 * @param {Function} options.onFlash - Callback function called with alpha value on each frame
 * @returns {Object} - Flash effect controller
 */
export const createFlashEffect = (options = {}) => {
  const {
    color = '#ffffff',
    duration = 300,
    onFlash = () => {}
  } = options;
  
  let active = false;
  let startTime = 0;
  let requestId = null;
  
  const start = () => {
    if (active) return;
    
    active = true;
    startTime = Date.now();
    
    const update = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const alpha = 1 - progress;
      
      if (progress < 1) {
        onFlash(color, alpha);
        requestId = requestAnimationFrame(update);
      } else {
        onFlash(color, 0);
        active = false;
      }
    };
    
    update();
  };
  
  const stop = () => {
    if (!active) return;
    
    if (requestId) {
      cancelAnimationFrame(requestId);
      requestId = null;
    }
    
    onFlash(color, 0);
    active = false;
  };
  
  return {
    start,
    stop,
    isActive: () => active
  };
};

/**
 * Create a slow-motion effect
 * @param {Object} options - Slow-motion effect options
 * @param {number} options.factor - Slow-motion factor (0-1, lower is slower)
 * @param {number} options.duration - Duration of the effect in milliseconds
 * @param {Function} options.onSlowMotion - Callback function called with factor value on each frame
 * @returns {Object} - Slow-motion effect controller
 */
export const createSlowMotionEffect = (options = {}) => {
  const {
    factor = 0.5,
    duration = 2000,
    onSlowMotion = () => {}
  } = options;
  
  let active = false;
  let startTime = 0;
  let requestId = null;
  
  const start = () => {
    if (active) return;
    
    active = true;
    startTime = Date.now();
    
    const update = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease in and out
      let currentFactor;
      if (progress < 0.5) {
        // Ease in
        currentFactor = 1 - (1 - factor) * (progress * 2);
      } else {
        // Ease out
        currentFactor = factor + (1 - factor) * ((progress - 0.5) * 2);
      }
      
      if (progress < 1) {
        onSlowMotion(currentFactor);
        requestId = requestAnimationFrame(update);
      } else {
        onSlowMotion(1);
        active = false;
      }
    };
    
    update();
  };
  
  const stop = () => {
    if (!active) return;
    
    if (requestId) {
      cancelAnimationFrame(requestId);
      requestId = null;
    }
    
    onSlowMotion(1);
    active = false;
  };
  
  return {
    start,
    stop,
    isActive: () => active
  };
};

/**
 * Create a parallax background effect
 * @param {Object} options - Parallax background options
 * @param {Array} options.layers - Array of layer objects with image and speed properties
 * @param {number} options.width - Width of the canvas
 * @param {number} options.height - Height of the canvas
 * @returns {Object} - Parallax background controller
 */
export const createParallaxBackground = (options = {}) => {
  const {
    layers = [],
    width = 800,
    height = 600
  } = options;
  
  // Initialize layer positions
  const layerPositions = layers.map(() => ({ x: 0, y: 0 }));
  
  const update = (deltaX = 0, deltaY = 0) => {
    layers.forEach((layer, index) => {
      layerPositions[index].x -= deltaX * layer.speed;
      layerPositions[index].y -= deltaY * layer.speed;
      
      // Wrap around if needed
      if (layer.image.width > 0) {
        layerPositions[index].x = layerPositions[index].x % layer.image.width;
        if (layerPositions[index].x > 0) {
          layerPositions[index].x -= layer.image.width;
        }
      }
      
      if (layer.image.height > 0) {
        layerPositions[index].y = layerPositions[index].y % layer.image.height;
        if (layerPositions[index].y > 0) {
          layerPositions[index].y -= layer.image.height;
        }
      }
    });
  };
  
  const draw = (ctx) => {
    layers.forEach((layer, index) => {
      const { x, y } = layerPositions[index];
      
      // Draw the layer and its wrapping copies
      for (let i = 0; i < Math.ceil(width / layer.image.width) + 1; i++) {
        for (let j = 0; j < Math.ceil(height / layer.image.height) + 1; j++) {
          ctx.drawImage(
            layer.image,
            x + i * layer.image.width,
            y + j * layer.image.height
          );
        }
      }
    });
  };
  
  return {
    update,
    draw,
    getLayerPositions: () => [...layerPositions]
  };
};

/**
 * Create a transition effect
 * @param {Object} options - Transition effect options
 * @param {string} options.type - Type of transition (fade, wipe, pixelate, etc.)
 * @param {number} options.duration - Duration of the transition in milliseconds
 * @param {Function} options.onProgress - Callback function called with progress value on each frame
 * @param {Function} options.onComplete - Callback function called when transition is complete
 * @returns {Object} - Transition effect controller
 */
export const createTransitionEffect = (options = {}) => {
  const {
    type = 'fade',
    duration = 1000,
    onProgress = () => {},
    onComplete = () => {}
  } = options;
  
  let active = false;
  let startTime = 0;
  let requestId = null;
  
  const start = () => {
    if (active) return;
    
    active = true;
    startTime = Date.now();
    
    const update = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      onProgress(type, progress);
      
      if (progress < 1) {
        requestId = requestAnimationFrame(update);
      } else {
        active = false;
        onComplete();
      }
    };
    
    update();
  };
  
  const stop = () => {
    if (!active) return;
    
    if (requestId) {
      cancelAnimationFrame(requestId);
      requestId = null;
    }
    
    active = false;
  };
  
  return {
    start,
    stop,
    isActive: () => active
  };
};

/**
 * Draw a transition effect on canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} type - Type of transition
 * @param {number} progress - Progress of the transition (0-1)
 * @param {number} width - Width of the canvas
 * @param {number} height - Height of the canvas
 */
export const drawTransition = (ctx, type, progress, width, height) => {
  ctx.save();
  
  switch (type) {
    case 'fade':
      ctx.fillStyle = `rgba(0, 0, 0, ${progress})`;
      ctx.fillRect(0, 0, width, height);
      break;
      
    case 'wipe-right':
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width * progress, height);
      break;
      
    case 'wipe-left':
      ctx.fillStyle = 'black';
      ctx.fillRect(width * (1 - progress), 0, width * progress, height);
      break;
      
    case 'wipe-up':
      ctx.fillStyle = 'black';
      ctx.fillRect(0, height * (1 - progress), width, height * progress);
      break;
      
    case 'wipe-down':
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width, height * progress);
      break;
      
    case 'circle':
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.max(width, height) * progress, 0, Math.PI * 2);
      ctx.fill();
      break;
      
    case 'circle-reverse':
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.max(width, height) * (1 - progress), 0, Math.PI * 2);
      ctx.rect(width, 0, -width, height);
      ctx.fill();
      break;
      
    default:
      ctx.fillStyle = `rgba(0, 0, 0, ${progress})`;
      ctx.fillRect(0, 0, width, height);
      break;
  }
  
  ctx.restore();
};
