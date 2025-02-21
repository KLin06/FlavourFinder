import React, { useContext, useEffect } from "react";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { SavedRecipesContext } from "../context/Context";
import dbQuery from "../apis/dbQuery";
import styles from "./css_modules/RecipeIcon.module.css"

const RecipeIcon = ({ recipe }) => {
  const { savedRecipes, setSavedRecipes } = useContext(SavedRecipesContext);

  // Opens the linked page
  const handleClick = () => {
    window.open(recipe.recipe.page_link);
  };

  // Handles pressing the heart icon
  const handleSave = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!savedRecipes.map((recipeItem) => recipeItem.title).includes(recipe.recipe.title)) {
      addRecipe();
    } else {
      deleteRecipe();
    }
  };

  // Add a recipe to the saved recipe list
  const addRecipe = async () => {
    try {
      // Get the ingredient list of this recipe)
      var ingredientList = await getIngredientsFromRecipe();
      ingredientList = ingredientList.data.data[0].ingredient_list;

      const recipeJSON = {
        title: recipe.recipe.title,
        page_link: recipe.recipe.page_link,
        ingredient_list: ingredientList,
      };

      const response = await dbQuery.post("/post-recipe", recipeJSON);
      setSavedRecipes([...savedRecipes, recipeJSON]);
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  // Delete a recipe from the saved recipe list
  const deleteRecipe = async () => {
    try {
      const response = await dbQuery.delete("/delete-recipe", { data: recipe });

      setSavedRecipes(savedRecipes.filter((recipeItem) => recipeItem.title !== recipe.recipe.title));
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };
  
  // Get the list of ingredients of a single recipe
  const getIngredientsFromRecipe = async () => {
    try {
      const response = await dbQuery.post("/get-ingredients-from-recipe", recipe);
      return response;
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  const iconItems = {
    true: <HeartFilled style={{ fontSize: "30px", color: "red" }} onClick={handleSave} />,
    false: <HeartOutlined style={{ fontSize: "30px", color: "white" }} onClick={handleSave} />,
  };

  return (
    <div className={styles.recipeIcon} onClick={handleClick}>
      <img className={styles.recipeImg} src={recipe.recipe.img_url} alt="Food" />
      <div className={styles.iconContainer}>{iconItems[savedRecipes.map((recipeItem) => recipeItem.title).includes(recipe.recipe.title)]}</div>
      <h4>{recipe.recipe.title}</h4>
    </div>
  );
};

export default RecipeIcon;
