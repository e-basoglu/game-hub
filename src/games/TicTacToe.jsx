import React, { useState, useEffect, useCallback } from 'react';

const TicTacToe = ({ user }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [isAITurn, setIsAITurn] = useState(false);

  // Check for winner
  const calculateWinner = useCallback((squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }, []);

  // Check for draw
  const isDraw = useCallback((squares) => {
    return squares.every(square => square !== null);
  }, []);

  // Simple AI move
  const makeAIMove = useCallback((currentBoard) => {
    const availableMoves = currentBoard
      .map((square, index) => square === null ? index : null)
      .filter(index => index !== null);
    
    if (availableMoves.length > 0) {
      const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      return randomMove;
    }
    return null;
  }, []);

  // Handle click on square
  const handleClick = useCallback((i) => {
    if (winner || board[i] || gameOver || isAITurn) return;

    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);

    const newWinner = calculateWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      setGameOver(true);
    } else if (isDraw(newBoard)) {
      setGameOver(true);
    } else {
      // AI's turn
      setIsAITurn(true);
    }
  }, [board, xIsNext, winner, gameOver, isAITurn, calculateWinner, isDraw]);

  // AI move effect
  useEffect(() => {
    if (isAITurn && !gameOver && !winner) {
      const timer = setTimeout(() => {
        const aiMove = makeAIMove(board);
        if (aiMove !== null) {
          const newBoard = board.slice();
          newBoard[aiMove] = xIsNext ? 'X' : 'O';
          setBoard(newBoard);
          setXIsNext(!xIsNext);
          
          const newWinner = calculateWinner(newBoard);
          if (newWinner) {
            setWinner(newWinner);
            setGameOver(true);
          } else if (isDraw(newBoard)) {
            setGameOver(true);
          }
        }
        setIsAITurn(false);
      }, 500); // AI delay for better UX

      return () => clearTimeout(timer);
    }
  }, [isAITurn, board, xIsNext, gameOver, winner, makeAIMove, calculateWinner, isDraw]);

  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setGameOver(false);
    setIsAITurn(false);
  };

  const status = winner 
    ? `Winner: ${winner}` 
    : gameOver 
    ? 'Game is a draw!' 
    : isAITurn
    ? 'AI is thinking...'
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  const renderSquare = (i) => (
    <button
      key={i}
      className="w-20 h-20 border-2 border-gray-300 text-2xl font-bold bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      onClick={() => handleClick(i)}
      disabled={winner || board[i] || gameOver || isAITurn}
    >
      {board[i]}
    </button>
  );

  return (
    <div className="flex flex-col items-center space-y-6 p-8 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tic Tac Toe</h2>
        <p className="text-gray-600 mb-4">Play against the AI!</p>
        <div className="text-lg font-semibold text-blue-600 mb-4">{status}</div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {Array(9).fill(null).map((_, i) => renderSquare(i))}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={resetGame}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-300"
        >
          New Game
        </button>
      </div>

      {/* Game Over Overlay */}
      {(winner || gameOver) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {winner ? 'Game Over!' : 'Draw!'}
            </h3>
            {winner && (
              <p className="text-xl text-blue-600 mb-4">
                {winner} wins!
              </p>
            )}
            <button
              onClick={resetGame}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-300"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;
