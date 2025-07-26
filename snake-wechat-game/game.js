// WeChat Mini-Game Entry Point
// Complete Snake Game with Audio System

console.log('Initializing Snake Game...');

// Audio System Class
class AudioSystem {
  constructor() {
    this.bgMusic = null;
    this.soundEffects = {};
    this.musicEnabled = true;
    this.soundEnabled = true;
    this.musicVolume = 0.6;
    this.soundVolume = 0.8;
    this.currentBgMusic = null;
    
    this.initAudio();
    this.loadSettings();
  }

  initAudio() {
    try {
      // Initialize background music
      this.bgMusic = {
        menu: wx.createInnerAudioContext(),
        game: wx.createInnerAudioContext(),
        gameOver: wx.createInnerAudioContext()
      };

      // Set up background music (using placeholder URLs - you can replace with actual music files)
      this.bgMusic.menu.src = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';
      this.bgMusic.menu.loop = true;
      this.bgMusic.menu.volume = this.musicVolume;

      this.bgMusic.game.src = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';
      this.bgMusic.game.loop = true;
      this.bgMusic.game.volume = this.musicVolume;

      this.bgMusic.gameOver.src = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';
      this.bgMusic.gameOver.loop = false;
      this.bgMusic.gameOver.volume = this.musicVolume;

      // Initialize sound effects
      this.soundEffects = {
        eat: wx.createInnerAudioContext(),
        gameOver: wx.createInnerAudioContext(),
        click: wx.createInnerAudioContext()
      };

      // Set up sound effects (using placeholder URLs)
      this.soundEffects.eat.src = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';
      this.soundEffects.eat.volume = this.soundVolume;

      this.soundEffects.gameOver.src = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';
      this.soundEffects.gameOver.volume = this.soundVolume;

      this.soundEffects.click.src = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';
      this.soundEffects.click.volume = this.soundVolume * 0.5;

      console.log('🔊 Audio system initialized');
    } catch (error) {
      console.log('🔊 Audio initialization failed:', error);
      // Fallback to vibration only
      this.musicEnabled = false;
      this.soundEnabled = false;
    }
  }

  loadSettings() {
    try {
      const audioSettings = wx.getStorageSync('audioSettings');
      if (audioSettings) {
        this.musicEnabled = audioSettings.musicEnabled !== false;
        this.soundEnabled = audioSettings.soundEnabled !== false;
        this.musicVolume = audioSettings.musicVolume || 0.6;
        this.soundVolume = audioSettings.soundVolume || 0.8;
      }
    } catch (error) {
      console.log('🔊 Failed to load audio settings');
    }
  }

  saveSettings() {
    try {
      wx.setStorageSync('audioSettings', {
        musicEnabled: this.musicEnabled,
        soundEnabled: this.soundEnabled,
        musicVolume: this.musicVolume,
        soundVolume: this.soundVolume
      });
    } catch (error) {
      console.log('🔊 Failed to save audio settings');
    }
  }

  playBackgroundMusic(type) {
    if (!this.musicEnabled || !this.bgMusic) return;

    try {
      // Stop current background music
      if (this.currentBgMusic) {
        this.currentBgMusic.stop();
      }

      // Play new background music
      if (this.bgMusic[type]) {
        this.currentBgMusic = this.bgMusic[type];
        this.currentBgMusic.play();
        console.log(`🔊 Playing background music: ${type}`);
      }
    } catch (error) {
      console.log('🔊 Failed to play background music:', error);
    }
  }

  stopBackgroundMusic() {
    if (this.currentBgMusic) {
      try {
        this.currentBgMusic.stop();
        this.currentBgMusic = null;
        console.log('🔊 Background music stopped');
      } catch (error) {
        console.log('🔊 Failed to stop background music:', error);
      }
    }
  }

