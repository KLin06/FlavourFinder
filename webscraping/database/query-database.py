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

try:
    # Choose ingredient
    ingredient_list = ['onion']
    
    query = (f"""SELECT r.id, r.title, r.page_link, r.img_url
    FROM recipes r
    JOIN recipe_ingredients ri ON r.id = ri.recipe_id
    JOIN ingredients i ON ri.ingredient_id = i.id
    WHERE i.ingredient IN ({','.join(['%s'] * len(ingredient_list))})
    GROUP BY r.id, r.title, r.page_link, r.img_url
    HAVING COUNT(DISTINCT i.id) = {len(ingredient_list)};
    """)
    
    cur.execute(query, tuple(ingredient_list))
    
    recipes = cur.fetchall()
    for recipe in recipes:
        recipe_id, title, page_link, img_url = recipe
        print(f"ID: {recipe_id}")
        print(f"Title: {title}")
        print(f"Page Link: {page_link}")
        print(f"Image URL: {img_url}")
        print("-" * 50)
    
except Exception as e:
    print (f"Error: {e}")


cur.close()
conn.close()