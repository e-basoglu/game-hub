import React, { useState, useEffect, useCallback } from 'react';

// Tetris pieces
const PIECES = [
  // I piece
  [[1, 1, 1, 1]],
  // O piece
  [[1, 1], [1, 1]],
  // T piece
  [[0, 1, 0], [1, 1, 1]],
  // S piece
  [[0, 1, 1], [1, 1, 0]],
  // Z piece
  [[1, 1, 0], [0, 1, 1]],
  // J piece
  [[1, 0, 0], [1, 1, 1]],
  // L piece
  [[0, 0, 1], [1, 1, 1]]
];

const COLORS = [
  'bg-cyan-500', 'bg-yellow-500', 'bg-purple-500', 
  'bg-green-500', 'bg-red-500', 'bg-blue-500', 'bg-orange-500'
];

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 25;

function createEmptyBoard() {
  return Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
}

function createPiece() {
  const pieceIndex = Math.floor(Math.random() * PIECES.length);
  return {
    shape: PIECES[pieceIndex],
    color: COLORS[pieceIndex],
    x: Math.floor(BOARD_WIDTH / 2) - Math.floor(PIECES[pieceIndex][0].length / 2),
    y: 0
  };
}

const Tetris = ({ user }) => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  function isValidMove(piece, newX, newY, newShape = piece.shape) {
    for (let y = 0; y < newShape.length; y++) {
      for (let x = 0; x < newShape[y].length; x++) {
        if (newShape[y][x]) {
          const boardX = newX + x;
          const boardY = newY + y;
          
          if (boardX < 0 || boardX >= BOARD_WIDTH || 
              boardY >= BOARD_HEIGHT || 
              (boardY >= 0 && board[boardY][boardX])) {
            return false;
          }
        }
      }
    }
    return true;
  }

  function placePiece(piece) {
    const newBoard = board.map(row => [...row]);
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = piece.y + y;
          const boardX = piece.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = piece.color;
          }
        }
      }
    }
    
    setBoard(newBoard);
    checkLines(newBoard);
    spawnNewPiece();
  }

  function checkLines(boardToCheck) {
    let linesCleared = 0;
    const newBoard = boardToCheck.filter(row => {
      const isFull = row.every(cell => cell !== 0);
      if (isFull) {
        linesCleared++;
        return false;
      }
      return true;
    });

    if (linesCleared > 0) {
      // Add empty rows at the top
      for (let i = 0; i < linesCleared; i++) {
        newBoard.unshift(Array(BOARD_WIDTH).fill(0));
      }
      
      setBoard(newBoard);
      setLines(prev => prev + linesCleared);
      setScore(prev => prev + linesCleared * 100 * level);
      
      // Level up every 10 lines
      if (Math.floor((lines + linesCleared) / 10) > Math.floor(lines / 10)) {
        setLevel(prev => prev + 1);
      }
    }
  }

  function spawnNewPiece() {
    const newPiece = createPiece();
    if (!isValidMove(newPiece, newPiece.x, newPiece.y)) {
      setGameOver(true);
      return;
    }
    setCurrentPiece(newPiece);
  }

  function movePiece(dx, dy) {
    if (!currentPiece || gameOver) return;
    
    const newX = currentPiece.x + dx;
    const newY = currentPiece.y + dy;
    
    if (isValidMove(currentPiece, newX, newY)) {
      setCurrentPiece({ ...currentPiece, x: newX, y: newY });
    } else if (dy > 0) {
      // Piece has landed
      placePiece(currentPiece);
    }
  }

  function rotatePiece() {
    if (!currentPiece || gameOver) return;
    
    const rotated = currentPiece.shape[0].map((_, i) => 
      currentPiece.shape.map(row => row[i]).reverse()
    );
    
    if (isValidMove(currentPiece, currentPiece.x, currentPiece.y, rotated)) {
      setCurrentPiece({ ...currentPiece, shape: rotated });
    }
  }

  function dropPiece() {
    if (!currentPiece || gameOver) return;
    
    let newY = currentPiece.y;
    while (isValidMove(currentPiece, currentPiece.x, newY + 1)) {
      newY++;
    }
    setCurrentPiece({ ...currentPiece, y: newY });
  }

  function handleKeyPress(e) {
    if (!gameStarted || gameOver) return;
    
    // Prevent default browser behavior for game keys
    if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '].includes(e.key)) {
      e.preventDefault();
    }
    
    switch (e.key) {
      case 'ArrowLeft':
        movePiece(-1, 0);
        break;
      case 'ArrowRight':
        movePiece(1, 0);
        break;
      case 'ArrowDown':
        movePiece(0, 1);
        break;
      case 'ArrowUp':
        rotatePiece();
        break;
      case ' ':
        dropPiece();
        break;
      default:
        break;
    }
  }

  function startGame() {
    setBoard(createEmptyBoard());
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
    setGameStarted(true);
    spawnNewPiece();
  }

  function resetGame() {
    setGameStarted(false);
    setBoard(createEmptyBoard());
    setCurrentPiece(null);
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
  }

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const interval = setInterval(() => {
      movePiece(0, 1);
    }, 1000 - (level - 1) * 50);
    
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, level, currentPiece]);

  // Keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, currentPiece]);

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.y + y;
            const boardX = currentPiece.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        }
      }
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={x}
            className={`w-6 h-6 border border-gray-300 ${
              cell ? cell : 'bg-gray-100'
            }`}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-8 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tetris</h2>
        <p className="text-gray-600 mb-4">Stack the blocks and clear lines!</p>
      </div>

      <div className="flex space-x-8">
        {/* Game Board */}
        <div className="border-2 border-gray-400 bg-gray-100">
          {renderBoard()}
        </div>

        {/* Game Info */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-gray-600">Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{level}</div>
            <div className="text-sm text-gray-600">Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{lines}</div>
            <div className="text-sm text-gray-600">Lines</div>
          </div>
          
          <div className="text-sm text-gray-600 space-y-1">
            <p>← → Move</p>
            <p>↓ Soft Drop</p>
            <p>↑ Rotate</p>
            <p>Space Hard Drop</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        {!gameStarted ? (
          <button
            onClick={startGame}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-300"
          >
            Start Game
          </button>
        ) : (
          <button
            onClick={resetGame}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-300"
          >
            Reset Game
          </button>
        )}
      </div>

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Game Over!</h3>
            <p className="text-gray-600 mb-4">Final Score: {score}</p>
            <p className="text-gray-600 mb-4">Level: {level} | Lines: {lines}</p>
            <button
              onClick={resetGame}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-300"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Start Game Overlay */}
      {!gameStarted && !gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Tetris</h3>
            <p className="text-gray-600 mb-4">Press Start to begin!</p>
            <div className="text-sm text-gray-500 space-y-1 mb-4">
              <p>← → to move</p>
              <p>↑ to rotate</p>
              <p>↓ to soft drop</p>
              <p>Space to hard drop</p>
            </div>
            <button
              onClick={startGame}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-300"
            >
              Start Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tetris;
