# Game Hub

A collection of classic single-player games built with React, Vite, and Tailwind CSS.

## Features

- 🎮 **5 Classic Games**: Snake, Tic Tac Toe, Tetris, Pong, and Breakout
- 🚀 Built with React 18 and Vite for fast development
- 🎨 Styled with Tailwind CSS for modern, responsive design
- 📱 Fully responsive design that works on all devices
- ⚡ Fast and optimized build process
- 🎯 Modern UI/UX with smooth animations and transitions
- 👤 User profile system with game statistics tracking

## Games Included

### 🐍 Snake
- Classic snake game with growing mechanics
- Eat food to grow longer and increase your score
- Avoid walls and yourself

### ⭕ Tic Tac Toe
- Strategic X and O game against AI
- Smart AI opponent with random move selection
- Clean, intuitive interface

### 🧩 Tetris
- Block-stacking puzzle game
- Rotate and place pieces to clear lines
- Increasing difficulty with levels

### 🏓 Pong
- Classic paddle and ball game vs AI
- First to 11 points wins
- Smooth ball physics and AI opponent

### 🧱 Breakout
- Block-breaking arcade game
- Break all blocks with your paddle
- Multiple lives and scoring system

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`

### Building for Production

To build the project for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

To preview the production build:

```bash
npm run preview
```

## Project Structure

```
├── public/          # Static assets
├── src/             # Source code
│   ├── components/  # React components
│   │   ├── GameHub.jsx      # Main game selection interface
│   │   └── UserProfile.jsx  # User authentication and stats
│   ├── games/       # Game components
│   │   ├── SnakeGame.jsx    # Snake game
│   │   ├── TicTacToe.jsx    # Tic Tac Toe game
│   │   ├── Tetris.jsx       # Tetris game
│   │   ├── Pong.jsx         # Pong game
│   │   └── Breakout.jsx     # Breakout game
│   ├── App.jsx      # Main application component
│   ├── main.jsx     # Application entry point
│   └── index.css    # Global styles with Tailwind imports
├── index.html       # HTML template
├── package.json     # Dependencies and scripts
├── vite.config.js   # Vite configuration
├── tailwind.config.js # Tailwind CSS configuration
└── postcss.config.js  # PostCSS configuration
```

## Game Controls

### Snake
- **Arrow Keys**: Move the snake in any direction
- **Avoid**: Walls and your own tail

### Tic Tac Toe
- **Mouse Click**: Place X or O on the board
- **AI**: Automatically responds to your moves

### Tetris
- **← →**: Move piece left/right
- **↓**: Soft drop (move down faster)
- **↑**: Rotate piece
- **Space**: Hard drop (instant drop)

### Pong
- **↑ ↓**: Move your paddle up/down
- **Goal**: First to 11 points wins

### Breakout
- **← →**: Move paddle left/right
- **Goal**: Break all blocks before losing all lives

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## License

This project is open source and available under the [MIT License](LICENSE).
