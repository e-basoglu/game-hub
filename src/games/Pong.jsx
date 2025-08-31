import React, { useState, useEffect, useCallback } from 'react';

const Pong = ({ user }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [ball, setBall] = useState({ x: 400, y: 300, dx: 4, dy: 4 });
  const [paddle1, setPaddle1] = useState({ y: 250 }); // Player paddle
  const [paddle2, setPaddle2] = useState({ y: 250 }); // AI paddle
  const [gameSpeed, setGameSpeed] = useState(16);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const PADDLE_HEIGHT = 100;
  const PADDLE_WIDTH = 10;
  const BALL_SIZE = 10;

  // AI paddle movement
  const moveAI = useCallback(() => {
    setPaddle2(prev => {
      const paddleCenter = prev.y + PADDLE_HEIGHT / 2;
      const ballCenter = ball.y;
      
      if (paddleCenter < ballCenter - 10) {
        return { y: Math.min(prev.y + 4, CANVAS_HEIGHT - PADDLE_HEIGHT) };
      } else if (paddleCenter > ballCenter + 10) {
        return { y: Math.max(prev.y - 4, 0) };
      }
      return prev;
    });
  }, [ball.y]);

  // Move ball
  const moveBall = useCallback(() => {
    setBall(prev => {
      let newX = prev.x + prev.dx;
      let newY = prev.y + prev.dy;
      let newDx = prev.dx;
      let newDy = prev.dy;

      // Ball hits top or bottom
      if (newY <= 0 || newY >= CANVAS_HEIGHT - BALL_SIZE) {
        newDy = -newDy;
      }

      // Ball hits player paddle (left)
      if (newX <= PADDLE_WIDTH && newY >= paddle1.y && newY <= paddle1.y + PADDLE_HEIGHT) {
        newDx = -newDx;
        // Add some randomness to the bounce
        newDy += (Math.random() - 0.5) * 2;
      }

      // Ball hits AI paddle (right)
      if (newX >= CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE && 
          newY >= paddle2.y && newY <= paddle2.y + PADDLE_HEIGHT) {
        newDx = -newDx;
        // Add some randomness to the bounce
        newDy += (Math.random() - 0.5) * 2;
      }

      // Ball goes past player paddle (AI scores)
      if (newX < 0) {
        setAiScore(prev => prev + 1);
        if (aiScore + 1 >= 11) {
          setGameOver(true);
        } else {
          // Reset ball
          newX = CANVAS_WIDTH / 2;
          newY = CANVAS_HEIGHT / 2;
          newDx = -4;
          newDy = 4;
        }
      }

      // Ball goes past AI paddle (Player scores)
      if (newX > CANVAS_WIDTH) {
        setScore(prev => prev + 1);
        if (score + 1 >= 11) {
          setGameOver(true);
        } else {
          // Reset ball
          newX = CANVAS_WIDTH / 2;
          newY = CANVAS_HEIGHT / 2;
          newDx = 4;
          newDy = 4;
        }
      }

      return { x: newX, y: newY, dx: newDx, dy: newDy };
    });
  }, [paddle1.y, paddle2.y, score, aiScore]);

  // Handle keyboard input
  const handleKeyPress = useCallback((e) => {
    if (!gameStarted || gameOver) return;

    // Prevent default browser behavior for arrow keys
    if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
    }

    setPaddle1(prev => {
      switch (e.key) {
        case 'ArrowUp':
          return { y: Math.max(prev.y - 20, 0) };
        case 'ArrowDown':
          return { y: Math.min(prev.y + 20, CANVAS_HEIGHT - PADDLE_HEIGHT) };
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
      moveAI();
    }, gameSpeed);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, moveBall, moveAI, gameSpeed]);

  // Keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setAiScore(0);
    setBall({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, dx: 4, dy: 4 });
    setPaddle1({ y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 });
    setPaddle2({ y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 });
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setAiScore(0);
    setBall({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, dx: 4, dy: 4 });
    setPaddle1({ y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 });
    setPaddle2({ y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 });
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-8 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Pong</h2>
        <p className="text-gray-600 mb-4">Beat the AI! First to 11 points wins.</p>
        <div className="flex justify-center space-x-8 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-gray-600">You</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{aiScore}</div>
            <div className="text-sm text-gray-600">AI</div>
          </div>
        </div>
      </div>

      <div className="relative border-4 border-white bg-black" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
        {/* Center line */}
        <div className="absolute left-1/2 top-0 w-1 h-full bg-white opacity-50" style={{ transform: 'translateX(-50%)' }}></div>
        
        {/* Top and bottom borders */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-white"></div>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-white"></div>
        
        {/* Player paddle (left) */}
        <div 
          className="absolute bg-blue-500 border border-blue-300"
          style={{
            left: 0,
            top: paddle1.y,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT
          }}
        ></div>

        {/* AI paddle (right) */}
        <div 
          className="absolute bg-red-500 border border-red-300"
          style={{
            right: 0,
            top: paddle2.y,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT
          }}
        ></div>

        {/* Ball */}
        <div 
          className="absolute bg-white rounded-full border border-gray-300"
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
                {score > aiScore ? 'You Win!' : 'AI Wins!'}
              </p>
              <p className="text-gray-600 mb-4">Final Score: {score} - {aiScore}</p>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pong</h3>
              <p className="text-gray-600 mb-4">Use ↑ ↓ to move your paddle</p>
              <div className="text-sm text-gray-500 space-y-1 mb-4">
                <p>First to 11 points wins</p>
                <p>Don't let the ball pass you!</p>
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

export default Pong;
