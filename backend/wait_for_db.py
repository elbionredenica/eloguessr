import time
import os
import psycopg2

DB_HOST = os.environ.get("DB_HOST")
DB_NAME = os.environ.get("DB_NAME")
DB_USER = os.environ.get("DB_USER")
DB_PASSWORD = os.environ.get("DB_PASSWORD")
DB_PORT = os.environ.get("DB_PORT", "5432")


def wait_for_db():
    retries = 0
    max_retries = 10
    while retries < max_retries:
        try:
            conn = psycopg2.connect(
                host=DB_HOST,
                database=DB_NAME,
                user=DB_USER,
                password=DB_PASSWORD,
                port=DB_PORT
            )
            conn.close()
            print("Database is ready!")
            return
        except psycopg2.OperationalError as e:
            retries += 1
            print(f"Database not ready yet. Error: {e}")
            print(f"Retrying in 5 seconds... ({retries}/{max_retries})")
            time.sleep(5)
    raise Exception("Failed to connect to database after multiple retries.")


if __name__ == "__main__":
    wait_for_db()
