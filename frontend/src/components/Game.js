import React, { useState, useEffect } from 'react';
import { getRandomGame, getGameDetails } from '../api';
import Board from './Board';
import EloGuess from './EloGuess';

const Game = () => {
  const [gameId, setGameId] = useState(null);
  const [gameDetails, setGameDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [showElo, setShowElo] = useState(false)

  useEffect(() => {
    const fetchNewGame = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const randomGame = await getRandomGame();
        setGameId(randomGame.game_id);
      } catch (err) {
        setError('Failed to fetch a new game.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewGame();
  }, []);

  useEffect(() => {
    const fetchGameData = async () => {
      if (!gameId) return;

      setIsLoading(true);
      setError(null);
      try {
        const details = await getGameDetails(gameId);
        setGameDetails(details);
      } catch (err) {
        setError('Failed to fetch game details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameData();
  }, [gameId]);

  const handleGuess = (whiteGuess, blackGuess) => {
    const whiteElo = gameDetails.game.white_elo;
    const blackElo = gameDetails.game.black_elo;

    const whiteDiff = Math.abs(whiteElo - whiteGuess);
    const blackDiff = Math.abs(blackElo - blackGuess);

    const guessScore = calculateScore(whiteDiff, blackDiff);
    setScore(guessScore);
    setShowElo(true); // Show Elo after guess
  };

  const calculateScore = (whiteDiff, blackDiff) => {
    // Simple scoring for now (inversely proportional to the difference)
    const maxScore = 1000;
    const score = Math.max(0, maxScore - (whiteDiff + blackDiff));
    return score;
  };

  const handleNewGame = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const randomGame = await getRandomGame();
      setGameId(randomGame.game_id);
      setGameDetails(null); // Clear previous game details
      setScore(0); // Reset score
      setShowElo(false); // Hide Elo again
    } catch (err) {
      setError("Failed to fetch a new game.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Guess the Elo</h1>

      {isLoading && (
        <p className="text-center animate-pulse text-blue-500">Loading...</p>
      )}

      {error && <p className="text-center text-red-500">{error}</p>}

      {gameDetails && (
        <>
          <Board gameDetails={gameDetails} />

          <div className="game-info mt-4">
            <EloGuess
              whiteElo={gameDetails.game.white_elo}
              blackElo={gameDetails.game.black_elo}
              onGuess={handleGuess}
            />

            {showElo && (
              <div className="elo-reveal text-center mt-4">
                <p className="text-lg">
                  White Elo: {gameDetails.game.white_elo}
                </p>
                <p className="text-lg">
                  Black Elo: {gameDetails.game.black_elo}
                </p>
              </div>
            )}

            {score > 0 && (
              <p className="score text-center text-green-600 font-semibold text-xl mt-2">
                Score: {score}
              </p>
            )}
          </div>
        </>
      )}

      <div className="flex justify-center mt-4">
        <button
          onClick={handleNewGame}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default Game;