  playSound(type) {
    if (!this.soundEnabled || !this.soundEffects[type]) return;

    try {
      // Reset and play sound effect
      this.soundEffects[type].seek(0);
      this.soundEffects[type].play();
      console.log(`🔊 Playing sound effect: ${type}`);
    } catch (error) {
      console.log('🔊 Failed to play sound effect:', error);
      // Fallback to vibration
      if (type === 'eat') {
        wx.vibrateShort();
      } else if (type === 'gameOver') {
        wx.vibrateLong();
      }
    }
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (!this.musicEnabled) {
      this.stopBackgroundMusic();
    }
    this.saveSettings();
    return this.musicEnabled;
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    this.saveSettings();
    return this.soundEnabled;
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.bgMusic) {
      Object.values(this.bgMusic).forEach(audio => {
        if (audio) audio.volume = this.musicVolume;
      });
    }
    this.saveSettings();
  }

  setSoundVolume(volume) {
    this.soundVolume = Math.max(0, Math.min(1, volume));
    if (this.soundEffects) {
      Object.values(this.soundEffects).forEach(audio => {
        if (audio) audio.volume = this.soundVolume;
      });
    }
    this.saveSettings();
  }

  destroy() {
    try {
      this.stopBackgroundMusic();
      
      if (this.bgMusic) {
        Object.values(this.bgMusic).forEach(audio => {
          if (audio) audio.destroy();
        });
      }
      
      if (this.soundEffects) {
        Object.values(this.soundEffects).forEach(audio => {
          if (audio) audio.destroy();
        });
      }
      
      console.log('🔊 Audio system destroyed');
    } catch (error) {
      console.log('🔊 Failed to destroy audio system:', error);
    }
  }
}

// Game Engine Class
class GameEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.scenes = new Map();
    this.currentScene = null;
    this.systems = new Map();
    this.running = false;
    this.lastTime = 0;
    
    console.log('Canvas size:', wx.getSystemInfoSync().screenWidth, 'x', wx.getSystemInfoSync().screenHeight);
  }

  init() {
    try {
      // Create canvas
      this.canvas = wx.createCanvas();
      this.ctx = this.canvas.getContext('2d');
      
      const systemInfo = wx.getSystemInfoSync();
      this.canvas.width = systemInfo.screenWidth;
      this.canvas.height = systemInfo.screenHeight;
      
      console.log('Game initialized successfully!');
      console.log('Canvas size:', this.canvas.width, 'x', this.canvas.height);
      
      // Initialize systems
      this.initSystems();
      
      // Initialize scenes
      this.initScenes();
      
      // Start with menu scene
      this.switchScene('menu');
      
      // Start game loop
      this.start();
      
      console.log('Game shown');
      
    } catch (error) {
      console.error('Game initialization failed:', error);
    }
  }

  initSystems() {
    // Input System
    this.systems.set('input', new InputSystem());
    
    // Storage System  
    this.systems.set('storage', new StorageSystem());
    
    // Audio System
    this.systems.set('audio', new AudioSystem());
  }

  initScenes() {
    console.log('Initializing scenes...');
    
    // Create and register scenes
    this.scenes.set('menu', new MenuScene(this));
    this.scenes.set('game', new GameScene(this));
    this.scenes.set('gameOver', new GameOverScene(this));
    
    console.log('Scenes initialized:', Array.from(this.scenes.keys()));
  }

  getSystem(name) {
    return this.systems.get(name);
  }

  switchScene(sceneName, data = {}) {
    console.log('Switching to scene:', sceneName);
    
    if (this.currentScene) {
      this.currentScene.destroy?.();
    }
    
    const scene = this.scenes.get(sceneName);
    if (scene) {
      this.currentScene = scene;
      scene.init(data);
      
      // Play appropriate background music
      const audio = this.getSystem('audio');
      if (audio) {
        audio.playBackgroundMusic(sceneName);
      }
      
      console.log('Scene switched to:', sceneName);
    } else {
      console.error('Scene not found:', sceneName);
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = Date.now();
    this.gameLoop();
  }

  gameLoop() {
    if (!this.running) return;
    
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    // Update current scene
    if (this.currentScene) {
      this.currentScene.update?.(deltaTime);
      this.currentScene.render?.(this.ctx);
    }
    
    requestAnimationFrame(() => this.gameLoop());
  }

  destroy() {
    const audio = this.getSystem('audio');
    if (audio) {
      audio.destroy();
    }
  }
}

// Input System
class InputSystem {
  constructor() {
    this.listeners = new Map();
    this.setupInput();
  }

