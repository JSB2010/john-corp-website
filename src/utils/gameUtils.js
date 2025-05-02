// Game utilities for loading assets and playing sounds

// Cache for loaded images
const imageCache = {};

/**
 * Load an image and cache it
 * @param {string} src - Image source path
 * @returns {Promise<HTMLImageElement>} - Promise that resolves with the loaded image
 */
export const loadImage = (src) => {
  // Return from cache if available
  if (imageCache[src]) {
    return Promise.resolve(imageCache[src]);
  }

  // Load and cache the image
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache[src] = img;
      resolve(img);
    };
    img.onerror = (err) => reject(err);
    img.src = src;
  });
};

// Cache for loaded audio
const audioCache = {};

/**
 * Load an audio file and cache it
 * @param {string} src - Audio source path
 * @returns {Promise<HTMLAudioElement>} - Promise that resolves with the loaded audio
 */
export const loadAudio = (src) => {
  // Return from cache if available
  if (audioCache[src]) {
    return Promise.resolve(audioCache[src]);
  }

  // Load and cache the audio
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.oncanplaythrough = () => {
      audioCache[src] = audio;
      resolve(audio);
    };
    audio.onerror = (err) => reject(err);
    audio.src = src;
  });
};

/**
 * Play a sound with optional volume control
 * @param {HTMLAudioElement} audio - Audio element to play
 * @param {number} volume - Volume level (0-1)
 */
export const playSound = (audio, volume = 1.0) => {
  if (!audio) return;

  // Create a clone to allow overlapping sounds
  const sound = audio.cloneNode();
  sound.volume = volume;
  sound.play().catch(err => console.error('Error playing sound:', err));
};

/**
 * Asset preloader for efficiently loading multiple assets
 */
export class AssetLoader {
  constructor() {
    this.images = {};
    this.sounds = {};
    this.totalAssets = 0;
    this.loadedAssets = 0;
    this.onProgress = null;
    this.onComplete = null;
  }

  // Add image to load queue
  addImage(key, src) {
    this.totalAssets++;
    this.images[key] = { src, loaded: false, image: null };
    return this;
  }

  // Add sound to load queue
  addSound(key, src) {
    this.totalAssets++;
    this.sounds[key] = { src, loaded: false, sound: null };
    return this;
  }

  // Set progress callback
  setProgressCallback(callback) {
    this.onProgress = callback;
    return this;
  }

  // Set complete callback
  setCompleteCallback(callback) {
    this.onComplete = callback;
    return this;
  }

  // Load all assets
  loadAll() {
    // Load images
    Object.keys(this.images).forEach(key => {
      loadImage(this.images[key].src)
        .then(image => {
          this.images[key].image = image;
          this.images[key].loaded = true;
          this.assetLoaded();
        })
        .catch(() => this.assetError(key));
    });

    // Load sounds
    Object.keys(this.sounds).forEach(key => {
      loadAudio(this.sounds[key].src)
        .then(sound => {
          this.sounds[key].sound = sound;
          this.sounds[key].loaded = true;
          this.assetLoaded();
        })
        .catch(() => this.assetError(key));
    });

    // Handle case with no assets
    if (this.totalAssets === 0 && this.onComplete) {
      this.onComplete();
    }

    return this;
  }

  // Asset loaded handler
  assetLoaded() {
    this.loadedAssets++;

    if (this.onProgress) {
      this.onProgress(this.loadedAssets / this.totalAssets);
    }

    if (this.loadedAssets === this.totalAssets && this.onComplete) {
      this.onComplete();
    }
  }

  // Asset error handler
  assetError(key) {
    console.error(`Failed to load asset: ${key}`);
    this.assetLoaded(); // Count as loaded to avoid hanging
  }

  // Get image
  getImage(key) {
    return this.images[key]?.image || null;
  }

  // Get sound
  getSound(key) {
    return this.sounds[key]?.sound || null;
  }

  // Play sound
  playSound(key, volume = 1, loop = false) {
    const sound = this.getSound(key);

    if (sound) {
      const clone = sound.cloneNode();
      clone.volume = volume;
      clone.loop = loop;
      clone.play().catch(e => console.error('Error playing sound:', e));
      return clone;
    }

    return null;
  }

  // Stop sound
  stopSound(sound) {
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }
}

/**
 * Generate a random color
 * @returns {string} - Random hex color
 */
export const randomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};

/**
 * Draw rounded rectangle on canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Rectangle width
 * @param {number} height - Rectangle height
 * @param {number} radius - Corner radius
 * @param {string} color - Fill color
 */
