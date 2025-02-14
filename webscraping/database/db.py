import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Get database credentials from environment variables
DATABASE = os.getenv("DB_NAME")
HOST = os.getenv("DB_HOST")
USER = os.getenv("DB_USER")
PASSWORD = os.getenv("DB_PASSWORD")
PORT = os.getenv("DB_PORT")


# Connect to PostgreSQL using .env variables
conn = psycopg2.connect(
    database=DATABASE,
    host=HOST,
    user=USER,
    password=PASSWORD,
    port=PORT
)

# Create a cursor
cur = conn.cursor()

print("Connected to Database")

cur.close()
conn.close()