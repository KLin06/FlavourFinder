import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

# Set up Selenium
options = webdriver.ChromeOptions()
options.add_argument("--headless")  # Run in headless mode
options.add_argument("--disable-blink-features=AutomationControlled")
options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option("useAutomationExtension", False)

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")  # Hide Selenium flag

# Importing ingredient list
ingredients_file = open (r"webscraping\ingredient-extraction\ingredients.txt", 'r')

# Set up ingredient list
ingredients = set()
for ingredient in ingredients_file.readlines():
    ingredients.add(ingredient.strip())

# Set up map of recipe to its ingredients
dict = {}

# Declaration of function to find ingredients
def ingredient_extract(text):
    ingredient_list = set()
    
    for ingredient in ingredients:
        if ingredient in text.lower():
            ingredient_list.add(ingredient)

    return ingredient_list
        
# Open recipes.txt 
with open (r"webscraping\link-extraction\recipe_sites.txt", 'r') as reader:
    page_list = reader.readlines()[:1000]

    # Driver Code
    for page in page_list:
        page = page.strip()
        
        # Open the page
        driver.get(page)
    
        soup = BeautifulSoup(driver.page_source, "html.parser")

        # Select the title of the page
        title_element = soup.find("h1", class_ = "article-heading text-headline-400")
        title = title_element.text.strip()
        
        # Select the image in the page
        img_url = ""
        
        try:
            img_element = soup.find_all(class_="figure-media")
            
            if img_element:
                img_element = img_element[-1]
                img_element = img_element.find("img")
                img_url = img_element.get("data-src", img_element.get("src"))
    
            else:   
                img_element = soup.find(class_="primary-image__media")
                
                if img_element:
                    img_element = img_element.find("img")
                    img_url = img_element.get("data-src", img_element.get("src"))
                
                else:
                    img_element = soup.find("article", id = "allrecipes-article_1-0")
                    
                    if img_element:
                        img_element = img_element.find("img")
                        img_url = img_element.get("data-src", img_element.get("src"))
                        
        except Exception as e:
            print(f"Error: {e}")
        
        # Select the list elements inside the page containing ingredients
        line_list = soup.find_all("li", class_ = "mm-recipes-structured-ingredients__list-item")
        
        ingredient_list = set()

        for paragraph in line_list:
            text = paragraph.find("p")  # Find <p> inside <li>
            
            if text: # Determine if it exists
                # Extract the text from the element
                text = text.text.strip()
                
                # Map the page to the ingredients
                ingredient_list.update(ingredient_extract(text))
        
        page_info = {
            "title": title,
            "ingredients": list(ingredient_list),
            "img_url":img_url
        }
        
        dict[page] = page_info
        
        time.sleep(2)

driver.quit()

# Export as json file
json_file = json.dumps(dict, indent=4)

with open(r"webscraping\ingredient-extraction\recipe_ingredients.json", "w") as output_file:
    output_file.write(json_file)

print("Finished writing to json file")