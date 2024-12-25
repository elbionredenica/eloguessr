from sqlalchemy.orm import Session
from backend import models, schemas
import chess.pgn
import io
from typing import List
from sqlalchemy import func
import uuid


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
        move_list=move_list
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
