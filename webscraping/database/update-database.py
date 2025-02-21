import psycopg2
import os
from dotenv import load_dotenv
import json

# Import Recipes
json_file = open (r"webscraping\ingredient-extraction\recipe_ingredients.json", 'r')
recipe_list = json.load(json_file)

# Import ingredients
ingredient_file = open (r"webscraping/ingredient-extraction/ingredients.txt", 'r')
ingredient_list = [(ingredient.strip(), ) for ingredient in ingredient_file.readlines()]
    
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

# Log Recipe
try: 
    for recipe in recipe_list:
        cur.execute("INSERT INTO recipes (page_link, title, img_url) VALUES (%s, %s, %s) ON CONFLICT (page_link) DO NOTHING;", 
                    [recipe, recipe_list[recipe]['title'], recipe_list[recipe]['img_url']])
        
    conn.commit()
    print("Data uploaded to recipes successfullly")
    
except Exception as e:
    print(f"Error: {e}")

# Log Ingredients
try: 
    for ingredient in ingredient_list:
        cur.execute("INSERT INTO ingredients (ingredient) VALUES (%s) ON CONFLICT (ingredient) DO NOTHING;", ingredient)
        
    conn.commit()
    print("Data uploaded to ingredients successfullly")
    
except Exception as e:
    print(f"Error: {e}")

cur.close()
conn.close()

print("Connection Closed")