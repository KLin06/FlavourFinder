import React, { useState, useContext, createContext, useEffect } from "react";
import dbQuery from "../apis/dbQuery";

export const IngredientsContext = createContext();
export const SelectedIngredientsContext = createContext();
export const RecipeListContext = createContext();
export const SavedRecipesContext = createContext();

const IngredientsContextProvider = (props) => {
  const [ingredientList, setIngredientList] = useState([]);

  return (
    <IngredientsContext.Provider value={{ ingredientList, setIngredientList }}>
      {props.children}
    </IngredientsContext.Provider>
  );
};

export const SelectedIngredientsContextProvider = (props) => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  return (
    <SelectedIngredientsContext.Provider
      value={{ selectedIngredients, setSelectedIngredients }}
    >
      {props.children}
    </SelectedIngredientsContext.Provider>
  );
};

export const RecipeListContextProvider = (props) => {
  const { selectedIngredients } = useContext(SelectedIngredientsContext);

  const [recipeList, setRecipeList] = useState([]);

  const loadRecipes = async () => {
    if (selectedIngredients.length == 0) {
      setRecipeList([]);
    } else {
      try {
        const response = await dbQuery.post("/get-recipes", {
          ingredients: selectedIngredients,
        });

        setRecipeList(response.data.data.recipes);
      } catch (err) {
        console.log(`Error: ${err}`);
      }
    }
  };

  return (
    <RecipeListContext.Provider
      value={{ recipeList, setRecipeList, loadRecipes }}
    >
      {props.children}
    </RecipeListContext.Provider>
  );
};

export const SavedRecipesContextProvider = (props) => {
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect (() => {
    const fetchData = async () => {
      try {
        const response = await dbQuery.get("/get-saved-recipes");
        setSavedRecipes(response.data.data.recipe_list);
      } catch (err) {
        console.log(`Error: ${err}`);
      }
    };

    fetchData();
  }, [])

  return (
    <SavedRecipesContext.Provider value={{ savedRecipes, setSavedRecipes }}>
      {props.children}
    </SavedRecipesContext.Provider>
  );
};

export default IngredientsContextProvider;
