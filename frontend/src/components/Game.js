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
  faTrophy,
  faShareAlt,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

const Game = () => {
  const [gameId, setGameId] = useState(null);
  const [gameDetails, setGameDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [showElo, setShowElo] = useState(false);
  const [moveNumber, setMoveNumber] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [guessed, setGuessed] = useState(false);
  const [whiteGuess, setWhiteGuess] = useState("");
  const [blackGuess, setBlackGuess] = useState("");
  const [shareText, setShareText] = useState("");
  const [showShareSuccess, setShowShareSuccess] = useState(false);

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

    const whiteElo = parseInt(gameDetails.game.white_elo);
    const blackElo = parseInt(gameDetails.game.black_elo);
    const whiteGuessNum = parseInt(whiteGuess);
    const blackGuessNum = parseInt(blackGuess);

    const whiteDiff = Math.abs(whiteElo - whiteGuessNum);
    const blackDiff = Math.abs(blackElo - blackGuessNum);

    const newScore = Math.max(0, 1000 - (whiteDiff + blackDiff));

    setScore(newScore);
    setShowElo(true);
    setGuessed(true);

    // Generate share text after guess
    const resultText = `I scored ${newScore}/1000 on RatingGuessr! I guessed ${whiteGuessNum} for White (actual: ${whiteElo}) and ${blackGuessNum} for Black (actual: ${blackElo}). Try it out: [your app link here] #RatingGuessr`;
    setShareText(resultText);
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
    setError(null);
    setGuessed(false);
    setShowElo(false);
    setIsLoading(true);
    setGameDetails(null);
    setScore(0);
    setMoveNumber(0);
    setFlipped(false);
    setWhiteGuess("");
    setBlackGuess("");

    try {
      const randomGame = await getRandomGame();
      setGameId(randomGame.game_id);
    } catch (err) {
      setError("Failed to fetch a new game.");
    }
  };

  const getMoveNotation = (move, index) => {
    const pieceIcons = {
      K: "♔",
      Q: "♕",
      R: "♖",
      B: "♗",
      N: "♘",
      "": "♙",
    };

    const pgn = gameDetails?.game?.pgn;
    if (!pgn) {
      return "";
    }

    const moves = pgn
      .replace(/\[.*?\]/g, "")
      .replace(/\d+\./g, "")
      .trim()
      .split(/\s+/);

    let moveStr = "";
    if (index % 2 === 0) {
      moveStr += `${Math.ceil((index + 1) / 2)}. `;
    }

    const fullMove = moves[index];
    const piece = fullMove[0];

    if (pieceIcons[piece]) {
      moveStr += pieceIcons[piece];
      moveStr += fullMove.slice(1);
    } else if (fullMove.startsWith("O-O")) {
      moveStr += fullMove;
    } else {
      moveStr += pieceIcons[""];
      moveStr += fullMove;
    }
    return moveStr;
  };

  const handleCopyShareText = () => {
    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        setShowShareSuccess(true);
        setTimeout(() => setShowShareSuccess(false), 2000); // Hide success message after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy share text:", err);
        // Handle error, possibly show a message to the user
      });
  };

  return (
    <div className="container mx-auto p-4 text-white flex flex-col md:flex-row gap-8 pt-10">
      {/* Left Panel */}
      <div className="md:w-1/2 flex flex-col items-center justify-start">
        {/* Board Section */}
        <div className="flex justify-center w-full">
          <div>
            <AnimatePresence initial={false} mode="wait">
              {isLoading || !gameDetails ? (
                <motion.div
                  key="spinner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center z-10"
                >
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
                </motion.div>
              ) : (
                <motion.div
                  key="board"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Board
                    gameDetails={gameDetails}
                    moveNumber={moveNumber}
                    flipped={flipped}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Move Controls */}
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={handleFlip}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            <FontAwesomeIcon icon={faSyncAlt} />
          </button>
          <button
            onClick={handleStart}
            disabled={moveNumber === 0}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faFastBackward} />
          </button>
          <button
            onClick={handleMoveBackward}
            disabled={moveNumber === 0}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            onClick={handleMoveForward}
            disabled={!gameDetails || moveNumber === gameDetails.moves.length}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
          <button
            onClick={handleEnd}
            disabled={!gameDetails || moveNumber === gameDetails.moves.length}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faFastForward} />
          </button>
        </div>

        {/* Move List */}
        {gameDetails && (
          <div className="mt-4 overflow-auto max-h-24">
            <div className="flex flex-wrap justify-center gap-0.5 p-2 rounded-lg bg-gray-800">
              {gameDetails.moves.map((move, index) => (
                <button
                  key={index}
                  onClick={() => setMoveNumber(index + 1)}
                  className={`text-sm font-medium py-0.5 px-1.5 rounded ${
                    index + 1 === moveNumber
                      ? "bg-gray-600 text-white"
                      : "bg-transparent text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {getMoveNotation(move, index)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="md:w-1/2 flex flex-col items-center">
        <motion.div
          className="w-full max-w-[500px] h-full flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Dynamic vertical centering for initial state */}
          <div
            className={`flex-grow flex flex-col ${
              !guessed ? "justify-center" : ""
            }`}
          >
            {/* Title */}
            <motion.h1
              className="text-5xl font-bold text-center mb-6 flex items-center justify-center"
              layout
            >
              <FontAwesomeIcon
                icon={faChess}
                className="mr-3 text-yellow-400"
              />
              RatingGuessr
              <FontAwesomeIcon
                icon={faTrophy}
                className="ml-3 text-yellow-400"
              />
            </motion.h1>

            {/* Instructions */}
            <motion.div
              layout
              className="p-6 rounded-xl bg-gray-800 text-center mb-6"
            >
              <h2 className="text-2xl font-semibold mb-3">
                <span className="text-yellow-400">💡</span> How to Play
              </h2>
              <p className="text-gray-300">
                Watch the game and guess both players' Elo ratings. The closer
                your guesses, the higher your score!{" "}
                <span className="text-yellow-400">🎯</span>
              </p>
            </motion.div>

            {/* Score Display */}
            {guessed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 text-center"
              >
                <h2 className="text-3xl font-bold text-yellow-400 mb-2">
                  Score
                </h2>
                <div className="text-5xl font-bold bg-gray-800 rounded-xl p-4">
                  <span className="text-green-400">{score}</span>
                  <span className="text-gray-400">/1000</span>
                </div>
              </motion.div>
            )}

            {/* Elo Guess Form - Hide after submission */}
            {!guessed && (
              <motion.div layout className="mb-6">
                <EloGuess
                  onGuess={handleGuess}
                  disabled={guessed}
                  whiteGuess={whiteGuess}
                  blackGuess={blackGuess}
                  setWhiteGuess={setWhiteGuess}
                  setBlackGuess={setBlackGuess}
                />
              </motion.div>
            )}

            {/* Game Information */}
            {guessed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-xl bg-gray-800 text-center mb-6"
              >
                <h2 className="text-2xl font-semibold mb-4">
                  <span className="text-yellow-400">♟️</span> Players
                </h2>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gray-700">
                    <p className="text-lg">
                      <span className="font-semibold text-white">White:</span>{" "}
                      {gameDetails.game.white_player}{" "}
                      <span className="text-yellow-400 font-bold">
                        ({gameDetails.game.white_elo})
                      </span>
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-700">
                    <p className="text-lg">
                      <span className="font-semibold text-white">Black:</span>{" "}
                      {gameDetails.game.black_player}{" "}
                      <span className="text-yellow-400 font-bold">
                        ({gameDetails.game.black_elo})
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* View on Lichess, Play Again, and Share Buttons */}
            {guessed && (
              <div className="flex flex-col gap-4 w-full">
                <div className="grid grid-cols-2 gap-4">
                  <button
                      onClick={handleNewGame}
                      disabled={isLoading}
                      className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
                    >
                      <span className="mr-2">🔄</span>
                      Play Again
                  </button>
                  <a
                    href={gameDetails.game.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200 text-center"
                  >
                    <span className="mr-2">🔍</span>
                    View on Lichess
                  </a>
                </div>
                <div>
                  <button
                    onClick={handleCopyShareText}
                    className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faShareAlt} className="mr-2" />
                    Share Score
                  </button>
                  {showShareSuccess && (
                    <div className="mt-2 text-green-400">
                      Copied to clipboard!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Game;