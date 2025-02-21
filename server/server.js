require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const morgan = require("morgan");

const app = express();

app.use(morgan("tiny")); // logger

app.use(cors());
app.use(express.json());

// Get recipes with given ingredients
app.post("/api/get-recipes", async (req, res) => {
  try {
    let ingredientList = req.body.ingredients;

    const query = `
            SELECT r.id, r.title, r.page_link, r.img_url
            FROM recipes r
            JOIN recipe_ingredients ri ON r.id = ri.recipe_id
            JOIN ingredients i ON ri.ingredient_id = i.id
            WHERE i.ingredient IN (${ingredientList.map((_, i) => `$${i + 1}`).join(", ")})
            GROUP BY r.id, r.title, r.page_link, r.img_url
            HAVING COUNT(DISTINCT i.id) = $${ingredientList.length + 1};
        `;

    const params = [...ingredientList, ingredientList.length];

    const results = await db.query(query, params);

    const links = results.rows.map((recipe) => ({ recipe: recipe }));

    res.status(200).json({
      status: "success",
      data: {
        recipes: links,
      },
    });
  } catch (err) {
    console.log(`Error Found: ${err}`);
  }
});

// Get all ingredients
app.get("/api/get-all-ingredients", async (req, res) => {
  try {
    const results = await db.query(`select * from ingredients;`);

    ingredientsList = results.rows.map((ingredient_item) => ingredient_item.ingredient);

    res.status(200).json({
      status: "success",
      data: {
        ingredients: ingredientsList,
      },
    });
  } catch (err) {
    console.log(`Error Found: ${err}`);
  }
});

// Get all saved recipes
app.get("/api/get-saved-recipes", async (req, res) => {
  try {
    const results = await db.query(`select * from saved_recipes;`);

    res.status(200).json({
      status: "success",
      data: {
        recipe_list: results.rows,
      },
    });
  } catch (err) {
    console.log(`Error Found: ${err}`);
  }
});

// Add a recipe to the saved recipe list
app.post("/api/post-recipe", async (req, res) => {
  try {
    const query = `INSERT INTO saved_recipes (title, page_link, ingredient_list)
            VALUES ($1, $2, $3) ON CONFLICT (title) DO NOTHING;`;

    const params = [req.body.title, req.body.page_link, req.body.ingredient_list];
    const results = await db.query(query, params);

    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    console.log(`Error Found: ${err}`);
  }
});

// Delete a recipe from the saved recipe list
app.delete("/api/delete-recipe", async (req, res) => {
  try {
    console.log( req.body.title)
    title = req.body.recipe?.title || req.body?.title

    const results = await db.query("DELETE FROM saved_recipes WHERE title = $1", [title]);

    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    console.log(`Error Found: ${err}`);
  }
});

// Get ingredient list of a single recipe
app.post("/api/get-ingredients-from-recipe", async (req, res) => {
  try {
    const query = `SELECT STRING_AGG(i.ingredient, ', ') AS ingredient_list
                        FROM recipes r
                        JOIN recipe_ingredients ri ON r.id = ri.recipe_id
                        JOIN ingredients i ON ri.ingredient_id = i.id
                        WHERE r.title = $1
                        GROUP BY r.title
                        `;

    const results = await db.query(query, [req.body.recipe.title]);

    res.status(200).json({
      status: "success",
      data: results.rows,
    });
  } catch (err) {
    console.log(`Error Found: ${err}`);
  }
});

app.delete("/api/delete-all-recipes", async (req, res) => {
  try {
    const results = await db.query("TRUNCATE saved_recipes;");

    res.status(200).json({
        status: "success"
    })
  } catch (err) {
    console.log(`Error Found: ${err}`);
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});