  setupInput() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    wx.onTouchStart((e) => {
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartTime = Date.now();
    });

    wx.onTouchEnd((e) => {
      const touch = e.changedTouches[0];
      const touchEndX = touch.clientX;
      const touchEndY = touch.clientY;
      const touchEndTime = Date.now();
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const deltaTime = touchEndTime - touchStartTime;
      
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance > 30 && deltaTime < 500) {
        // Swipe gesture
        let direction;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          direction = deltaX > 0 ? 'right' : 'left';
        } else {
          direction = deltaY > 0 ? 'down' : 'up';
        }
        
        this.emit('swipe', { direction, deltaX, deltaY });
      } else {
        // Tap gesture
        this.emit('tap', { x: touchEndX, y: touchEndY });
      }
    });
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }
}

// Storage System
class StorageSystem {
  constructor() {
    this.highScore = this.getHighScore();
  }

  getHighScore() {
    try {
      return wx.getStorageSync('highScore') || 0;
    } catch (error) {
      return 0;
    }
  }

  saveHighScore(score) {
    if (score > this.highScore) {
      this.highScore = score;
      try {
        wx.setStorageSync('highScore', score);
      } catch (error) {
        console.error('Failed to save high score:', error);
      }
    }
  }

  addRecentScore(score) {
    try {
      let recentScores = wx.getStorageSync('recentScores') || [];
      recentScores.unshift(score);
      recentScores = recentScores.slice(0, 10);
      wx.setStorageSync('recentScores', recentScores);
    } catch (error) {
      console.error('Failed to save recent score:', error);
    }
  }
}

// Menu Scene
class MenuScene {
  constructor(engine) {
    this.engine = engine;
    this.name = 'menu';
    this.audioButton = null;
  }

  init() {
    console.log('MenuScene initialized');
    
    // Setup audio button
    const canvas = this.engine.canvas;
    this.audioButton = {
      x: canvas.width - 120,
      y: 20,
      width: 40,
      height: 40
    };
    
    const input = this.engine.getSystem('input');
    if (input) {
      input.on('tap', (data) => {
        const audio = this.engine.getSystem('audio');
        
        // Check if audio button was tapped
        if (this.isPointInButton(data.x, data.y, this.audioButton)) {
          if (audio) {
            audio.toggleMusic();
            audio.playSound('click');
          }
          return;
        }
        
        // Start game
        if (audio) {
          audio.playSound('click');
        }
        console.log('Game started!');
        this.engine.switchScene('game');
      });
    }
  }

  isPointInButton(x, y, button) {
    return x >= button.x && x <= button.x + button.width && 
           y >= button.y && y <= button.y + button.height;
  }

