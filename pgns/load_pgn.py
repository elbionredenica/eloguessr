import chess.pgn
import psycopg2
import os
import argparse
from datetime import datetime
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())



# Database connection details (replace with your actual credentials)
DB_PARAMS = {
    "host": os.getenv("DB_HOST"),
    "database": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD")
}


def get_db_connection():
    """Establishes a connection to the PostgreSQL database."""
    conn = None
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        print("Database connection established.")
    except Exception as e:
        print(f"Error connecting to database: {e}")
    return conn


def parse_date(date_str):
    """Parses a date string in YYYY.MM.DD format to a date object."""
    try:
        return datetime.strptime(date_str, "%Y.%m.%d").date()
    except ValueError:
        return None


def insert_game_data(conn, pgn_file):
    """Parses a PGN file and inserts game data into the database."""
    with open(pgn_file) as f:
        while True:
            try:
                game = chess.pgn.read_game(f)
                if game is None:
                    break  # End of file

                headers = game.headers
                white_elo = int(headers.get("WhiteElo", 0))  # Default to 0 if not present
                black_elo = int(headers.get("BlackElo", 0))
                game_date = parse_date(headers.get("Date", ""))
                
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO games (pgn, white_elo, black_elo, event, site, game_date, white_player, black_player, result, utc_date, utc_time, eco, termination)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (game_id) DO NOTHING; 
                        """,
                        (
                            str(game),
                            white_elo,
                            black_elo,
                            headers.get("Event", ""),
                            headers.get("Site", ""),
                            game_date,
                            headers.get("White", ""),
                            headers.get("Black", ""),
                            headers.get("Result", ""),
                            headers.get("UTCDate", ""),
                            headers.get("UTCTime", ""),
                            headers.get("ECO", ""),
                            headers.get("Termination", ""),
                        ),
                    )
                    conn.commit()
            except UnicodeDecodeError as e:
                print(f"Skipping game due to UnicodeDecodeError: {e}")
                # You might want to log the file position or game details for later inspection
            except ValueError as e:
                print(f"Skipping game due to ValueError during parsing: {e}")
                # Handle other potential parsing errors
            except Exception as e:
                print(f"An unexpected error occurred: {e}")
                # Handle other unexpected errors


def main():
    parser = argparse.ArgumentParser(description="Load Lichess PGN data into PostgreSQL database.")
    parser.add_argument("pgn_file", help="Path to the PGN file to load.")
    args = parser.parse_args()

    pgn_file = args.pgn_file

    if not os.path.isfile(pgn_file):
        print(f"Error: File not found: {pgn_file}")
        return

    conn = get_db_connection()
    if conn is None:
        return

    try:
        insert_game_data(conn, pgn_file)
        print(f"Successfully loaded data from {pgn_file}")
    finally:
        if conn:
            conn.close()
            print("Database connection closed.")


if __name__ == "__main__":
    main()
