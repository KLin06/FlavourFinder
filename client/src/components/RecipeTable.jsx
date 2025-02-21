import React, { useContext } from "react";
import { SavedRecipesContext } from "../context/Context";
import { Empty } from "antd";
import dbQuery from "../apis/dbQuery";
import styles from "./css_modules/RecipeTable.module.css";

const RecipeTable = () => {
  let { savedRecipes, setSavedRecipes } = useContext(SavedRecipesContext);

  const handleClick = (recipeItem) => {
    window.open(recipeItem.page_link);
  };

  const handleDelete = async (recipeItem) => {
    try {
      const response = await dbQuery.delete("/delete-recipe", { data: recipeItem });

      setSavedRecipes(savedRecipes.filter((recipe) => recipe.title !== recipeItem.title));
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  const handleClear = async (e) => {
    e.preventDefault();
    try {
      const response = await dbQuery.delete("/delete-all-recipes");
      setSavedRecipes([]);
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  return (
    <div id={styles.recipeTable}>
      <table style={{ width: "100%" }}>
        <thead>
          <tr className={styles.tableRow}>
            <th className={styles.recipeCol}>Recipe</th>
            <th className={styles.ingredientCol}>Ingredients</th>
            <th className={styles.imgCol}>
              <button onClick={handleClear} style = {{backgroundColor: "#0958d9"}}>Clear All</button>
            </th>
          </tr>
        </thead>
        <div id={styles.scrollTable}>
          <tbody>
            {savedRecipes?.length > 0 ? (
              savedRecipes.map((recipeItem) => {
                return (
                  <tr className={styles.tableRow}>
                    <td className={styles.recipeCol} onClick={() => handleClick(recipeItem)}>
                      {recipeItem.title}
                    </td>
                    <td className={styles.ingredientCol}> {recipeItem.ingredient_list}</td>
                    <td className={styles.imgCol}>
                      <img src="/deleteicon.png" style={{ width: "25px", height: "25px" }} onClick={() => handleDelete(recipeItem)} />
                    </td>
                  </tr>
                );
              })
            ) : (
              <Empty
                style={{
                  justifySelf: "center",
                  alignContent:"center",
                  alignSelf: "center",
                  width: "100%",
                  height: "65vh",
                }}
                description={<span style={{ color: "whitesmoke", fontSize: "18px" }}>No Recipes Found</span>}
              />
            )}
          </tbody>
          </div>
      </table>
    </div>
  );
};

export default RecipeTable;
