import re
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

# Import keywords
keywords_file = open (r"webscraping\ingredient-extraction\keywords.txt", 'r')
keywords = set()

for word in keywords_file.readlines():
    word = word.strip()
    keywords.add(word)
    keywords.add(word + 's')

keywords_file.close()

# Function Declaration
# Remove keywords
def remove_words(text):
    pattern = r'\b(?:' + '|'.join(map(re.escape, keywords)) + r')\b'
    text = re.sub(pattern, '', text, flags=re.IGNORECASE).strip()
    text = text.strip('/')
    return text

# Extract the ingredient from the line
def ingredient_extraction(text):
    # Remove all non unicode characters
    text = text.encode('ascii',errors='ignore').decode().strip()
    
    # Remove the ingredient descriptor 
    text = text.split(',')[0]
    text = text.split('-')[0]
    text = text.split(" or ")[0]
    
    # Remove the bracketed sections
    while '(' in text and ')' in text:
        text = text[:text.index('(')] + text[text.index(')') + 1:]
    
    # Remove the numbers
    text = ''.join(i for i in text if not i.isdigit())
    
    # Remove the unit and size words
    text = remove_words(text)
    
    # Turn the text to lowercase
    text = text.lower()
    
    return text.strip()

# Set up Selenium
options = webdriver.ChromeOptions()
options.add_argument("--headless")  # Run in headless mode
options.add_argument("--disable-blink-features=AutomationControlled")
options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option("useAutomationExtension", False)

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")  # Hide Selenium flag

# Set up ingredient list
ingredients = set()

# Set up map of recipe to its ingredients

# Open recipes.txt 
with open (r"webscraping\link-extraction\recipe_sites.txt", 'r') as reader:
    page_list = reader.readlines()[50:100]

    # Open the webpage
    for page in page_list:
        driver.get("https://www.allrecipes.com/one-pan-chicken-breast-and-asparagus-in-lemon-cream-sauce-recipe-8620633")
        soup = BeautifulSoup(driver.page_source, "html.parser")

        # Select the elements inside the 
        ingredient_list = soup.find_all("li", class_ = "mm-recipes-structured-ingredients__list-item")

        for ingredient in ingredient_list:
            ingredient_text = ingredient.find("p")  # Find <p> inside <li>
            if ingredient_text: # Determine if it exists
                # Extract the text from the element
                ingredient_text = ingredient_text.text.strip()
                ingredient_text = ingredient_extraction(ingredient_text)
                
                if ingredient_text :
                    ingredients.add(ingredient_text)
        
driver.quit()

# Print out ingredients
for ingredient in ingredients:
    print(ingredient)
