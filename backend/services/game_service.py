from sqlalchemy.orm import Session
from backend import models, schemas
import chess.pgn
import io
from typing import List, Optional
from sqlalchemy import func
import uuid
import re
from datetime import datetime, timedelta


def get_initial_game_data(db: Session) -> schemas.InitialGameData:
    """Retrieves initial data for a random game."""
    game = db.query(models.Game).order_by(func.random()).first()
    if game is None:
        return None

    pgn_game = chess.pgn.read_game(io.StringIO(game.pgn))
    total_moves = len(list(pgn_game.mainline_moves()))

    # Extract move list in SAN format
    move_list = []
    board = pgn_game.board()
    for move_number, move in enumerate(pgn_game.mainline_moves()):
        move_san = board.san(move)
        if move_number % 2 == 0:
            move_list.append(f"{(move_number // 2) + 1}. {move_san}")
        else:
            move_list.append(move_san)
        board.push(move)

    return schemas.InitialGameData(
        game_uuid=str(game.game_uuid),
        start_fen="start",
        total_moves=total_moves,
        move_list=move_list,
    )


def verify_elo_guess(
    db: Session, game_uuid: uuid.UUID, elo_guess: schemas.EloGuess
) -> int:
    """Verifies the Elo guess against the actual Elo ratings and returns the score."""
    game = db.query(models.Game).filter(models.Game.game_uuid == game_uuid).first()
    if game is None:
        return None

    white_diff = abs(game.white_elo - elo_guess.white_guess)
    black_diff = abs(game.black_elo - elo_guess.black_guess)
    score = max(0, 1000 - (white_diff + black_diff))
    return score


def get_elo_by_uuid(db: Session, game_uuid: uuid.UUID) -> schemas.EloReveal:
    """Retrieves the actual Elo ratings by game UUID."""
    game = db.query(models.Game).filter(models.Game.game_uuid == game_uuid).first()
    if game is None:
        return None

    return schemas.EloReveal(
        white_elo=game.white_elo,
        black_elo=game.black_elo,
        game_date=game.game_date,
        white_player=game.white_player,
        black_player=game.black_player,
        lichess_url=game.site,
    )


def format_time(time_str):
    """Formats the time string to an interval."""
    try:
        # Handle cases with single-digit hours
        parts = time_str.split(":")
        if len(parts) == 3:
            hours, minutes, seconds = map(int, parts)
        elif len(parts) == 2:
            hours = 0
            minutes, seconds = map(int, parts)
        else:
            print(f"Error formatting time: {time_str}")
            return None
        return f"{hours:02d}:{minutes:02d}:{seconds:02d}"
    except ValueError:
        print(f"Error formatting time: {time_str}")
        return None


def get_move_times_by_game_uuid(
    db: Session, game_uuid: uuid.UUID
) -> List[schemas.MoveTime]:
    """
    Retrieves the move times for a specific game by its UUID.
    Calculates the time remaining after each move and the think time for each move.
    """
    game = db.query(models.Game).filter(models.Game.game_uuid == game_uuid).first()
    if not game:
        return None

    pgn_game = chess.pgn.read_game(io.StringIO(game.pgn))  # Parse PGN into chess.pgn.Game
    headers = pgn_game.headers
    time_control = headers.get("TimeControl")

    if time_control and time_control != "-":
        initial_time, increment = map(int, time_control.split("+"))
    else:
        initial_time, increment = 300, 0  # Default to 5 minutes with no increment if not specified

    white_time_remaining = timedelta(seconds=initial_time)
    black_time_remaining = timedelta(seconds=initial_time)

    move_times = []
    node = pgn_game  # Start with the chess.pgn.Game object
    move_number = 0
    prev_white_time = None
    prev_black_time = None

    while True:
        next_node = node.variations[0] if node.variations else None  # Access variations correctly
        if next_node is None:
            break

        # ... (Rest of your logic remains the same)
        comment = next_node.comment
        time_match = re.search(r"\[%clk (\d+(:\d+){1,2})\]", comment)
        if time_match:
            move_number += 1
            time_str = time_match.group(1)
            move_time = format_time(time_str)

            if move_number % 2 == 1:  # White's move
                white_time_remaining = datetime.strptime(
                    move_time, "%H:%M:%S"
                ) - datetime.strptime("00:00:00", "%H:%M:%S")
                think_time = (
                    str(prev_white_time - white_time_remaining)
                    if prev_white_time
                    else "00:00:00"
                )
                move_times.append(
                    schemas.MoveTime(
                        move_number=move_number,
                        white_time=str(white_time_remaining),
                        black_time=None,
                        think_time=think_time,
                    )
                )
                prev_white_time = white_time_remaining
            else:  # Black's move
                black_time_remaining = datetime.strptime(
                    move_time, "%H:%M:%S"
                ) - datetime.strptime("00:00:00", "%H:%M:%S")
                think_time = (
                    str(prev_black_time - black_time_remaining)
                    if prev_black_time
                    else "00:00:00"
                )
                move_times.append(
                    schemas.MoveTime(
                        move_number=move_number,
                        white_time=None,
                        black_time=str(black_time_remaining),
                        think_time=think_time,
                    )
                )
                prev_black_time = black_time_remaining

                # Add increment after black's move
                white_time_remaining += timedelta(seconds=increment)
                black_time_remaining += timedelta(seconds=increment)

        node = next_node

    return move_times
