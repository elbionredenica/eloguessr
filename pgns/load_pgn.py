import chess.pgn
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.models import Base, Game
from dotenv import load_dotenv
import uuid
from datetime import datetime

load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)


def load_games_from_pgn(pgn_file):
    db = SessionLocal()
    try:
        with open(pgn_file) as f:
            while True:
                game = chess.pgn.read_game(f)
                if game is None:
                    break

                headers = game.headers
                game_uuid = uuid.uuid4()

                # Handle unknown date format
                game_date_str = headers.get("Date")
                if game_date_str == "????.??.??":
                    game_date = None
                else:
                    try:
                        game_date = datetime.strptime(game_date_str, "%Y.%m.%d").date()
                    except ValueError:
                        print(f"Warning: Invalid date format for game: {game_uuid}")
                        game_date = None

                # Handle non-numeric Elo ratings
                def parse_elo(elo_str):
                    try:
                        return int(elo_str)
                    except ValueError:
                        return 0  # Or None if you prefer to store NULLs

                white_elo = parse_elo(headers.get("WhiteElo", "0"))
                black_elo = parse_elo(headers.get("BlackElo", "0"))

                db_game = Game(
                    game_uuid=game_uuid,
                    pgn=str(game),
                    white_elo=white_elo,  # Use parsed Elo or default
                    black_elo=black_elo,  # Use parsed Elo or default
                    event=headers.get("Event", ""),
                    site=headers.get("Site", ""),
                    game_date=game_date,
                    white_player=headers.get("White", ""),
                    black_player=headers.get("Black", ""),
                    result=headers.get("Result", ""),
                    utc_date=headers.get("UTCDate", ""),
                    utc_time=headers.get("UTCTime", ""),
                    eco=headers.get("ECO", ""),
                    termination=headers.get("Termination", ""),
                )

                db.add(db_game)
                db.commit()
                print(f"Game {game_uuid} added to the database.")
    except Exception as e:
        db.rollback()
        print(f"Error loading games: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    import sys

    if len(sys.argv) != 2:
        print("Usage: python load_pgn.py <filename.pgn>")
        sys.exit(1)

    pgn_file = sys.argv[1]
    load_games_from_pgn(pgn_file)
