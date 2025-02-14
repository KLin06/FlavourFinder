require("dotenv").config();
const express = require("express");
const cors = require("cors")
const db = require("./db");
const morgan = require("morgan");

const app = express();

app.use(morgan("tiny")); // logger

app.use(cors());
app.use(express.json());

// Get recipes with given ingredients
app.post("/api/get-recipes", async (req, res) => {
    try{
        let ingredientList = req.body.ingredients;
        console.log(ingredientList)

        const query = (`
            SELECT r.id, r.title, r.page_link, r.img_url
            FROM recipes r
            JOIN recipe_ingredients ri ON r.id = ri.recipe_id
            JOIN ingredients i ON ri.ingredient_id = i.id
            WHERE i.ingredient IN (${ingredientList.map((_, i) => `$${i + 1}`).join(", ")})
            GROUP BY r.id, r.title, r.page_link, r.img_url
            HAVING COUNT(DISTINCT i.id) = $${ingredientList.length + 1};
        `);

        const params = [...ingredientList, ingredientList.length];

        const results = await db.query(query, params);

        const links = results.rows.map(recipe => ({recipe:recipe}));

        res.status(200).json({
            status: "success",
            data: {
                recipes: links
            }
        })

    } catch (err) {
        console.log(`Error Found: ${err}`)
    }
});

// Get all ingredients
app.get("/api/get-all-ingredients",  async (req, res) => {
    try{
        const results = await db.query(`select * from ingredients;`);

        ingredientsList = results.rows.map(ingredient_item => ingredient_item.ingredient);

        res.status(200).json({
            status: 'success',
            data: {
                ingredients: ingredientsList
            }
        })
    } catch (err) {
        console.log(`Error Found: ${err}`)
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});
