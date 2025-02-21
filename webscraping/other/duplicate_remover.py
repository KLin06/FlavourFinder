ingredients = set()

ingredients_file = open (r"webscraping\ingredient-extraction\ingredients.txt", 'r')

for ingredient in ingredients_file.readlines():
    ingredients.add(ingredient.strip())
    
for item in ingredients:
    print(item)