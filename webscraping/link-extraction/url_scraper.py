import time
from collections import deque
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

# Function Declaration
# Determines whether a page is a recipe page
def is_recipe_page(href):
    # Skip authentication pages
    if "authentication" in href:
        return False
    
    if href.startswith("https://www.allrecipes.com/recipe/"):
        return True
    
    # Split into relative URL
    parts = href.rstrip('/').split('/')
    last_part = parts[-1]
    
    # Ensure there is a hyphen to avoid IndexError
    if '-' in last_part:  
        words = last_part.split('-')  
        return words[-2] == "recipe" and words[-1].isdigit()
    
    return False

# Set up Selenium
options = webdriver.ChromeOptions()
options.add_argument("--headless")  # Run in headless mode
options.add_argument("--disable-blink-features=AutomationControlled")
options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option("useAutomationExtension", False)

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")  # Hide Selenium flag

# Stores URLs to be scraped (For initial run put "https://www.allrecipes.com/" in the queued_sites.txt)
url_lib = deque([])

# Keep track of sites
visited_sites = set()
recipe_sites = set()

# Import sets
recipe_file = open ("webscraping/link-extraction/recipe_sites.txt", 'r')
visited_file = open ("webscraping/link-extraction/visited_sites.txt", 'r')
queued_file = open ("webscraping/link-extraction/queued_sites.txt", 'r')

# Transfer data from files to python
for site in recipe_file.readlines():
    recipe_sites.add(site.strip())

for site in visited_file.readlines():
    visited_sites.add(site.strip())
    
for site in queued_file.readlines():
    url_lib.append(site.strip()) 

# Close files
queued_file.close()
visited_file.close()

# Set page counter
count = 0
save_count = 0

# Extract links
while(len(url_lib) > 0):
    # Extract the current page
    page = url_lib.popleft()
    
    # Skip pages that were already visited
    if page in visited_sites:
        continue
    
    # Set page as visited
    visited_sites.add(page)
    
    # Open the webpage
    driver.get(page)
    soup = BeautifulSoup(driver.page_source, "html.parser")
    
    # Find all elements with 'a' attribute
    url_list = soup.find_all("a")
    for url in url_list:
        href = url.get("href")
        
        # Filter out non-links and visited sites
        if href and href not in visited_sites: 
            # If the site is a recipe site
            if is_recipe_page(href):
                recipe_sites.add(href)
                url_lib.append(href)
            # If the site contains recipe sites
            elif href.startswith("https://www.allrecipes.com/recipes") or href.startswith("https://www.allrecipes.com/gallery"):
                url_lib.append(href)
    
    # Implement a page counter to limit program length
    if count == 20:
        # reset the page counter
        count %= 20
        
        # Write sets onto text
        recipe_file = open ("webscraping/link-extraction/recipe_sites.txt", 'w')
        visited_file = open ("webscraping/link-extraction/visited_sites.txt", 'w')
        queued_file = open ("webscraping/link-extraction/queued_sites.txt", 'w')

        # Save into save file
        for site in recipe_sites:
            recipe_file.write(site + "\n")
            
        for site in visited_sites:
            visited_file.write(site + "\n")
            
        for site in url_lib:
            queued_file.write(site + "\n")
        
        # Close save files
        recipe_file.close()
        visited_file.close()
        queued_file.close()
        
        # Increment save count
        save_count += 1
        
        print(f"Saved {save_count} times successfully")
        
        # Terminate after 30 saves (600 pages)
        if(save_count > 29):
            break
    
    # Increment page count
    count = count + 1
    
    # Avoid overloading the server
    time.sleep(3)

driver.quit()

print("Program exited successfully")
    