  render(ctx) {
    const canvas = this.engine.canvas;
    
    // Background
    ctx.fillStyle = '#1B4332';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Snake emoji and title
    ctx.fillStyle = '#FFD60A';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🐍', canvas.width / 2 - 60, canvas.height / 2 - 100);
    
    ctx.fillStyle = '#40916C';
    ctx.font = 'bold 48px Arial';
    ctx.fillText('SNAKE', canvas.width / 2 + 40, canvas.height / 2 - 100);
    
    // High score
    const storage = this.engine.getSystem('storage');
    const highScore = storage ? storage.highScore : 0;
    ctx.fillStyle = '#FFD60A';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Best Score: ${highScore}`, canvas.width / 2, canvas.height / 2 - 20);
    
    // Instructions
    ctx.fillStyle = '#B7E4C7';
    ctx.font = '18px Arial';
    ctx.fillText('Swipe to control snake direction', canvas.width / 2, canvas.height / 2 + 60);
    ctx.fillText('Tap to start game', canvas.width / 2, canvas.height / 2 + 90);
    
    // Audio button
    const audio = this.engine.getSystem('audio');
    if (audio) {
      ctx.fillStyle = 'rgba(64, 145, 108, 0.8)';
      ctx.fillRect(this.audioButton.x, this.audioButton.y, this.audioButton.width, this.audioButton.height);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        audio.musicEnabled ? '🔊' : '🔇',
        this.audioButton.x + this.audioButton.width / 2,
        this.audioButton.y + this.audioButton.height / 2 + 8
      );
    }
  }

  destroy() {
    const input = this.engine.getSystem('input');
    if (input) {
      input.off('tap', this.handleTap);
    }
  }
}

// Game Scene - Complete implementation
class GameScene {
  constructor(engine) {
    console.log('🎮 GameScene constructor called');
    this.engine = engine;
    this.name = 'game';
    this.snake = null;
    this.food = null;
    this.score = 0;
    this.gameState = 'ready';
    this.gameTime = 0;
    this.gridSize = 20;
    this.gridWidth = 0;
    this.gridHeight = 0;
    this.backgroundColor = '#1B4332';
    this.gridColor = 'rgba(64, 145, 108, 0.1)';
    this.pauseButton = null;
    this.audioButton = null;
    this.lastMoveTime = 0;
    this.moveInterval = 200;
  }

  init(data) {
    console.log('🎮 GameScene.init() - Starting initialization');
    try {
      this.setupGrid();
      this.initializeEntities();
      this.setupInput();
      this.initializeUI();
      this.resetGame();
      console.log('🎮 GameScene.init() - Initialization complete!');
    } catch (error) {
      console.error('🎮 GameScene.init() - Error:', error);
    }
  }

  setupGrid() {
    console.log('🎮 setupGrid() - Starting grid setup');
    const canvas = this.engine.canvas;
    console.log('🎮 setupGrid() - Canvas size:', canvas.width, 'x', canvas.height);
    this.gridWidth = Math.floor(canvas.width / this.gridSize);
    this.gridHeight = Math.floor(canvas.height / this.gridSize);
    console.log('🎮 setupGrid() - Grid dimensions:', this.gridWidth, 'x', this.gridHeight);
  }

  initializeEntities() {
    console.log('🎮 initializeEntities() - Starting entity initialization');
    const centerX = Math.floor(this.gridWidth / 2);
    const centerY = Math.floor(this.gridHeight / 2);
    
    this.snake = {
      body: [
        { x: centerX, y: centerY },
        { x: centerX - 1, y: centerY },
        { x: centerX - 2, y: centerY }
      ],
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      alive: true,
      growing: false
    };
    
    this.food = { x: 0, y: 0, size: this.gridSize };
    this.generateFood();
    console.log('🎮 initializeEntities() - Entities initialized');
    console.log('🎮 initializeEntities() - Snake:', this.snake.body);
    console.log('🎮 initializeEntities() - Food:', this.food);
  }

  setupInput() {
    console.log('🎮 setupInput() - Setting up input handlers');
    const input = this.engine.getSystem('input');
    if (!input) {
      console.error('🎮 setupInput() - Input system not found!');
      return;
    }
    
    input.on('swipe', (data) => {
      console.log('🎮 Input - Swipe detected:', data.direction);
      this.handleSwipe(data.direction);
    });
    
    input.on('tap', (data) => {
      console.log('🎮 Input - Tap detected at:', data.x, data.y);
      this.handleTap(data.x, data.y);
    });
  }

  initializeUI() {
    const canvas = this.engine.canvas;
    this.pauseButton = {
      x: canvas.width - 60,
      y: 20,
      width: 40,
      height: 40,
      text: '⏸️'
    };
    
    this.audioButton = {
      x: canvas.width - 120,
      y: 20,
      width: 40,
      height: 40
    };
  }

  handleSwipe(direction) {
    console.log('🎮 handleSwipe() - Direction:', direction, 'State:', this.gameState);
    
    if (this.gameState !== 'playing') {
      if (this.gameState === 'ready') {
        console.log('🎮 handleSwipe() - Starting game from ready state');
        this.startGame();
      }
      return;
    }
    
    let directionVector;
    switch (direction) {
      case 'up': directionVector = { x: 0, y: -1 }; break;
      case 'down': directionVector = { x: 0, y: 1 }; break;
      case 'left': directionVector = { x: -1, y: 0 }; break;
      case 'right': directionVector = { x: 1, y: 0 }; break;
      default: return;
    }
    
    if (directionVector.x !== -this.snake.direction.x || directionVector.y !== -this.snake.direction.y) {
      this.snake.nextDirection = directionVector;
      console.log('🎮 handleSwipe() - Direction changed to:', directionVector);
    }
  }

  handleTap(x, y) {
    console.log('🎮 handleTap() - Position:', x, y, 'State:', this.gameState);
    
    const audio = this.engine.getSystem('audio');
    
    // Check audio button
    if (this.isPointInButton(x, y, this.audioButton)) {
      if (audio) {
        audio.toggleMusic();
        audio.playSound('click');
      }
      return;
    }
    
    // Check pause button
    if (this.isPointInButton(x, y, this.pauseButton)) {
      this.togglePause();
      if (audio) {
        audio.playSound('click');
      }
      return;
    }
    
    if (this.gameState === 'ready') {
      console.log('🎮 handleTap() - Starting game from ready state');
      this.startGame();
    } else if (this.gameState === 'gameOver') {
      this.restartGame();
    }
  }

  isPointInButton(x, y, button) {
    return x >= button.x && x <= button.x + button.width && 
           y >= button.y && y <= button.y + button.height;
  }

  startGame() {
    console.log('🎮 startGame() - Called, current state:', this.gameState);
    this.gameState = 'playing';
    this.lastMoveTime = 0;
    console.log('🎮 startGame() - New state:', this.gameState);
    console.log('🎮 startGame() - Snake body:', this.snake.body);
    console.log('🎮 startGame() - Food position:', this.food);
  }

  togglePause() {
    if (this.gameState === 'playing') {
      this.gameState = 'paused';
    } else if (this.gameState === 'paused') {
      this.gameState = 'playing';
    }
  }

  resetGame() {
    console.log('🎮 resetGame() - Resetting game state');
    this.score = 0;
    this.gameTime = 0;
    this.gameState = 'ready';
    this.lastMoveTime = 0;
    
    const centerX = Math.floor(this.gridWidth / 2);
    const centerY = Math.floor(this.gridHeight / 2);
    
    this.snake = {
      body: [
        { x: centerX, y: centerY },
        { x: centerX - 1, y: centerY },
        { x: centerX - 2, y: centerY }
      ],
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      alive: true,
      growing: false
    };
    
    this.generateFood();
  }

  restartGame() {
    this.resetGame();
    this.startGame();
  }

  generateFood() {
    do {
      this.food.x = Math.floor(Math.random() * this.gridWidth);
      this.food.y = Math.floor(Math.random() * this.gridHeight);
    } while (this.isPositionOnSnake(this.food.x, this.food.y));
    
    console.log('🎮 generateFood() - Food generated at:', this.food.x, this.food.y);
  }

  isPositionOnSnake(x, y) {
    return this.snake.body.some(segment => segment.x === x && segment.y === y);
  }

  gameOver() {
    console.log('🎮 gameOver() - Game over triggered');
    this.gameState = 'gameOver';
    this.snake.alive = false;
    
    const storage = this.engine.getSystem('storage');
    if (storage) {
      storage.saveHighScore(this.score);
      storage.addRecentScore(this.score);
    }
    
    const audio = this.engine.getSystem('audio');
    if (audio) {
      audio.playSound('gameOver');
    } else {
      // Fallback to vibration
      try {
        wx.vibrateLong();
      } catch (error) {
        console.log('🎮 gameOver() - Vibration not supported');
      }
    }
  }

  update(deltaTime) {
    if (Math.random() < 0.01) {
      console.log('🎮 update() - State:', this.gameState, 'DeltaTime:', deltaTime);
    }
    
    if (this.gameState === 'playing') {
      this.gameTime += deltaTime;
      this.lastMoveTime += deltaTime;
      
      if (this.lastMoveTime >= this.moveInterval) {
        console.log('🎮 update() - Moving snake');
        this.moveSnake();
        this.checkCollisions();
        this.lastMoveTime = 0;
      }
    }
  }

  moveSnake() {
    if (!this.snake.alive) return;
    
    this.snake.direction = { ...this.snake.nextDirection };
    const head = { ...this.snake.body[0] };
    head.x += this.snake.direction.x;
    head.y += this.snake.direction.y;
    
    this.snake.body.unshift(head);
    
    if (!this.snake.growing) {
      this.snake.body.pop();
    } else {
      this.snake.growing = false;
    }
  }

  checkCollisions() {
    if (!this.snake.alive) return;
    
    const head = this.snake.body[0];
    
    if (head.x < 0 || head.x >= this.gridWidth || head.y < 0 || head.y >= this.gridHeight) {
      console.log('🎮 checkCollisions() - Wall collision');
      this.gameOver();
      return;
    }
    
    for (let i = 1; i < this.snake.body.length; i++) {
      if (head.x === this.snake.body[i].x && head.y === this.snake.body[i].y) {
        console.log('🎮 checkCollisions() - Self collision');
        this.gameOver();
        return;
      }
    }
    
    if (head.x === this.food.x && head.y === this.food.y) {
      console.log('🎮 checkCollisions() - Food collision');
      this.score += 10;
      this.snake.growing = true;
      this.generateFood();
      
      const audio = this.engine.getSystem('audio');
      if (audio) {
        audio.playSound('eat');
      } else {
        // Fallback to vibration
        try {
          wx.vibrateShort();
        } catch (error) {
          // Vibration not supported
        }
      }
      
      this.moveInterval = Math.max(100, this.moveInterval - 2);
    }
  }

  render(ctx) {
    if (Math.random() < 0.005) {
      console.log('🎮 render() - Rendering scene, state:', this.gameState);
    }
    
    const canvas = this.engine.canvas;
    
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (this.gameState === 'ready') {
      this.renderGrid(ctx);
    }
    
    this.renderSnake(ctx);
    this.renderFood(ctx);
    this.renderUI(ctx, canvas);
    this.renderOverlay(ctx, canvas);
  }

  renderGrid(ctx) {
    ctx.strokeStyle = this.gridColor;
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= this.engine.canvas.width; x += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.engine.canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= this.engine.canvas.height; y += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.engine.canvas.width, y);
      ctx.stroke();
    }
  }

  renderSnake(ctx) {
    if (!this.snake || !this.snake.body) return;
    
    this.snake.body.forEach((segment, index) => {
      const x = segment.x * this.gridSize;
      const y = segment.y * this.gridSize;
      
      if (index === 0) {
        ctx.fillStyle = '#52B788';
      } else {
        const alpha = Math.max(1 - (index * 0.05), 0.4);
        ctx.fillStyle = `rgba(64, 145, 108, ${alpha})`;
      }
      
      ctx.fillRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2);
      
      if (index === 0) {
        ctx.fillStyle = '#FFFFFF';
        const eyeSize = 3;
        ctx.fillRect(x + 4, y + 4, eyeSize, eyeSize);
        ctx.fillRect(x + this.gridSize - 7, y + 4, eyeSize, eyeSize);
      }
    });
  }

  renderFood(ctx) {
    if (!this.food) return;
    
    const x = this.food.x * this.gridSize;
    const y = this.food.y * this.gridSize;
    
    ctx.fillStyle = '#FFD60A';
    ctx.fillRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2);
    
    ctx.shadowColor = '#FFD60A';
    ctx.shadowBlur = 10;
    ctx.fillRect(x + 3, y + 3, this.gridSize - 6, this.gridSize - 6);
    ctx.shadowBlur = 0;
  }

  renderUI(ctx, canvas) {
    ctx.fillStyle = '#FFD60A';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${this.score}`, 20, 40);
    
