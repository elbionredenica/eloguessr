from sqlalchemy import Column, Integer, String, Date, Interval, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID # use UUID
import uuid

Base = declarative_base()


class Game(Base):
    __tablename__ = "games"

    # game_id = Column(Integer, primary_key=True, index=True) # delete this line
    game_uuid = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    pgn = Column(String)
    white_elo = Column(Integer, index=True)
    black_elo = Column(Integer, index=True)
    event = Column(String)
    site = Column(String)
    game_date = Column(Date, index=True)
    white_player = Column(String)
    black_player = Column(String)
    result = Column(String)
    utc_date = Column(String)
    utc_time = Column(String)
    eco = Column(String)
    termination = Column(String)


class GameMoveTime(Base):
    __tablename__ = "game_move_times"

    game_uuid = Column(
        UUID(as_uuid=True),
        ForeignKey("games.game_uuid"),
        primary_key=True,
        index=True,
    )
    move_number = Column(Integer, primary_key=True)
    white_time = Column(Interval, nullable=True)
    black_time = Column(Interval, nullable=True)
