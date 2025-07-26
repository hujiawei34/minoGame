# Snake WeChat Mini-Game 🐍

A professional-grade Snake game built as a WeChat Mini-Game using modern game engine architecture with performance optimization and modular design.

## 🎮 Features

### Core Gameplay
- **Touch Controls**: Intuitive swipe gestures for snake movement
- **Real-time Movement**: Smooth snake animation with collision detection
- **Food System**: Dynamic food generation with visual effects
- **Scoring System**: Points tracking with persistent high scores
- **Game States**: Menu, gameplay, pause, and game over screens

### Technical Features
- **Game Engine Architecture**: Modular system design with scene management
- **Performance Optimization**: Adaptive FPS, memory management, and render optimization
- **Component-Based Entities**: Snake and Food entities with clean separation of concerns
- **Input Management**: Advanced touch gesture recognition and input handling
- **Audio System**: Sound effects with haptic feedback integration
- **Storage Management**: Persistent data with statistics tracking

## 🏗️ Architecture

### Project Structure
```
snake-wechat-game/
├── game.js                    # Main game entry point
├── game.json                  # WeChat Mini-Game configuration
├── project.config.json        # WeChat Developer Tools config
├── src/
│   ├── core/                  # Core game systems
│   │   ├── GameEngine.js      # Main game engine with performance monitoring
│   │   ├── SceneManager.js    # Scene transitions and lifecycle
│   │   ├── InputManager.js    # Touch input and gesture recognition
│   │   ├── AudioManager.js    # Sound effects and music management
│   │   └── StorageManager.js  # Data persistence and statistics
│   ├── entities/              # Game entities
│   │   ├── Snake.js           # Snake entity with movement and collision
│   │   └── Food.js            # Food entity with animation effects
│   ├── scenes/                # Game scenes
│   │   ├── MenuScene.js       # Main menu with animations
│   │   ├── GameScene.js       # Core gameplay scene
│   │   ├── GameOverScene.js   # Game over with score display
│   │   └── LeaderboardScene.js # High scores and statistics
│   └── utils/                 # Utility modules
│       └── Performance.js     # Performance monitoring and optimization
└── README.md
```

### Core Systems

#### Game Engine
- **60 FPS Game Loop**: Optimized rendering with adaptive performance
- **System Registry**: Modular system architecture for extensibility
- **Performance Monitoring**: Real-time FPS tracking and memory management
- **Adaptive Quality**: Dynamic quality adjustment based on device performance

#### Scene Management
- **Scene Transitions**: Smooth fade transitions between scenes
- **Lifecycle Management**: Proper initialization and cleanup
- **State Persistence**: Scene data preservation during transitions

#### Input System
- **Gesture Recognition**: Advanced swipe detection with configurable thresholds
- **Touch Optimization**: Mobile-first input handling
- **Event System**: Decoupled input event distribution

#### Performance Optimization
- **Memory Management**: Automatic garbage collection and cleanup
- **Object Pooling**: Reusable object instances for better performance
- **Render Optimization**: Dirty region tracking and frame skipping
- **Adaptive Rendering**: Quality scaling based on performance metrics

## 🚀 Setup Instructions

### Prerequisites
- WeChat Developer Tools (latest version)
- WeChat Mini-Game development account

### Installation
1. **Download WeChat Developer Tools**
   ```
   https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
   ```

2. **Import Project**
   - Open WeChat Developer Tools
   - Select "Mini-Game" (小游戏) project type
   - Choose "Import Project" and select the `snake-wechat-game` folder
   - Enter your AppID or use test AppID for development

3. **Configuration**
   - Update `project.config.json` with your actual AppID
   - Ensure game compilation mode is selected

4. **Run and Test**
   - Click "Compile" to build the project
   - Test in simulator and on real devices
   - Use "Preview" to generate QR code for mobile testing

## 🎯 Game Controls

- **Swipe Up**: Move snake upward
- **Swipe Down**: Move snake downward
- **Swipe Left**: Move snake left
- **Swipe Right**: Move snake right
- **Tap**: Interact with UI elements and start game

## 📊 Performance Features

### Monitoring
- Real-time FPS tracking
- Memory usage monitoring
- Render call optimization
- Frame skip detection

### Optimization
- Adaptive quality scaling
- Automatic garbage collection
- Object pooling for entities
- Dirty region rendering

### Memory Management
- Automatic cleanup tasks
- Performance-based quality adjustment
- Resource pooling and reuse

## 🔧 Development

### Adding New Features
```javascript
// Register new system
engine.registerSystem('newSystem', new NewSystem());

// Create new scene
class NewScene {
  init(data) { /* Initialize scene */ }
  update(deltaTime) { /* Update logic */ }
  render(ctx) { /* Render scene */ }
  destroy() { /* Cleanup */ }
}
```

### Performance Tuning
```javascript
// Access performance data
const stats = engine.getPerformanceReport();
console.log('FPS:', stats.engine.fps);
console.log('Memory trend:', stats.monitor.memoryTrend);

// Force cleanup
engine.forceCleanup();
```

### Custom Input Handling
```javascript
// Register input events
inputManager.on('swipe', (data) => {
  console.log('Swipe direction:', data.direction);
});

inputManager.on('tap', (data) => {
  console.log('Tap position:', data.x, data.y);
});
```

## 📈 Game Statistics

The game tracks comprehensive statistics:
- Games played
- Total score accumulated
- Average score per game
- Best score streak
- Total play time
- Performance metrics

## 🎨 Visual Design

### Theme
- **Dark Green Palette**: Professional gaming aesthetic
- **Neon Accents**: Bright green snake with golden food
- **Modern UI**: Clean typography and smooth animations
- **Mobile-First**: Touch-optimized interface design

### Animations
- Snake movement with smooth transitions
- Food pulsing and glow effects
- Scene transition fades
- UI element hover states

## 🔊 Audio System

### Sound Effects
- Food consumption feedback
- Game over notification
- Button interaction sounds
- Achievement celebrations

### Haptic Feedback
- Light vibration for food eating
- Strong vibration for game over
- Subtle feedback for UI interactions

## 📱 WeChat Integration

### Mini-Game Features
- Share score functionality
- WeChat storage integration
- Lifecycle management
- Performance optimization for mobile

### Compliance
- WeChat Mini-Game guidelines adherence
- Proper resource management
- User privacy considerations

## 🚀 Deployment

### Pre-deployment Checklist
- [ ] Test on multiple devices
- [ ] Verify performance on low-end devices
- [ ] Check WeChat compliance
- [ ] Optimize asset sizes
- [ ] Test offline functionality

### Submission Process
1. Complete development and testing
2. Submit for WeChat review
3. Address any compliance issues
4. Publish to WeChat Mini-Game platform

## 🤝 Contributing

This project demonstrates modern game development practices:
- Clean architecture patterns
- Performance optimization techniques
- Mobile-first design principles
- Modular system design

## 📄 License

This project is for educational and demonstration purposes, showcasing professional WeChat Mini-Game development techniques.

---

**Built with ❤️ for WeChat Mini-Game Platform**

*Featuring modern game engine architecture, performance optimization, and professional development practices.*