    // Pause button
    if (this.gameState === 'playing' || this.gameState === 'paused') {
      ctx.fillStyle = 'rgba(64, 145, 108, 0.8)';
      ctx.fillRect(this.pauseButton.x, this.pauseButton.y, this.pauseButton.width, this.pauseButton.height);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        this.gameState === 'playing' ? '⏸️' : '▶️',
        this.pauseButton.x + this.pauseButton.width / 2,
        this.pauseButton.y + this.pauseButton.height / 2 + 7
      );
    }
    
    // Audio button
    const audio = this.engine.getSystem('audio');
    if (audio) {
      ctx.fillStyle = 'rgba(64, 145, 108, 0.8)';
      ctx.fillRect(this.audioButton.x, this.audioButton.y, this.audioButton.width, this.audioButton.height);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        audio.musicEnabled ? '🔊' : '🔇',
        this.audioButton.x + this.audioButton.width / 2,
        this.audioButton.y + this.audioButton.height / 2 + 7
      );
    }
  }

  renderOverlay(ctx, canvas) {
    if (this.gameState === 'ready') {
      this.renderReadyOverlay(ctx, canvas);
    } else if (this.gameState === 'paused') {
      this.renderPausedOverlay(ctx, canvas);
    } else if (this.gameState === 'gameOver') {
      this.renderGameOverOverlay(ctx, canvas);
    }
  }

  renderReadyOverlay(ctx, canvas) {
    ctx.fillStyle = 'rgba(27, 67, 50, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#40916C';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Ready to Play?', canvas.width / 2, canvas.height / 2 - 40);
    
    ctx.fillStyle = '#B7E4C7';
    ctx.font = '18px Arial';
    ctx.fillText('Swipe to control snake direction', canvas.width / 2, canvas.height / 2);
    ctx.fillText('Tap anywhere to start', canvas.width / 2, canvas.height / 2 + 30);
  }

  renderPausedOverlay(ctx, canvas) {
    ctx.fillStyle = 'rgba(27, 67, 50, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#40916C';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Paused', canvas.width / 2, canvas.height / 2);
    
    ctx.fillStyle = '#B7E4C7';
    ctx.font = '18px Arial';
    ctx.fillText('Tap pause button to resume', canvas.width / 2, canvas.height / 2 + 40);
  }

  renderGameOverOverlay(ctx, canvas) {
    ctx.fillStyle = 'rgba(27, 67, 50, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#FF6B6B';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 60);
    
    ctx.fillStyle = '#FFD60A';
    ctx.font = 'bold 28px Arial';
    ctx.fillText(`Final Score: ${this.score}`, canvas.width / 2, canvas.height / 2 - 20);
    
    ctx.fillStyle = '#B7E4C7';
    ctx.font = '18px Arial';
    ctx.fillText('Tap to play again', canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText('or go back to menu', canvas.width / 2, canvas.height / 2 + 45);
  }

  destroy() {
    console.log('🎮 destroy() - Cleaning up GameScene');
    const input = this.engine.getSystem('input');
    if (input) {
      input.off('swipe', this.handleSwipe);
      input.off('tap', this.handleTap);
    }
  }
}

