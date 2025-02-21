# 🍽️ Recipe Finder

## Overview
Recipe Finder is a web application that allows users to search for recipes based on selected ingredients. The app provides a visually appealing UI that displays matching recipes with images, titles, and links to full recipes.

## Features
- 🔍 **Ingredient-Based Search**: Users can input ingredients, and the app retrieves recipes containing those ingredients.
- 🖼️ **Image Display**: Recipes are displayed with their images for a more engaging experience.
- 📋 **Recipe Details**: Each recipe includes a title, an image, and a link to the full recipe.
- 🎨 **Responsive UI**: Works seamlessly across devices with a modern and dark-themed UI.
- ⏳ **Pagination**: Users can navigate through multiple pages of recipe results.

## Technologies Used
- **Frontend**: React, Vite, Ant Design (AntD), Material UI, Bootstrap, CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Web Scraping**: BeautifulSoup & Selenium (for ingredient extraction)

## Installation & Setup
### Prerequisites
- Install **Node.js** & **npm**
- Install **PostgreSQL**

### Clone the Repository
```sh
git clone https://github.com/your-username/recipe-finder.git
cd recipe-finder
```

### Install Dependencies
#### Client (Frontend)
```sh
cd client
npm install
npm run dev
```

#### Server (Backend)
```sh
cd server
npm install
npm start
```

## Environment Variables (.env)
Create a `.env` file in the **server** directory and add:
```
DATABASE_URL=your_database_url
PORT=4000
```

## API Routes
| Method | Endpoint         | Description                     |
|--------|----------------|---------------------------------|
| `GET`  | `/get-recipes`  | Fetch recipes based on ingredients |
| `GET`  | `/get-all-ingredients` | Get all available ingredients |
| `POST` | `/add-recipe`   | Add a new recipe to the database |

## Usage
1. Start the **backend** (`npm start` in the server folder).
2. Start the **frontend** (`npm run dev` in the client folder).
3. Open **localhost:5173** (or the port shown in your terminal).
4. Add ingredients and submit to fetch matching recipes.

## Screenshots
### Homepage:
![Recipe Finder Screenshot](https://via.placeholder.com/800x400?text=Recipe+Finder+Screenshot)

## Future Enhancements
- ⭐ User authentication (save favorite recipes)
- 📝 Recipe ratings & reviews
- 📦 Recipe categories (e.g., vegetarian, keto, etc.)
- 🔍 Advanced filtering options

## Contributors
- **KevinLin** - Developer ([GitHub Profile](https://github.com/KLin06))

## License
This project is licensed under the MIT License.

---
🚀 **Enjoy cooking with Recipe Finder!** 🍲

