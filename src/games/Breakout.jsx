import React, { useState, useEffect, useCallback } from 'react';

const Breakout = ({ user }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [ball, setBall] = useState({ x: 400, y: 500, dx: 4, dy: -4 });
  const [paddle, setPaddle] = useState({ x: 350 });
  const [blocks, setBlocks] = useState([]);
  const [gameSpeed, setGameSpeed] = useState(16);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const PADDLE_WIDTH = 100;
  const PADDLE_HEIGHT = 10;
  const BALL_SIZE = 8;
  const BLOCK_WIDTH = 80;
  const BLOCK_HEIGHT = 20;
  const BLOCK_ROWS = 5;
  const BLOCK_COLS = 10;

  const COLORS = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500'];

  // Initialize blocks
  const initializeBlocks = useCallback(() => {
    const newBlocks = [];
    for (let row = 0; row < BLOCK_ROWS; row++) {
      for (let col = 0; col < BLOCK_COLS; col++) {
        newBlocks.push({
          x: col * BLOCK_WIDTH,
          y: row * BLOCK_HEIGHT + 50,
          color: COLORS[row],
          visible: true
        });
      }
    }
    return newBlocks;
  }, []);

  // Check collision between ball and rectangle
  const checkCollision = (ball, rect) => {
    return ball.x < rect.x + rect.width &&
           ball.x + BALL_SIZE > rect.x &&
           ball.y < rect.y + rect.height &&
           ball.y + BALL_SIZE > rect.y;
  };

  // Move ball
  const moveBall = useCallback(() => {
    setBall(prev => {
      let newX = prev.x + prev.dx;
      let newY = prev.y + prev.dy;
      let newDx = prev.dx;
      let newDy = prev.dy;

      // Ball hits walls
      if (newX <= 0 || newX >= CANVAS_WIDTH - BALL_SIZE) {
        newDx = -newDx;
      }

      if (newY <= 0) {
        newDy = -newDy;
      }

      // Ball hits paddle
      if (checkCollision(
        { x: newX, y: newY, width: BALL_SIZE, height: BALL_SIZE },
        { x: paddle.x, y: CANVAS_HEIGHT - PADDLE_HEIGHT - 20, width: PADDLE_WIDTH, height: PADDLE_HEIGHT }
      )) {
        newDy = -newDy;
        // Add some angle based on where the ball hits the paddle
        const hitPoint = (newX - paddle.x) / PADDLE_WIDTH;
        newDx = (hitPoint - 0.5) * 8;
      }

      // Ball hits blocks
      setBlocks(prevBlocks => {
        const newBlocks = [...prevBlocks];
        let blockHit = false;

        newBlocks.forEach(block => {
          if (block.visible && checkCollision(
            { x: newX, y: newY, width: BALL_SIZE, height: BALL_SIZE },
            { x: block.x, y: block.y, width: BLOCK_WIDTH, height: BLOCK_HEIGHT }
          )) {
            block.visible = false;
            blockHit = true;
            setScore(prev => prev + 10);
          }
        });

        if (blockHit) {
          newDy = -newDy;
        }

        return newBlocks;
      });

      // Ball goes below paddle
      if (newY > CANVAS_HEIGHT) {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameOver(true);
          } else {
            // Reset ball position
            newX = CANVAS_WIDTH / 2;
            newY = CANVAS_HEIGHT - 100;
            newDx = 4;
            newDy = -4;
          }
          return newLives;
        });
      }

      // Check if all blocks are destroyed
      const remainingBlocks = blocks.filter(block => block.visible);
      if (remainingBlocks.length === 0) {
        setGameOver(true);
      }

      return { x: newX, y: newY, dx: newDx, dy: newDy };
    });
  }, [paddle.x, blocks]);

  // Handle keyboard input
  const handleKeyPress = useCallback((e) => {
    if (!gameStarted || gameOver) return;

    // Prevent default browser behavior for arrow keys
    if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }

    setPaddle(prev => {
      switch (e.key) {
        case 'ArrowLeft':
          return { x: Math.max(prev.x - 20, 0) };
        case 'ArrowRight':
          return { x: Math.min(prev.x + 20, CANVAS_WIDTH - PADDLE_WIDTH) };
        default:
          return prev;
      }
    });
  }, [gameStarted, gameOver]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      moveBall();
    }, gameSpeed);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, moveBall, gameSpeed]);

  // Keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setBall({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 100, dx: 4, dy: -4 });
    setPaddle({ x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2 });
    setBlocks(initializeBlocks());
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setBall({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 100, dx: 4, dy: -4 });
    setPaddle({ x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2 });
    setBlocks(initializeBlocks());
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-8 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Breakout</h2>
        <p className="text-gray-600 mb-4">Break all the blocks with your paddle!</p>
        <div className="flex justify-center space-x-8 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-gray-600">Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{lives}</div>
            <div className="text-sm text-gray-600">Lives</div>
          </div>
        </div>
      </div>

      <div className="relative border-2 border-gray-400 bg-black" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
        {/* Blocks */}
        {blocks.map((block, index) => (
          block.visible && (
            <div
              key={index}
              className={`absolute ${block.color}`}
              style={{
                left: block.x,
                top: block.y,
                width: BLOCK_WIDTH - 2,
                height: BLOCK_HEIGHT - 2
              }}
            ></div>
          )
        ))}

        {/* Paddle */}
        <div 
          className="absolute bg-white"
          style={{
            left: paddle.x,
            top: CANVAS_HEIGHT - PADDLE_HEIGHT - 20,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT
          }}
        ></div>

        {/* Ball */}
        <div 
          className="absolute bg-white rounded-full"
          style={{
            left: ball.x,
            top: ball.y,
            width: BALL_SIZE,
            height: BALL_SIZE
          }}
        ></div>

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Game Over!</h3>
              <p className="text-xl text-blue-600 mb-4">
                {lives > 0 ? 'You Win!' : 'Game Over!'}
              </p>
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
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Breakout</h3>
              <p className="text-gray-600 mb-4">Use ← → to move your paddle</p>
              <div className="text-sm text-gray-500 space-y-1 mb-4">
                <p>Break all blocks to win</p>
                <p>Don't let the ball fall!</p>
                <p>You have 3 lives</p>
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

      <div className="flex space-x-4">
        {gameStarted && !gameOver && (
          <button
            onClick={resetGame}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-300"
          >
            Reset Game
          </button>
        )}
      </div>
    </div>
  );
};

export default Breakout;
