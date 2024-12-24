// src/components/Board.js
import React, { useState, useEffect } from "react";
import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";

const Board = ({ gameDetails }) => {
  const [fen, setFen] = useState("start");
  const [moveNumber, setMoveNumber] = useState(0);

  useEffect(() => {
    // Reset to the starting position when a new game is loaded
    setFen("start");
    setMoveNumber(0);
  }, [gameDetails]);

  const handleMoveForward = () => {
    if (moveNumber < gameDetails.moves.length) {
      setMoveNumber(moveNumber + 1);
      // Update FEN based on the next move
      const newFen = calculateFen(gameDetails.moves, moveNumber + 1);
      setFen(newFen);
    }
  };

  const handleMoveBackward = () => {
    if (moveNumber > 0) {
      setMoveNumber(moveNumber - 1);
      // Update FEN based on the previous move
      const newFen = calculateFen(gameDetails.moves, moveNumber - 1);
      setFen(newFen);
    }
  };

  const calculateFen = (moves, upToMove) => {
    const chess = new Chess();
    for (let i = 0; i < upToMove; i++) {
      chess.move(moves[i].san);
    }
    return chess.fen();
  };

  return (
    <div className="flex justify-center items-center">
      <div className="board-container">
        <Chessboard
          position={fen}
          onPieceClick={() => {
            alert("Moving pieces is not allowed!");
          }}
        />
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={handleMoveBackward}
            disabled={moveNumber === 0}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Prev
          </button>
          <button
            onClick={handleMoveForward}
            disabled={moveNumber === gameDetails.moves.length}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Board;