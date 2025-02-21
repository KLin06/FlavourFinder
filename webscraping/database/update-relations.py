import json
import psycopg2
import os
from dotenv import load_dotenv

# Import Recipes
json_file = open (r"webscraping\ingredient-extraction\recipe_ingredients.json", 'r')
recipe_ingredient_data = json.load(json_file)
    
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

try: 
    # Iterate through the URLs
    for page, info in recipe_ingredient_data.items():
        ingredient_list = info['ingredients']
        
        cur.execute("SELECT id FROM recipes WHERE page_link = %s;", (page,))
        recipe_result = cur.fetchone()
        
        if not recipe_result:
            print(f"Recipe not found in database: {page}")
            continue 
        
        page_id = recipe_result[0]
        
        # Iterate through the ingredients
        for ingredient in ingredient_list:
            cur.execute("SELECT id FROM ingredients WHERE ingredient = %s;", (ingredient,))
            ingredient_result = cur.fetchone()
            
            if not recipe_result:
                print(f"Ingredient not found in database: {ingredient}")
                continue 
            
            ingredient_id = ingredient_result[0]
            
            # Upload the data entry to recipe_ingredients
            cur.execute("INSERT INTO recipe_ingredients (recipe_id, ingredient_id) VALUES (%s, %s) ""ON CONFLICT (recipe_id, ingredient_id) DO NOTHING;",(page_id, ingredient_id))
    
    conn.commit()
    print("Data uploaded to recipe_ingredients successfully")
    
except Exception as e:
    print(f"Error: {e}")


cur.close()
conn.close()

print("Connection Closed")