export const drawRoundedRect = (ctx, x, y, width, height, radius, color) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fill();
};

/**
 * Create a gradient background
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {string} color1 - Start color
 * @param {string} color2 - End color
 */
export const createGradientBackground = (ctx, width, height, color1, color2) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
};

/**
 * Draw text with shadow
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} text - Text to draw
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {string} color - Text color
 * @param {string} font - Font style
 * @param {string} align - Text alignment
 */
export const drawTextWithShadow = (ctx, text, x, y, color, font, align = 'center') => {
  ctx.font = font;
  ctx.textAlign = align;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.shadowColor = 'transparent';
};

/**
 * Create a particle effect
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} count - Number of particles
 * @param {string} color - Particle color
 * @param {number} size - Particle size
 * @param {number} speed - Particle speed
 * @param {number} duration - Effect duration in ms
 */
export const createParticleEffect = (ctx, x, y, count, color, size, speed, duration) => {
  const particles = [];

  // Create particles
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * speed;

    particles.push({
      x,
      y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      size: Math.random() * size + 1,
      color,
      alpha: 1
    });
  }

  const startTime = Date.now();

  // Animation function
  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Clear previous frame (optional, depends on your game's rendering)
    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Update and draw particles
    for (const particle of particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.alpha = 1 - progress;

      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    // Continue animation if not complete
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  // Start animation
  animate();
};

/**
 * Create a screen shake effect
 * @param {number} intensity - Shake intensity
 * @param {number} duration - Effect duration in ms
 * @returns {Object} - Screen shake effect object
 */
export const createScreenShake = (intensity, duration) => {
  return {
    intensity,
    duration,
    startTime: Date.now(),
    active: true
  };
};

/**
 * Apply screen shake to canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} shake - Screen shake effect object
 */
export const applyScreenShake = (ctx, shake) => {
  if (!shake || !shake.active) return;

  const elapsed = Date.now() - shake.startTime;
  const progress = Math.min(elapsed / shake.duration, 1);

  if (progress >= 1) {
    shake.active = false;
    return;
  }

  const intensity = shake.intensity * (1 - progress);
  const offsetX = (Math.random() * 2 - 1) * intensity;
  const offsetY = (Math.random() * 2 - 1) * intensity;

  ctx.save();
  ctx.translate(offsetX, offsetY);
};

/**
 * Reset screen shake transformation
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 */
export const resetScreenShake = (ctx) => {
  ctx.restore();
};

/**
 * Create a flash effect
 * @param {string} color - Flash color
 * @param {number} duration - Effect duration in ms
 * @returns {Object} - Flash effect object
 */
export const createFlashEffect = (color, duration) => {
  return {
    color,
    duration,
    startTime: Date.now(),
    active: true
  };
};

/**
 * Apply flash effect to canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} flash - Flash effect object
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
export const applyFlashEffect = (ctx, flash, width, height) => {
  if (!flash || !flash.active) return;

  const elapsed = Date.now() - flash.startTime;
  const progress = Math.min(elapsed / flash.duration, 1);

  if (progress >= 1) {
    flash.active = false;
    return;
  }

  const alpha = 1 - progress;

  ctx.fillStyle = flash.color;
  ctx.globalAlpha = alpha;
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 1;
};

/**
 * Create a slow motion effect
 * @param {number} factor - Slow motion factor (0-1)
 * @param {number} duration - Effect duration in ms
 * @returns {Object} - Slow motion effect object
 */
export const createSlowMotion = (factor, duration) => {
  return {
    factor,
    duration,
    startTime: Date.now(),
    active: true
  };
};

/**
 * Get current time factor from slow motion effect
 * @param {Object} slowMotion - Slow motion effect object
 * @returns {number} - Time factor (0-1)
 */
export const getSlowMotionFactor = (slowMotion) => {
  if (!slowMotion || !slowMotion.active) return 1;

  const elapsed = Date.now() - slowMotion.startTime;
  const progress = Math.min(elapsed / slowMotion.duration, 1);

  if (progress >= 1) {
    slowMotion.active = false;
    return 1;
  }

  // Ease in/out for smoother transition
  const easeInOut = progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

  // Interpolate between factor and 1
  return slowMotion.factor + (1 - slowMotion.factor) * easeInOut;
};

/**
 * Multiplayer session manager
 * Handles creating and joining multiplayer game sessions
 */
export class MultiplayerManager {
  constructor(gameId, playerName) {
    this.gameId = gameId;
    this.playerName = playerName;
    this.sessionId = null;
    this.isHost = false;
    this.players = [];
    this.gameState = null;
    this.onPlayerJoin = null;
    this.onPlayerLeave = null;
    this.onGameStart = null;
    this.onGameUpdate = null;
    this.onGameEnd = null;
  }

  /**
   * Create a new multiplayer session
   * @param {Object} settings - Game settings
   * @returns {string} - Session ID
   */
  createSession(settings = {}) {
    this.sessionId = `${this.gameId}_${Date.now()}`;
    this.isHost = true;

    // Add host as first player
    this.players = [{
      id: Date.now().toString(),
      name: this.playerName,
      isHost: true,
      isReady: true,
      score: 0
    }];

    // Initialize game state
    this.gameState = {
      settings,
      status: 'waiting',
      startTime: null
    };

    return this.sessionId;
  }

  /**
   * Join an existing multiplayer session
   * @param {string} sessionId - Session ID to join
   * @returns {boolean} - Success status
   */
  joinSession(sessionId) {
    // In a real implementation, this would connect to a server
    // For now, we'll simulate it locally
    this.sessionId = sessionId;
    this.isHost = false;

    const playerId = Date.now().toString();

    // Add player to session
    const newPlayer = {
      id: playerId,
      name: this.playerName,
      isHost: false,
      isReady: false,
      score: 0
    };

    this.players.push(newPlayer);

    // Notify host
    if (this.onPlayerJoin) {
      this.onPlayerJoin(newPlayer);
    }

    return true;
  }

  /**
   * Set player ready status
   * @param {boolean} ready - Ready status
   */
  setReady(ready) {
    if (!this.sessionId) return;

    // Find player
    const player = this.players.find(p => p.name === this.playerName);
    if (player) {
      player.isReady = ready;
    }

    // Check if all players are ready
    const allReady = this.players.every(p => p.isReady);

    // Start game if all players are ready and current player is host
    if (allReady && this.isHost && this.gameState.status === 'waiting') {
      this.startGame();
    }
  }

  /**
   * Start the multiplayer game
   */
  startGame() {
    if (!this.isHost || !this.sessionId) return;

    this.gameState.status = 'playing';
    this.gameState.startTime = Date.now();

    // Notify players
    if (this.onGameStart) {
      this.onGameStart(this.gameState);
    }
  }

  /**
   * Update player score
   * @param {number} score - New score
   */
  updateScore(score) {
    if (!this.sessionId || this.gameState.status !== 'playing') return;

    // Find player
    const player = this.players.find(p => p.name === this.playerName);
    if (player) {
      player.score = score;
    }

    // Notify other players
    if (this.onGameUpdate) {
      this.onGameUpdate({
        playerId: player.id,
        score
      });
    }
  }

  /**
   * End the multiplayer game
   * @param {Object} results - Game results
   */
  endGame(results) {
    if (!this.isHost || !this.sessionId) return;

    this.gameState.status = 'ended';
    this.gameState.endTime = Date.now();
    this.gameState.results = results;

    // Notify players
    if (this.onGameEnd) {
      this.onGameEnd(this.gameState);
    }
  }

  /**
   * Leave the multiplayer session
   */
  leaveSession() {
    if (!this.sessionId) return;

    // Find player
    const player = this.players.find(p => p.name === this.playerName);

    // Remove player from session
    this.players = this.players.filter(p => p.name !== this.playerName);

    // Notify other players
    if (this.onPlayerLeave && player) {
      this.onPlayerLeave(player);
    }

    // End session if host leaves
    if (this.isHost) {
      this.endGame({ reason: 'host_left' });
    }

    this.sessionId = null;
    this.isHost = false;
    this.gameState = null;
  }

  /**
   * Get current session info
   * @returns {Object} - Session information
   */
  getSessionInfo() {
    return {
      sessionId: this.sessionId,
      isHost: this.isHost,
      players: this.players,
      gameState: this.gameState
    };
  }

  /**
   * Set event handlers
   * @param {Object} handlers - Event handler functions
   */
  setEventHandlers(handlers) {
    if (handlers.onPlayerJoin) this.onPlayerJoin = handlers.onPlayerJoin;
    if (handlers.onPlayerLeave) this.onPlayerLeave = handlers.onPlayerLeave;
    if (handlers.onGameStart) this.onGameStart = handlers.onGameStart;
    if (handlers.onGameUpdate) this.onGameUpdate = handlers.onGameUpdate;
    if (handlers.onGameEnd) this.onGameEnd = handlers.onGameEnd;
  }
}

/**
 * Challenge manager
 * Handles time-based challenges and objectives
 */
export class ChallengeManager {
  constructor() {
    this.challenges = [];
    this.activeChallenge = null;
    this.onChallengeComplete = null;
    this.onChallengeFailed = null;
  }

  /**
   * Add a new challenge
   * @param {Object} challenge - Challenge definition
   */
  addChallenge(challenge) {
    this.challenges.push({
      ...challenge,
      completed: false
    });
  }

  /**
   * Start a challenge
   * @param {string} challengeId - Challenge ID
   * @returns {boolean} - Success status
   */
  startChallenge(challengeId) {
    const challenge = this.challenges.find(c => c.id === challengeId);

    if (!challenge) return false;

    this.activeChallenge = {
      ...challenge,
      startTime: Date.now(),
      progress: 0
    };

    return true;
  }

  /**
   * Update challenge progress
   * @param {Object} gameState - Current game state
   */
  updateProgress(gameState) {
    if (!this.activeChallenge) return;

    const challenge = this.activeChallenge;
    const elapsed = Date.now() - challenge.startTime;

    // Check if time limit exceeded
    if (challenge.timeLimit && elapsed > challenge.timeLimit) {
      this.failChallenge('time_exceeded');
      return;
    }

    // Update progress based on challenge type
    switch (challenge.type) {
      case 'score':
        challenge.progress = Math.min(1, gameState.score / challenge.target);

        if (gameState.score >= challenge.target) {
          this.completeChallenge();
        }
        break;

      case 'survival':
        challenge.progress = elapsed / challenge.timeLimit;

        if (elapsed >= challenge.timeLimit) {
          this.completeChallenge();
        }
        break;

      case 'collection':
        challenge.progress = Math.min(1, gameState.collected / challenge.target);

        if (gameState.collected >= challenge.target) {
          this.completeChallenge();
        }
        break;

      case 'combo':
        challenge.progress = Math.min(1, gameState.combo / challenge.target);

        if (gameState.combo >= challenge.target) {
          this.completeChallenge();
        }
        break;
    }

    // Check for game over condition
    if (gameState.gameOver && !challenge.completed) {
      this.failChallenge('game_over');
    }
  }

  /**
   * Complete the active challenge
   */
  completeChallenge() {
    if (!this.activeChallenge) return;

    const challenge = this.activeChallenge;
    challenge.completed = true;

    // Find challenge in list and mark as completed
    const index = this.challenges.findIndex(c => c.id === challenge.id);
    if (index >= 0) {
      this.challenges[index].completed = true;
    }

    // Notify callback
    if (this.onChallengeComplete) {
      this.onChallengeComplete(challenge);
    }

    this.activeChallenge = null;
  }

  /**
   * Fail the active challenge
   * @param {string} reason - Failure reason
   */
  failChallenge(reason) {
    if (!this.activeChallenge) return;

    const challenge = this.activeChallenge;

    // Notify callback
    if (this.onChallengeFailed) {
      this.onChallengeFailed({
        challenge,
        reason
      });
    }

    this.activeChallenge = null;
  }

  /**
   * Get all challenges
   * @returns {Array} - List of challenges
   */
  getChallenges() {
    return this.challenges;
  }

  /**
   * Get active challenge
   * @returns {Object} - Active challenge or null
   */
  getActiveChallenge() {
    return this.activeChallenge;
  }

  /**
   * Set event handlers
   * @param {Object} handlers - Event handler functions
   */
  setEventHandlers(handlers) {
    if (handlers.onChallengeComplete) this.onChallengeComplete = handlers.onChallengeComplete;
    if (handlers.onChallengeFailed) this.onChallengeFailed = handlers.onChallengeFailed;
  }
}

/**
 * Social sharing utility
 * @param {string} text - Text to share
 * @param {string} url - URL to share
 * @returns {boolean} - Success status
 */
export const shareScore = (text, url = window.location.href) => {
  // Check if Web Share API is available
  if (navigator.share) {
    navigator.share({
      title: 'My Game Score',
      text,
      url
    }).catch(err => console.error('Error sharing:', err));

    return true;
  }

  // Fallback to clipboard
  try {
    navigator.clipboard.writeText(`${text} ${url}`);
    alert('Score copied to clipboard!');
    return true;
  } catch (err) {
    console.error('Error copying to clipboard:', err);
    return false;
  }
};
