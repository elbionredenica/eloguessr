import React from "react";
import { Chessboard } from "react-chessboard";

const Board = ({ fen, flipped, transitionDuration, boardWidth }) => {
  return (
    <div className="board-container" style={{ width: boardWidth }}>
      <Chessboard
        position={fen}
        arePiecesDraggable={false}
        boardOrientation={flipped ? "black" : "white"}
        boardWidth={boardWidth} // Pass boardWidth prop here
        customBoardStyle={{
          borderRadius: "5px",
          boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
        }}
        customLightSquareStyle={{ backgroundColor: "rgba(150, 180, 255, 0.5)" }}
        customDarkSquareStyle={{ backgroundColor: "rgba(50, 80, 155, 0.6)" }}
        animationDuration={transitionDuration}
        customPieces={{
          wK: ({ isDragging, squareWidth }) => (
            <img
              style={{
                width: isDragging ? squareWidth * 1.75 : squareWidth,
                height: isDragging ? squareWidth * 1.75 : squareWidth,
              }}
              src={
                "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg"
              }
              alt={"white king"}
            />
          ),
          wQ: ({ isDragging, squareWidth }) => (
            <img
              style={{
                width: isDragging ? squareWidth * 1.75 : squareWidth,
                height: isDragging ? squareWidth * 1.75 : squareWidth,
              }}
              src={
                "https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg"
              }
              alt={"white queen"}
            />
          ),
          wR: ({ isDragging, squareWidth }) => (
            <img
              style={{
                width: isDragging ? squareWidth * 1.75 : squareWidth,
                height: isDragging ? squareWidth * 1.75 : squareWidth,
              }}
              src={
                "https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg"
              }
              alt={"white rook"}
            />
          ),
          wB: ({ isDragging, squareWidth }) => (
            <img
              style={{
                width: isDragging ? squareWidth * 1.75 : squareWidth,
                height: isDragging ? squareWidth * 1.75 : squareWidth,
              }}
              src={
                "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg"
              }
              alt={"white bishop"}
            />
          ),
          wN: ({ isDragging, squareWidth }) => (
            <img
              style={{
                width: isDragging ? squareWidth * 1.75 : squareWidth,
                height: isDragging ? squareWidth * 1.75 : squareWidth,
              }}
              src={
                "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg"
              }
              alt={"white knight"}
            />
          ),
          wP: ({ isDragging, squareWidth }) => (
            <img
              style={{
                width: isDragging ? squareWidth * 1.75 : squareWidth,
                height: isDragging ? squareWidth * 1.75 : squareWidth,
              }}
              src={
                "https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg"
              }
              alt={"white pawn"}
            />
          ),
          bK: ({ isDragging, squareWidth }) => (
            <img
              style={{
                width: isDragging ? squareWidth * 1.75 : squareWidth,
                height: isDragging ? squareWidth * 1.75 : squareWidth,
              }}
              src={
                "https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg"
              }
              alt={"black king"}
            />
          ),
          bQ: ({ isDragging, squareWidth }) => (
            <img
              style={{
                width: isDragging ? squareWidth * 1.75 : squareWidth,
                height: isDragging ? squareWidth * 1.75 : squareWidth,
              }}
              src={
                "https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg"
              }
              alt={"black queen"}
            />
          ),
          bR: ({ isDragging, squareWidth }) => (
            <img
              style={{
                width: isDragging ? squareWidth * 1.75 : squareWidth,
                height: isDragging ? squareWidth * 1.75 : squareWidth,
              }}
              src={
                "https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg"
              }
              alt={"black rook"}
            />
          ),
          bB: ({ isDragging, squareWidth }) => (
            <img
              style={{
                width: isDragging ? squareWidth * 1.75 : squareWidth,
                height: isDragging ? squareWidth * 1.75 : squareWidth,
              }}
              src={
                "https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg"
              }
              alt={"black bishop"}
            />
          ),
          bN: ({ isDragging, squareWidth }) => (
            <img
              style={{
                width: isDragging ? squareWidth * 1.75 : squareWidth,
                height: isDragging ? squareWidth * 1.75 : squareWidth,
              }}
              src={
                "https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg"
              }
              alt={"black knight"}
            />
          ),
          bP: ({ isDragging, squareWidth }) => (
            <img
              style={{
                width: isDragging ? squareWidth * 1.75 : squareWidth,
                height: isDragging ? squareWidth * 1.75 : squareWidth,
              }}
              src={
                "https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg"
              }
              alt={"black pawn"}
            />
          ),
        }}
      />
    </div>
  );
};

export default Board;