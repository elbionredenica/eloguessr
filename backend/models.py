from sqlalchemy import Column, Integer, String, Date
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
