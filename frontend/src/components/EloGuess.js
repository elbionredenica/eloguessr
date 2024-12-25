import React, { useState } from "react";

const EloGuess = ({
  onGuess,
  disabled,
  whiteGuess,
  blackGuess,
  setWhiteGuess,
  setBlackGuess,
}) => {
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

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
    onGuess(whiteGuess, blackGuess);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {" "}
      {/* Form container */}
      <div className="flex flex-col items-center gap-4">
        {" "}
        {/* Main container */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full max-w-md">
            {error}
          </div>
        )}
        <div className="flex justify-center gap-4 w-full max-w-md">
          {" "}
          {/* Input container */}
          <div className="guess-input flex-1">
            <label
              htmlFor="white-guess"
              className="block text-sm font-medium text-gray-200 text-center"
            >
              White Elo:
            </label>
            <input
              id="white-guess"
              type="number"
              value={whiteGuess}
              onChange={(e) => setWhiteGuess(e.target.value)}
              disabled={disabled}
              className="mt-1 block w-full border-none bg-gray-700 text-gray-200 px-3 py-2 rounded-md shadow-sm text-center focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div className="guess-input flex-1">
            <label
              htmlFor="black-guess"
              className="block text-sm font-medium text-gray-200 text-center"
            >
              Black Elo:
            </label>
            <input
              id="black-guess"
              type="number"
              value={blackGuess}
              onChange={(e) => setBlackGuess(e.target.value)}
              disabled={disabled}
              className="mt-1 block w-full border-none bg-gray-700 text-gray-200 px-3 py-2 rounded-md shadow-sm text-center focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={disabled}
          className="w-full max-w-md bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-2 px-6 rounded-lg transition duration-200"
        >
          <span className="mr-2">🤔</span> Submit Guess
        </button>
      </div>
    </form>
  );
};

export default EloGuess;