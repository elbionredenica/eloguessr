import React, { useState } from "react";

const EloGuess = ({ onGuess, disabled }) => {
  const [whiteGuess, setWhiteGuess] = useState("");
  const [blackGuess, setBlackGuess] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    const whiteGuessNum = parseInt(whiteGuess);
    const blackGuessNum = parseInt(blackGuess);

    if (isNaN(whiteGuessNum) || isNaN(blackGuessNum)) {
      setError("Please enter valid numbers for both guesses.");
      return;
    }

    if (whiteGuessNum < 0 || blackGuessNum < 0) {
      setError("Guesses cannot be negative.");
      return;
    }

    setError(null);
    onGuess(whiteGuessNum, blackGuessNum);
  };

  return (
    <div className="elo-guess">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      <div className="flex gap-4">
        <div className="guess-input">
          <label
            htmlFor="white-guess"
            className="block text-sm font-medium text-gray-200"
          >
            White Elo:
          </label>
          <input
            id="white-guess"
            type="number"
            value={whiteGuess}
            onChange={(e) => setWhiteGuess(e.target.value)}
            disabled={disabled}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-gray-800"
          />
        </div>
        <div className="guess-input">
          <label
            htmlFor="black-guess"
            className="block text-sm font-medium text-gray-200"
          >
            Black Elo:
          </label>
          <input
            id="black-guess"
            type="number"
            value={blackGuess}
            onChange={(e) => setBlackGuess(e.target.value)}
            disabled={disabled}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-gray-800"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={disabled}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit Guess
        </button>
      </div>
    </div>
  );
};

export default EloGuess;