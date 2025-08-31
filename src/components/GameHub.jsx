import React, { useState } from 'react';
import SnakeGame from '../games/SnakeGame';
import TicTacToe from '../games/TicTacToe';
import Tetris from '../games/Tetris';
import Pong from '../games/Pong';
import Breakout from '../games/Breakout';
import UserProfile from './UserProfile';

const GameHub = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [user, setUser] = useState(null);

  const games = [
    {
      id: 'snake',
      name: 'Snake',
      description: 'Classic snake game - eat food to grow longer',
      icon: '🐍',
      component: SnakeGame,
      difficulty: 'Easy',
      category: 'Arcade'
    },
    {
      id: 'tictactoe',
      name: 'Tic Tac Toe',
      description: 'Strategic X and O game against AI',
      icon: '⭕',
      component: TicTacToe,
      difficulty: 'Easy',
      category: 'Strategy'
    },
    {
      id: 'tetris',
      name: 'Tetris',
      description: 'Block-stacking puzzle game',
      icon: '🧩',
      component: Tetris,
      difficulty: 'Medium',
      category: 'Puzzle'
    },
    {
      id: 'pong',
      name: 'Pong',
      description: 'Classic paddle and ball game',
      icon: '🏓',
      component: Pong,
      difficulty: 'Medium',
      category: 'Arcade'
    },
    {
      id: 'breakout',
      name: 'Breakout',
      description: 'Break all the blocks with your paddle',
      icon: '🧱',
      component: Breakout,
      difficulty: 'Hard',
      category: 'Arcade'
    }
  ];

  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };

  const handleBackToHub = () => {
    setSelectedGame(null);
  };

  const renderGameComponent = () => {
    if (!selectedGame) return null;

    const GameComponent = selectedGame.component;
    
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={handleBackToHub}
            className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-300"
          >
            <span>←</span>
            <span>Back to Games</span>
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">{selectedGame.name}</h2>
            <p className="text-gray-600">{selectedGame.description}</p>
          </div>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
        <GameComponent user={user} />
      </div>
    );
  };

  if (selectedGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        {renderGameComponent()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Game Hub</h1>
          <p className="text-xl text-gray-600">Choose your game and start playing!</p>
        </div>

        {/* User Profile Section */}
        <div className="mb-8">
          <UserProfile user={user} setUser={setUser} />
        </div>

        {/* Game Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 cursor-pointer"
              onClick={() => handleGameSelect(game)}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{game.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{game.name}</h3>
                <p className="text-gray-600 mb-4">{game.description}</p>
                
                <div className="flex justify-center space-x-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    game.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    game.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {game.difficulty}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {game.category}
                  </span>
                </div>
                
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGameSelect(game);
                  }}
                >
                  Play Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Platform Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">{games.length}</div>
              <div className="text-gray-600">Available Games</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">3</div>
              <div className="text-gray-600">Game Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">100%</div>
              <div className="text-gray-600">Free to Play</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">∞</div>
              <div className="text-gray-600">Play Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHub;
