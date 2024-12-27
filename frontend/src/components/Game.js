import React, { useState, useEffect, useRef } from "react";
import {
  getRandomGame,
  submitGuess,
  getElo,
} from "../api";
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
import { Chess } from "chess.js";

const Game = () => {
  const [gameUuid, setGameUuid] = useState(null);
  const [fen, setFen] = useState("start");
  const [totalMoves, setTotalMoves] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [moveNumber, setMoveNumber] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [guessed, setGuessed] = useState(false);
  const [whiteGuess, setWhiteGuess] = useState("");
  const [blackGuess, setBlackGuess] = useState("");
  const [shareText, setShareText] = useState("");
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [whiteElo, setWhiteElo] = useState(null);
  const [blackElo, setBlackElo] = useState(null);
  const [gameDate, setGameDate] = useState(null);
  const [lichessUrl, setLichessUrl] = useState(null);
  const [whitePlayer, setWhitePlayer] = useState(null);
  const [blackPlayer, setBlackPlayer] = useState(null);
  const [moveList, setMoveList] = useState([]);
  const initialDataFetched = useRef(false);

  const fetchNewGame = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const initialData = await getRandomGame();
      setGameUuid(initialData.game_uuid);
      setFen(initialData.start_fen);
      setTotalMoves(initialData.total_moves);
      setGuessed(false);
      setScore(0);
      setMoveNumber(0);
      setFlipped(false);
      setWhiteGuess("");
      setBlackGuess("");
      setWhiteElo(null);
      setBlackElo(null);
      setGameDate(null);
      setWhitePlayer(null);
      setBlackPlayer(null);
      setMoveList(initialData.move_list);
    } catch (err) {
      setError("Failed to fetch a new game.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
      const fetchInitialData = async () => {
        if (!initialDataFetched.current) {
          // Fetch initial data
          fetchNewGame();
          initialDataFetched.current = true; // Set the ref to true after fetching
        }
      };

      fetchInitialData();
  }, []);

  // Use chess.js to update FEN based on moveNumber
  useEffect(() => {
    const game = new Chess(); // Create a new chess.js instance

    // Extract SAN from move string (e.g., "1. d4" -> "d4")
    const extractSan = (move) => {
      const parts = move.split(" ");
      return parts.length > 1 ? parts[1] : parts[0];
    };

    // Apply moves up to moveNumber
    for (let i = 0; i < moveNumber; i++) {
      const sanMove = extractSan(moveList[i]);
      if (!game.move(sanMove)) {
        console.error("Invalid move:", moveList[i]);
        return; // Handle invalid move
      }
    }
    setFen(game.fen());
  }, [moveList, moveNumber]);

  const handleGuess = async (whiteGuess, blackGuess) => {
    try {
      const guessResponse = await submitGuess(
        gameUuid,
        parseInt(whiteGuess),
        parseInt(blackGuess)
      );
      setScore(guessResponse.score);
      setGuessed(true);

      // Fetch and display Elo after guess submission
      const eloData = await getElo(gameUuid);
      setWhiteElo(eloData.white_elo);
      setBlackElo(eloData.black_elo);
      setGameDate(eloData.game_date);
      setWhitePlayer(eloData.white_player);
      setBlackPlayer(eloData.black_player);
      setLichessUrl(eloData.lichess_url);

      // Generate share text after guess
      const resultText = `I scored ${guessResponse.score}/1000 on EloGuessr! I guessed ${whiteGuess} for White (actual: ${eloData.white_elo}) and ${blackGuess} for Black (actual: ${eloData.black_elo}). Try it out: https://eloguessr.live #EloGuessr`;
      setShareText(resultText);
    } catch (error) {
      setError("Failed to submit guess or fetch Elo.");
      console.error("Error:", error);
    }
  };

  const handleMoveForward = () => {
    setMoveNumber(Math.min(totalMoves, moveNumber + 1));
  };

  const handleMoveBackward = () => {
    setMoveNumber(Math.max(0, moveNumber - 1));
  };

  const handleStart = () => {
    setMoveNumber(0);
  };

  const handleEnd = () => {
    setMoveNumber(totalMoves);
  };

  const handleFlip = () => {
    setFlipped(!flipped);
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
              {isLoading ? (
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
                  <Board fen={fen} flipped={flipped} transitionDuration={90} />
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
            disabled={isLoading || moveNumber === totalMoves}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
          <button
            onClick={handleEnd}
            disabled={moveNumber === totalMoves}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faFastForward} />
          </button>
        </div>

        {/* Move List */}
        {
          <div className="mt-4 overflow-auto max-h-24 w-full">
            <div className="flex flex-wrap justify-center gap-0.5 p-2 rounded-lg bg-gray-800">
              {moveList.map((move, index) => (
                <button
                  onClick={() => setMoveNumber(index + 1)}
                  key={index}
                  className={`text-sm font-medium py-0.5 px-1.5 rounded ${
                    index + 1 === moveNumber
                      ? "bg-gray-600 text-white"
                      : "bg-transparent text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {move}
                </button>
              ))}
            </div>
          </div>
        }
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
              EloGuessr
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
                Watch the game and guess both players' Elo ratings. The
                closer your guesses, the higher your score!{" "}
                <span className="text-yellow-400">🎯</span>
              </p>
            </motion.div>

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
                      <span className="font-semibold text-white">
                        White:
                      </span>{" "}
                      {whitePlayer}{" "}
                      <span className="text-yellow-400 font-bold">
                        ({whiteElo})
                      </span>
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-700">
                    <p className="text-lg">
                      <span className="font-semibold text-white">
                        Black:
                      </span>{" "}
                      {blackPlayer}{" "}
                      <span className="text-yellow-400 font-bold">
                        ({blackElo})
                      </span>
                    </p>
                  </div>
                  {gameDate && (
                    <p className="text-sm text-gray-400">
                      Played on:{" "}
                      {new Date(gameDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* View on Lichess, Play Again, and Share Buttons */}
            {guessed && (
              <div className="flex flex-col gap-4 w-full">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={fetchNewGame}
                    disabled={isLoading}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
                  >
                    <span className="mr-2">🔄</span>
                    Play Again
                  </button>
                  <a
                    href={lichessUrl}
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