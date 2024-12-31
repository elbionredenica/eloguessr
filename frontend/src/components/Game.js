import React, { useState, useEffect, useRef } from "react";
import { getRandomGame, submitGuess, getElo, getMoveTimes } from "../api";
import Board from "./Board";
import EloGuess from "./EloGuess";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChess,
  faArrowLeft,
  faArrowRight,
  faArrowDown,
  faFastBackward,
  faFastForward,
  faSyncAlt,
  faTrophy,
  faShareAlt,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { Chess } from "chess.js";

// Clock component for displaying the time
const Clock = ({ time, isWhite }) => {
  return (
    <div
      className={`clock text-center p-2 rounded-lg mb-1 w-[120px] ${
        isWhite ? "bg-white text-black" : "bg-black text-white"
      }`}
    >
      <span className="font-bold text-xl">{time}</span>
    </div>
  );
};

const Game = () => {
  const [boardWidth, setBoardWidth] = useState(560);
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
  const [moveTimes, setMoveTimes] = useState([]);
  const initialDataFetched = useRef(false);
  const [whiteTime, setWhiteTime] = useState(null);
  const [blackTime, setBlackTime] = useState(null);

  // Helper function to format time
  const formatTime = (timeStr) => {
    if (!timeStr) return "00:00";
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

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

      // Fetch move times and initialize clocks
      if (initialData.game_uuid) {
        const times = await getMoveTimes(initialData.game_uuid);
        setMoveTimes(times);
        if (times.length > 0) {
          setWhiteTime(formatTime(times[0].white_time));
          setBlackTime(
            formatTime(times[0].black_time || times[1]?.black_time || null)
          );
        }
      }
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

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

      if (isMobile) {
        setBoardWidth(window.innerWidth * 0.85); // 85% of screen width on mobile
      } else if (isTablet) {
        setBoardWidth(window.innerWidth * 0.45); // 45% of screen width on tablet (adjust as needed)
      } else {
        setBoardWidth(560); // Default for larger screens (adjust as needed)
      }
    };

    handleResize(); // Call on initial render
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update clocks after each move
  useEffect(() => {
    if (moveTimes && moveTimes.length > 0) {
      if (moveNumber % 2 === 1) {
        // White's move
        const moveTime = moveTimes.find(
          (mt) => mt.move_number === moveNumber
        );
        if (moveTime) {
          setWhiteTime(formatTime(moveTime.white_time));
        }
      } else if (moveNumber > 0) {
        // Black's move
        const moveTime = moveTimes.find(
          (mt) => mt.move_number === moveNumber
        );
        if (moveTime) {
          setBlackTime(formatTime(moveTime.black_time));
        }
      }
    }
  }, [moveNumber, moveTimes]);

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
    <div className="min-h-screen flex flex-col">
      <main className="container mx-auto p-4 text-white flex-grow">
        <div className="flex flex-col md:flex-row gap-8 pt-10">
          {/* Left Panel */}
          <div className="md:w-1/2 flex flex-col items-center justify-start">
            {/* Title (only on mobile) */}
            <motion.h1
              className="text-5xl font-bold text-center mb-2 flex items-center justify-center md:hidden"
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
  
            {/* Instructions (only on mobile) */}
            <motion.div
              layout
              className="p-4 rounded-xl bg-gray-800 text-center mb-2 w-full max-w-md md:hidden"
            >
              <h2 className="text-xl font-semibold mb-1">
                <span className="text-yellow-400">💡</span> How to Play
              </h2>
              <p className="text-gray-300 text-sm">
                Watch the game and guess both players' Elo ratings. The closer
                your guesses, the higher your score!{" "}
                <span className="text-yellow-400">🎯</span>
              </p>
            </motion.div>
  
            {/* Input Fields (only on mobile) */}
            {!guessed && (
              <motion.div
                layout
                className="mb-2 w-full max-w-md md:hidden"
              >
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
  
            {/* Score, Players, and CTAs (only on mobile, after guess) */}
            {guessed && (
              <div className="mb-6 md:hidden">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 text-center"
                >
                  <h2 className="text-3xl font-bold text-yellow-400 mb-2">
                    Score
                  </h2>
                  <div className="text-5xl font-bold bg-gray-800 rounded-xl p-4">
                    <span className="text-green-400">{score}</span>
                    <span className="text-gray-400">/1000</span>
                  </div>
                </motion.div>
  
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-xl bg-gray-800 text-center mb-4"
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
              </div>
            )}
  
            {/* Visual Cue (only on mobile) */}
            <div className="text-center text-gray-400 mb-4 md:hidden">
              <p className="text-sm">
                Scroll down to see the board and move pieces.
              </p>
              <FontAwesomeIcon
                icon={faArrowDown}
                className="mt-1 animate-bounce"
              />
            </div>
  
            {/* Clocks Section */}
            <div className="flex justify-center w-full gap-4 mb-1">
              {!flipped ? (
                <>
                  <Clock time={blackTime} isWhite={false} />
                  <Clock time={whiteTime} isWhite={true} />
                </>
              ) : (
                <>
                  <Clock time={whiteTime} isWhite={true} />
                  <Clock time={blackTime} isWhite={false} />
                </>
              )}
            </div>
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
                      <Board
                        fen={fen}
                        flipped={flipped}
                        transitionDuration={90}
                        boardWidth={boardWidth}
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
                  {moveList.map((move, index) => {
                    const moveTime = moveTimes.find(
                      (mt) => mt.move_number === index + 1
                    );
                    let displayThinkTime = "";
  
                    if (moveTime) {
                      if (index % 2 === 0 && moveTime.think_time) {
                        displayThinkTime = moveTime.think_time.split(".")[0]; // Remove milliseconds
                      } else if (index % 2 !== 0 && moveTime.think_time) {
                        displayThinkTime = moveTime.think_time.split(".")[0]; // Remove milliseconds
                      }
  
                      // Format to "3s" if less than a minute
                      const seconds = parseInt(displayThinkTime.split(":").pop()); // Get seconds part
                      if (seconds < 60 && !displayThinkTime.startsWith("00:00:")) {
                          displayThinkTime = `${seconds}s`;
                      } else if (displayThinkTime.startsWith("00:")) {
                          displayThinkTime = displayThinkTime.slice(3); // Remove leading "00:"
                      }
                    }
  
                    return (
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
                        {displayThinkTime && (
                          <span className="text-xs text-gray-500 ml-1">
                            ({displayThinkTime})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            }
          </div>
  
          {/* Right Panel */}
          <div className="md:w-1/2 flex flex-col items-center">
            <div className="w-full max-w-[500px] h-full flex flex-col">
              {/* Title (only on desktop) */}
              <motion.h1
                className="text-5xl font-bold text-center mb-6 flex items-center justify-center hidden md:flex"
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
              {/* Instructions (only on desktop) */}
              <motion.div
                layout
                className="p-6 rounded-xl bg-gray-800 text-center mb-6 hidden md:block"
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
                <motion.div layout className="mb-6 hidden md:block">
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
  
              {/* Dynamic vertical centering for initial state */}
              <div
                className={`flex-grow flex flex-col ${
                  !guessed ? "justify-center" : ""
                }`}
              >
                {/* Score, Players, and CTAs (only on desktop, after guess) */}
                {guessed && (
                  <div className="mb-6 hidden md:block">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 text-center"
                    >
                      <h2 className="text-3xl font-bold text-yellow-400 mb-2">
                        Score
                      </h2>
                      <div className="text-5xl font-bold bg-gray-800 rounded-xl p-4">
                        <span className="text-green-400">{score}</span>
                        <span className="text-gray-400">/1000</span>
                      </div>
                    </motion.div>
  
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-xl bg-gray-800 text-center mb-4"
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Game;