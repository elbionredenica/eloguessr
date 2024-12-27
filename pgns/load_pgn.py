import chess.pgn
import psycopg2
import uuid
import sys
import time
from dotenv import load_dotenv
import os

load_dotenv()

# Database connection details
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")


def get_elo_bucket(elo):
    """Assigns an Elo rating to a bucket."""
    if elo <= 1200:
        return 1
    elif elo <= 1400:
        return 2
    elif elo <= 1600:
        return 3
    elif elo <= 1800:
        return 4
    elif elo <= 2000:
        return 5
    elif elo <= 2200:
        return 6
    elif elo <= 2400:
        return 7
    else:
        return 8


def load_games(pgn_file, db_connection):
    pgn = open(pgn_file)

    bucket_counts = {i: 0 for i in range(1, 9)}  # Initialize counts for each bucket
    target_count = 10000  # Target number of games per bucket
    max_diff = 250 # Maximum allowed Elo difference
    batch_size = 1000 # Size of batch insert
    batch = []

    while True:
        try:
            game = chess.pgn.read_game(pgn)
            if game is None:
                break  # End of file

            headers = game.headers
            white_elo = headers.get("WhiteElo")
            black_elo = headers.get("BlackElo")

            if white_elo is None or black_elo is None:
              continue

            try:
                white_elo = int(white_elo)
                black_elo = int(black_elo)
            except ValueError:
                print("Skipping a game with invalid elo.")
                continue

            avg_elo = (white_elo + black_elo) // 2
            bucket = get_elo_bucket(avg_elo)
            elo_diff = abs(white_elo - black_elo)

            if bucket_counts[bucket] < target_count and elo_diff <= max_diff:
                # Add game to batch
                batch.append(
                    (
                        uuid.uuid4(),
                        str(game),
                        white_elo,
                        black_elo,
                        headers.get("Event"),
                        headers.get("Site"),
                        headers.get("Date"),
                        headers.get("White"),
                        headers.get("Black"),
                        headers.get("Result"),
                        headers.get("UTCDate"),
                        headers.get("UTCTime"),
                        headers.get("ECO"),
                        headers.get("Termination"),
                    )
                )

                if len(batch) >= batch_size:
                    # Insert batch into database
                    insert_games(db_connection, batch)
                    bucket_counts[bucket] += len(batch)
                    print(f"Inserted batch of {len(batch)} games. Current count for bucket {bucket}: {bucket_counts[bucket]}")
                    batch = [] # Clear the batch

        except UnicodeDecodeError as e:
            print(f"Skipping game due to UnicodeDecodeError: {e}")
            continue

    # Insert any remaining games in the last batch
    if batch:
        insert_games(db_connection, batch)
        bucket_counts[bucket] += len(batch)
        print(f"Inserted last batch of {len(batch)} games. Current count for bucket {bucket}: {bucket_counts[bucket]}")

    print(f"Total games loaded: {sum(bucket_counts.values())}")
    db_connection.close()


def insert_games(db_connection, games_batch):
    with db_connection.cursor() as cur:
        cur.executemany(
            """
            INSERT INTO games (game_uuid, pgn, white_elo, black_elo, event, site, game_date, white_player, black_player, result, utc_date, utc_time, eco, termination)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            games_batch,
        )
        db_connection.commit()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python load_pgn.py <filename>.pgn")
        sys.exit(1)

    pgn_file = sys.argv[1]

    try:
        db_connection = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        print("Successfully connected to the database!")
    except psycopg2.OperationalError as e:
        print(f"Error connecting to the database: {e}")
        sys.exit(1)

    start_time = time.time()
    load_games(pgn_file, db_connection)
    end_time = time.time()

    print(f"Total time taken: {end_time - start_time:.2f} seconds")
