from pydantic import BaseModel, validator
from datetime import date
from typing import List, Optional


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

    @validator('game_date', pre=True)
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
