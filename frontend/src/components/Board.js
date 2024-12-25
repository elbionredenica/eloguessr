import React from "react";
import Chessboard from "chessboardjsx";

const Board = ({ fen, flipped, transitionDuration }) => {
  return (
    <div className="board-container">
      <Chessboard
        position={fen}
        allowDrag={() => false}
        orientation={flipped ? "black" : "white"}
        boardStyle={{
          borderRadius: "5px",
          boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
        }}
        lightSquareStyle={{ backgroundColor: "rgba(150, 180, 255, 0.5)" }}
        darkSquareStyle={{ backgroundColor: "rgba(50, 80, 155, 0.6)" }}
        transitionDuration={transitionDuration}
        pieces={{
          wK: ({ squareWidth, isDragging }) => (
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
          wQ: ({ squareWidth, isDragging }) => (
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
          wR: ({ squareWidth, isDragging }) => (
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
          wB: ({ squareWidth, isDragging }) => (
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
          wN: ({ squareWidth, isDragging }) => (
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
          wP: ({ squareWidth, isDragging }) => (
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
          bK: ({ squareWidth, isDragging }) => (
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
          bQ: ({ squareWidth, isDragging }) => (
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
          bR: ({ squareWidth, isDragging }) => (
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
          bB: ({ squareWidth, isDragging }) => (
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
          bN: ({ squareWidth, isDragging }) => (
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
          bP: ({ squareWidth, isDragging }) => (
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