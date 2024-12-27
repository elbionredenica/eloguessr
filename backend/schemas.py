from pydantic import BaseModel, validator
from datetime import date
from typing import List, Optional
import uuid 


class GameBase(BaseModel):
    """Base model for a game."""

    white_elo: int
    black_elo: int
    event: str
    site: str
    game_date: Optional[date]
    white_player: str
    black_player: str
    result: str
    utc_date: str
    utc_time: str
    eco: str
    termination: str

    @validator("game_date", pre=True)
    def parse_game_date(cls, value):
        if isinstance(value, str):
            try:
                return date.fromisoformat(value)
            except ValueError:
                return None
        return value


class Game(GameBase):
    """Model for a game retrieved from the database."""

    game_id: int
    pgn: str

    class Config:
        from_attributes = True


class GameList(BaseModel):
    """Model for a list of games."""

    games: List[Game]


class GameMove(BaseModel):
    """Model for a single game move."""

    move_number: int
    san: str


class GameDetails(BaseModel):
    """Model for game details, including moves."""

    game: Game
    moves: List[GameMove]


class EloGuess(BaseModel):
    """Model for submitting Elo guesses."""

    white_guess: int
    black_guess: int


class Score(BaseModel):
    """Model for the calculated score."""

    score: int


class GameElo(BaseModel):
    """Model for retrieving actual Elo ratings."""

    white_elo: int
    black_elo: int


class ObfuscatedGame(BaseModel):
    """Model for an obfuscated game identifier."""

    game_uuid: str  # Use a UUID string instead of an integer ID

    class Config:
        from_attributes = True


class MoveData(BaseModel):
    """Model for the data needed to display a move."""

    fen: str


class MoveResponse(BaseModel):
    """Model for the response to a move request."""

    move_data: MoveData
    is_last_move: bool = False


class InitialGameData(BaseModel):
    """Model for the initial game data sent to the frontend."""

    game_uuid: str
    start_fen: str
    total_moves: int
    move_list: List[str]


class EloReveal(BaseModel):
    """Model for revealing Elo after a guess."""

    white_elo: int
    black_elo: int
    game_date: Optional[date]
    white_player: str
    black_player: str
    lichess_url: Optional[str]


class MoveTime(BaseModel):
    """Model for a move time in a game"""
    move_number: int
    white_time: Optional[str] = None
    black_time: Optional[str] = None
    think_time: Optional[str] = None
