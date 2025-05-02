/**
 * Game Assets Utility
 * Handles loading and management of game assets (sounds, sprites, music)
 */

// Cache for loaded assets
const assetCache = {
  sounds: {},
  sprites: {},
  music: {}
};

/**
 * Load a sound file
 * @param {string} key - Unique identifier for the sound
 * @param {string} path - Path to the sound file
 * @returns {Promise<HTMLAudioElement>} - Promise that resolves with the loaded audio
 */
export const loadSound = (key, path) => {
  // Return from cache if available
  if (assetCache.sounds[key]) {
    return Promise.resolve(assetCache.sounds[key]);
  }
  
  // Load and cache the sound
  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio();
      audio.oncanplaythrough = () => {
        assetCache.sounds[key] = audio;
        resolve(audio);
      };
      audio.onerror = (err) => reject(err);
      audio.src = path;
    } catch (err) {
      console.error(`Failed to load sound: ${path}`, err);
      reject(err);
    }
  });
};

/**
 * Play a sound with optional volume control
 * @param {string} key - Unique identifier for the sound
 * @param {number} volume - Volume level (0-1)
 * @param {boolean} loop - Whether to loop the sound
 * @returns {HTMLAudioElement} - The audio element being played
 */
export const playSound = (key, volume = 1.0, loop = false) => {
  const audio = assetCache.sounds[key];
  if (!audio) {
    console.warn(`Sound not loaded: ${key}`);
    return null;
  }
  
  // Create a clone to allow overlapping sounds
  const sound = audio.cloneNode();
  sound.volume = volume;
  sound.loop = loop;
  sound.play().catch(err => console.error('Error playing sound:', err));
  
  return sound;
};

/**
 * Stop a playing sound
 * @param {HTMLAudioElement} sound - The sound to stop
 */
export const stopSound = (sound) => {
  if (!sound) return;
  sound.pause();
  sound.currentTime = 0;
};

/**
 * Load a sprite image
 * @param {string} key - Unique identifier for the sprite
 * @param {string} path - Path to the sprite image
 * @returns {Promise<HTMLImageElement>} - Promise that resolves with the loaded image
 */
export const loadSprite = (key, path) => {
  // Return from cache if available
  if (assetCache.sprites[key]) {
    return Promise.resolve(assetCache.sprites[key]);
  }
  
  // Load and cache the sprite
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.onload = () => {
        assetCache.sprites[key] = img;
        resolve(img);
      };
      img.onerror = (err) => reject(err);
      img.src = path;
    } catch (err) {
      console.error(`Failed to load sprite: ${path}`, err);
      reject(err);
    }
  });
};

/**
 * Get a loaded sprite
 * @param {string} key - Unique identifier for the sprite
 * @returns {HTMLImageElement|null} - The loaded sprite or null if not found
 */
export const getSprite = (key) => {
  return assetCache.sprites[key] || null;
};

/**
 * Load background music
 * @param {string} key - Unique identifier for the music
 * @param {string} path - Path to the music file
 * @returns {Promise<HTMLAudioElement>} - Promise that resolves with the loaded audio
 */
export const loadMusic = (key, path) => {
  // Return from cache if available
  if (assetCache.music[key]) {
    return Promise.resolve(assetCache.music[key]);
  }
  
  // Load and cache the music
  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio();
      audio.oncanplaythrough = () => {
        assetCache.music[key] = audio;
        resolve(audio);
      };
      audio.onerror = (err) => reject(err);
      audio.src = path;
      audio.loop = true; // Music typically loops
    } catch (err) {
      console.error(`Failed to load music: ${path}`, err);
      reject(err);
    }
  });
};

/**
 * Play background music
 * @param {string} key - Unique identifier for the music
 * @param {number} volume - Volume level (0-1)
 * @returns {HTMLAudioElement} - The audio element being played
 */
export const playMusic = (key, volume = 0.5) => {
  const music = assetCache.music[key];
  if (!music) {
    console.warn(`Music not loaded: ${key}`);
    return null;
  }
  
  music.volume = volume;
  music.currentTime = 0;
  music.play().catch(err => console.error('Error playing music:', err));
  
  return music;
};

/**
 * Stop background music
 * @param {string} key - Unique identifier for the music
 */
export const stopMusic = (key) => {
  const music = assetCache.music[key];
  if (!music) return;
  
  music.pause();
  music.currentTime = 0;
};

/**
 * Preload multiple game assets
 * @param {Object} assets - Object containing assets to preload
 * @param {Object} assets.sounds - Object mapping sound keys to paths
 * @param {Object} assets.sprites - Object mapping sprite keys to paths
 * @param {Object} assets.music - Object mapping music keys to paths
 * @returns {Promise<void>} - Promise that resolves when all assets are loaded
 */
export const preloadAssets = async (assets) => {
  const promises = [];
  
  // Preload sounds
  if (assets.sounds) {
    Object.entries(assets.sounds).forEach(([key, path]) => {
      promises.push(loadSound(key, path));
    });
  }
  
  // Preload sprites
  if (assets.sprites) {
    Object.entries(assets.sprites).forEach(([key, path]) => {
      promises.push(loadSprite(key, path));
    });
  }
  
  // Preload music
  if (assets.music) {
    Object.entries(assets.music).forEach(([key, path]) => {
      promises.push(loadMusic(key, path));
    });
  }
  
  // Wait for all assets to load
  await Promise.allSettled(promises);
  console.log('Assets preloaded');
};

// Export the asset cache for debugging
export const getAssetCache = () => assetCache;
