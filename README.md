# Emoji Pacman

A modern take on the classic Pacman game, built with React and featuring customizable emoji characters. Play as your favorite emoji and chase (or be chased by) emoji ghosts! This version supports both mouse and keyboard controls for a flexible gaming experience.

## 🎮 Game Features

- **Dual Control System**: Choose between mouse or keyboard controls
- **Customizable Characters**: Choose your own emoji for Pacman and each of the four ghosts
- **Modern Design**: Neon-style graphics with smooth animations and visual effects
- **Classic Gameplay**: True to the original Pacman mechanics
- **Power-Up Mode**: Collect power pellets to turn the tables on the ghosts
- **Score Tracking**: Points for dots (10), power pellets (50), and eating ghosts (200)

## 🚀 Live Demo

Try the game at: https://airmig.github.io/EmojiPacMan/

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/airmig/EmojiPacMan.git
cd EmojiPacMan
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎯 How to Play

1. **Start Screen**: 
   - Select your Pacman character from the emoji grid
   - Choose four different emojis for the ghosts
   - Click "Start Game" when ready

2. **Controls**:
   - **Mouse Controls**:
     - Move your mouse cursor in the direction you want Pacman to move
     - Pacman will automatically follow your mouse movement
     - Navigate through the maze by guiding Pacman with your cursor
     - Quick mouse movements allow for fast direction changes
   - **Keyboard Controls**:
     - Use Arrow Keys (↑, ↓, ←, →) to move Pacman
     - Press any arrow key to switch to keyboard controls
     - Click anywhere on the screen to switch back to mouse controls
   - **Control Switching**:
     - The game starts with mouse controls by default
     - You can switch between control methods at any time
     - The last used control method will be remembered

3. **Scoring**:
   - Regular Dot: 10 points
   - Power Pellet: 50 points
   - Eating a Ghost: 200 points

4. **Power-Up Mode**:
   - Collect power pellets in the corners
   - Ghosts become vulnerable for 10 seconds
   - Chase and eat ghosts for bonus points
   - Use quick mouse movements to catch fleeing ghosts

5. **Win Condition**:
   - Collect all dots and power pellets to win
   - Avoid ghosts when not powered up
   - Use strategic mouse movements to escape ghosts

## 🏗️ Technical Details

### Technology Stack
- React 18
- Vite
- CSS3 with modern animations
- GitHub Pages for deployment

### Project Structure
```
EmojiPacMan/
├── src/
│   ├── components/
│   │   ├── Game.jsx         # Main game logic and mouse controls
│   │   ├── Game.css         # Game styles
│   │   └── CharacterSelection.jsx
│   ├── App.jsx             # Root component
│   └── main.jsx            # Entry point
├── public/
└── package.json
```

### Key Components

1. **Game.jsx**:
   - Manages game state and logic
   - Implements mouse-based movement system
   - Controls ghost behavior
   - Manages collisions and scoring
   - Handles mouse event tracking

2. **CharacterSelection.jsx**:
   - Emoji selection interface
   - Character customization
   - Game initialization

### Game Mechanics

- **Dual Control System**:
  - Mouse-based movement with cursor tracking
  - Keyboard controls with arrow keys
  - Seamless switching between control methods
  - Responsive and intuitive controls

- **Ghost Behavior**:
  - Ghosts start in the center "ghost house"
  - Released gradually into the maze
  - Move randomly when not in pursuit
  - Flee from Pacman during power-up mode

- **Collision Detection**:
  - Continuous checking for ghost-pacman collisions
  - Dot collection verification
  - Power pellet activation
  - Wall collision prevention

## 🔧 Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
```

### Deploying to GitHub Pages
```bash
npm run deploy
```

## 📝 License

MIT License - feel free to use and modify for your own projects!

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 🐛 Bug Reports

If you find any bugs or have suggestions, please open an issue on GitHub.

## 🙏 Acknowledgments

- Inspired by the classic Pacman game
- Built with React and modern web technologies
- Special thanks to all contributors
