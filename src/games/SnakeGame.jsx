import React, { useState, useEffect, useCallback } from 'react';

const SnakeGame = ({ user }) => {
  const [snake, setSnake] = useState([[10, 10]]);
  const [food, setFood] = useState([5, 5]);
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(150);

  const BOARD_SIZE = 20;
  const CELL_SIZE = 20;

  // Generate random food position
  const generateFood = useCallback(() => {
    const newFood = [
      Math.floor(Math.random() * BOARD_SIZE),
      Math.floor(Math.random() * BOARD_SIZE)
    ];
    return newFood;
  }, []);

  // Check if position is occupied by snake
  const isSnakeBody = useCallback((pos) => {
    return snake.some(segment => segment[0] === pos[0] && segment[1] === pos[1]);
  }, [snake]);

  // Move snake
  const moveSnake = useCallback(() => {
    if (gameOver || !gameStarted) return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = [...newSnake[0]];

      switch (direction) {
        case 'UP':
          head[1] -= 1;
          break;
        case 'DOWN':
          head[1] += 1;
          break;
        case 'LEFT':
          head[0] -= 1;
          break;
        case 'RIGHT':
          head[0] += 1;
          break;
        default:
          break;
      }

      // Check wall collision
      if (head[0] < 0 || head[0] >= BOARD_SIZE || head[1] < 0 || head[1] >= BOARD_SIZE) {
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (isSnakeBody(head)) {
        setGameOver(true);
        return prevSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head[0] === food[0] && head[1] === food[1]) {
        setScore(prev => prev + 10);
        setFood(generateFood());
        // Increase speed every 50 points
        if ((score + 10) % 50 === 0) {
          setGameSpeed(prev => Math.max(50, prev - 10));
        }
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, gameOver, gameStarted, food, generateFood, isSnakeBody, score]);

  // Handle keyboard input
  const handleKeyPress = useCallback((e) => {
    if (!gameStarted) {
      setGameStarted(true);
      return;
    }

    // Prevent default browser behavior for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }

    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
      default:
        break;
    }
  }, [direction, gameStarted]);

  // Reset game
  const resetGame = () => {
    setSnake([[10, 10]]);
    setFood(generateFood());
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setGameStarted(false);
    setGameSpeed(150);
  };

  // Game loop
  useEffect(() => {
    const gameInterval = setInterval(moveSnake, gameSpeed);
    return () => clearInterval(gameInterval);
  }, [moveSnake, gameSpeed]);

  // Keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="flex flex-col items-center space-y-6 p-8 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Snake Game</h2>
        <p className="text-gray-600 mb-4">Eat the red food to grow longer!</p>
        <div className="flex justify-center space-x-8 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-gray-600">Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{snake.length}</div>
            <div className="text-sm text-gray-600">Length</div>
          </div>
        </div>
      </div>

      <div 
        className="relative border-2 border-gray-300 bg-gray-100"
        style={{
          width: BOARD_SIZE * CELL_SIZE,
          height: BOARD_SIZE * CELL_SIZE
        }}
      >
        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute ${index === 0 ? 'bg-green-700' : 'bg-green-500'} rounded-sm`}
            style={{
              left: segment[0] * CELL_SIZE,
              top: segment[1] * CELL_SIZE,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-red-500 rounded-full"
          style={{
            left: food[0] * CELL_SIZE,
            top: food[1] * CELL_SIZE,
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2
          }}
        />

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Game Over!</h3>
              <p className="text-gray-600 mb-4">Final Score: {score}</p>
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
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Snake Game</h3>
              <p className="text-gray-600 mb-4">Press any arrow key to start!</p>
              <div className="text-sm text-gray-500">
                <p>↑ ↓ ← → to move</p>
                <p>Eat red food to grow</p>
                <p>Avoid walls and yourself</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={resetGame}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-300"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default SnakeGame;
