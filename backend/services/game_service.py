from sqlalchemy.orm import Session
from backend import models, schemas
import chess.pgn
import io
from typing import List
from sqlalchemy import func


def get_random_game(db: Session) -> schemas.Game:
    """Retrieves a random game from the database."""
    game = db.query(models.Game).order_by(func.random()).first()
    return schemas.Game.from_orm(game) if game else None


def get_game_details_by_id(db: Session, game_id: int) -> schemas.GameDetails:
    """Retrieves game details, including moves, by game ID."""
    game = db.query(models.Game).filter(models.Game.game_id == game_id).first()
    if game is None:
        return None

    pgn_game = chess.pgn.read_game(io.StringIO(game.pgn))
    moves = [
        schemas.GameMove(move_number=i + 1, san=str(move))
        for i, move in enumerate(pgn_game.mainline_moves())
    ]

    return schemas.GameDetails(game=schemas.Game.from_orm(game), moves=moves)
