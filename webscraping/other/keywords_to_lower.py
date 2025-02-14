keywords_file = open ("webscraping\ingredient-extraction\keywords.txt", 'r')
for word in keywords_file.readlines():
    cleaned_word = word.strip().lower()
    if cleaned_word:  # Ensure it's not an empty string
        print(cleaned_word)

keywords_file.close()