// Game Over Scene
class GameOverScene {
  constructor(engine) {
    this.engine = engine;
    this.name = 'gameOver';
    this.score = 0;
  }

  init(data) {
    this.score = data.score || 0;
    
    const input = this.engine.getSystem('input');
    if (input) {
      input.on('tap', () => {
        const audio = this.engine.getSystem('audio');
        if (audio) {
          audio.playSound('click');
        }
        this.engine.switchScene('menu');
      });
    }
  }

  render(ctx) {
    const canvas = this.engine.canvas;
    
    // Background
    ctx.fillStyle = 'rgba(27, 67, 50, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Game Over text
    ctx.fillStyle = '#FF6B6B';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 60);
    
    // Final score
    ctx.fillStyle = '#FFD60A';
    ctx.font = 'bold 32px Arial';
    ctx.fillText(`Final Score: ${this.score}`, canvas.width / 2, canvas.height / 2);
    
    // Instructions
    ctx.fillStyle = '#B7E4C7';
    ctx.font = '18px Arial';
    ctx.fillText('Tap to return to menu', canvas.width / 2, canvas.height / 2 + 60);
  }

  destroy() {
    const input = this.engine.getSystem('input');
    if (input) {
      input.off('tap', this.handleTap);
    }
  }
}

// Initialize game when WeChat Mini-Game starts
const game = new GameEngine();

// WeChat Mini-Game lifecycle
wx.onShow(() => {
  console.log('Game shown');
});

wx.onHide(() => {
  console.log('Game hidden');
  const audio = game.getSystem('audio');
  if (audio) {
    audio.stopBackgroundMusic();
  }
});

// Start the game
game.init();
