import React, { useState, useEffect } from "react";
import { getRandomGame, getGameDetails } from "../api";
import Board from "./Board";
import EloGuess from "./EloGuess";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChess,
  faArrowLeft,
  faArrowRight,
  faFastBackward,
  faFastForward,
  faSyncAlt,
} from "@fortawesome/free-solid-svg-icons";

const Game = () => {
  const [gameId, setGameId] = useState(null);
  const [gameDetails, setGameDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [showElo, setShowElo] = useState(false);
  const [moveNumber, setMoveNumber] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showSubmit, setShowSubmit] = useState(true);
  const [showGameInfo, setShowGameInfo] = useState(false);

  useEffect(() => {
    const fetchNewGame = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const randomGame = await getRandomGame();
        setGameId(randomGame.game_id);
      } catch (err) {
        setError("Failed to fetch a new game.");
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
        setError("Failed to fetch game details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameData();
  }, [gameId]);

  const handleGuess = (whiteGuess, blackGuess) => {
    if (!gameDetails) return;

    const whiteElo = gameDetails.game.white_elo;
    const blackElo = gameDetails.game.black_elo;

    const whiteDiff = Math.abs(whiteElo - whiteGuess);
    const blackDiff = Math.abs(blackElo - blackGuess);

    const guessScore = calculateScore(whiteDiff, blackDiff);
    setScore(guessScore);
    setShowElo(true);
    setShowSubmit(false);
    setShowGameInfo(true);
  };

  const calculateScore = (whiteDiff, blackDiff) => {
    const maxScore = 1000;
    return Math.max(0, maxScore - (whiteDiff + blackDiff));
  };

  const handleMoveForward = () => {
    if (!gameDetails || !gameDetails.moves) return;

    if (moveNumber < gameDetails.moves.length) {
      setMoveNumber(moveNumber + 1);
    }
  };

  const handleMoveBackward = () => {
    if (moveNumber > 0) {
      setMoveNumber(moveNumber - 1);
    }
  };

  const handleStart = () => {
    setMoveNumber(0);
  };

  const handleEnd = () => {
    if (!gameDetails || !gameDetails.moves) return;

    setMoveNumber(gameDetails.moves.length);
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleNewGame = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const randomGame = await getRandomGame();
      setGameId(randomGame.game_id);
      setGameDetails(null);
      setScore(0);
      setShowElo(false);
      setMoveNumber(0);
      setFlipped(false);
      setShowSubmit(true);
      setShowGameInfo(false);
    } catch (err) {
      setError("Failed to fetch a new game.");
    } finally {
      setIsLoading(false);
    }
  };

  const getMoveNotation = (move, index) => {
    const pieceIcons = {
      K: "♔",
      Q: "♕",
      R: "♖",
      B: "♗",
      N: "♘",
      P: "♙",
    };

    let notation = "";
    if (index % 2 === 0) {
      notation += `${Math.ceil((index + 1) / 2)}. `;
    }

    const piece = move.san.charAt(0);
    if (pieceIcons[piece]) {
      notation += pieceIcons[piece];
    } else {
      notation += "♙";
    }

    notation += move.san.slice(pieceIcons[piece] ? 1 : 0);

    return notation;
  };

  return (
    <div className="container mx-auto p-4 text-white flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2 flex flex-col items-center">
        {/* Chessboard */}
        {gameDetails && (
          <Board
            gameDetails={gameDetails}
            moveNumber={moveNumber}
            flipped={flipped}
          />
        )}

        {/* Move Controls */}
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={handleFlip}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            <FontAwesomeIcon icon={faSyncAlt} />
          </button>
          <button
            onClick={handleStart}
            disabled={moveNumber === 0}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            <FontAwesomeIcon icon={faFastBackward} />
          </button>
          <button
            onClick={handleMoveBackward}
            disabled={moveNumber === 0}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            onClick={handleMoveForward}
            disabled={!gameDetails || moveNumber === gameDetails.moves.length}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
          <button
            onClick={handleEnd}
            disabled={!gameDetails || moveNumber === gameDetails.moves.length}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            <FontAwesomeIcon icon={faFastForward} />
          </button>
        </div>

        {/* Move List */}
        {gameDetails && (
          <div className="mt-4 w-full overflow-auto">
            <div className="flex flex-wrap justify-center gap-1">
              {gameDetails.moves.map((move, index) => (
                <button
                  key={index}
                  onClick={() => setMoveNumber(index + 1)}
                  className={`font-bold py-1 px-2 rounded ${
                    index + 1 === moveNumber
                      ? "bg-green-500 text-white"
                      : "bg-gray-500 text-gray-200 hover:bg-gray-400"
                  }`}
                >
                  {getMoveNotation(move, index)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Game Information and Elo Guess */}
      <div className="md:w-1/2 flex flex-col">
        <h1 className="text-4xl font-bold text-center mb-4">
          <FontAwesomeIcon icon={faChess} className="mr-2" />
          Guess the Elo
        </h1>

        {isLoading && (
          <p className="text-center animate-pulse text-blue-500">
            Loading...
          </p>
        )}

        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Instructions */}
        <div className="p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Instructions</h2>
          <p>
            Analyze the chess game and guess the Elo ratings of both the white
            and black players. Your score will be calculated based on the
            accuracy of your guesses.
          </p>
        </div>

        {/* Elo Guess Input */}
        <div className="mt-4">
          <EloGuess
            whiteElo={gameDetails?.game.white_elo}
            blackElo={gameDetails?.game.black_elo}
            onGuess={handleGuess}
            disabled={!showSubmit}
          />
        </div>

        {/* Submit Guess Button */}
        {showSubmit && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setShowSubmit(false)}
              disabled={!showSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit Guess
            </button>
          </div>
        )}

        {/* Game Information (hidden initially) */}
        {showGameInfo && gameDetails && (
          <div className="p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Game Information</h2>
            <p>
              <span className="font-semibold">Event:</span>{" "}
              {gameDetails.game.event}
            </p>
            <p>
              <span className="font-semibold">Site:</span>{" "}
              {gameDetails.game.site}
            </p>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {gameDetails.game.game_date}
            </p>
            <p>
              <span className="font-semibold">White:</span>{" "}
              {gameDetails.game.white_player}
            </p>
            <p>
              <span className="font-semibold">Black:</span>{" "}
              {gameDetails.game.black_player}
            </p>
          </div>
        )}

        {/* Results (hidden initially) */}
        {showElo && (
          <div className="text-center mt-4">
            <p className="text-lg font-semibold">
              White Elo:{" "}
              <span className="text-yellow-400">
                {gameDetails.game.white_elo}
              </span>
            </p>
            <p className="text-lg font-semibold">
              Black Elo:{" "}
              <span className="text-yellow-400">
                {gameDetails.game.black_elo}
              </span>
            </p>
            <p className="text-lg font-semibold">
              Your Score:{" "}
              <span className="text-green-500">{score} / 1000</span>
            </p>
            <p className="mt-4">
              <a
                href={`https://lichess.org/${gameDetails.game.game_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Game on Lichess
              </a>
            </p>
          </div>
        )}

        {/* New Game Button */}
        {!showSubmit && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleNewGame}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              New Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;