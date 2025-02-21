import React, { useContext, useState, useEffect } from "react";
import RecipeIcon from "./RecipeIcon";
import {
  RecipeListContext,
  SelectedIngredientsContext,
  SavedRecipesContext,
} from "../context/Context";
import { Empty, Pagination } from "antd";
import styles from "./css_modules/RecipeDisplay.module.css"

const RecipeDisplay = () => {
  const { recipeList } = useContext(RecipeListContext);
  const { selectedIngredients } = useContext(SelectedIngredientsContext);
  const { savedRecipes } = useContext(SavedRecipesContext);

  const [pageNum, setPageNum] = useState(1);

  const handlePageChange = (page) => {
    setPageNum(page);
  };

  const screenWidth = window.innerWidth;
  const itemsPerRow = Math.floor((0.7 * (screenWidth - 10)) / 185);

  const [upperBound, setUpperBound] = useState(pageNum * 2);
  const [lowerBound, setLowerBound] = useState(0);

  useEffect(() => {
    setLowerBound(2 * itemsPerRow * (pageNum - 1));
    setUpperBound(2 * itemsPerRow * pageNum);
  }, [pageNum]);

  useEffect(() => {
    setPageNum(1);
  }, [selectedIngredients]);

  return (
    <div>
      <div id = {styles.recipeDisplay}>
        {recipeList && recipeList.length > 0 ? (
          recipeList.slice(lowerBound, upperBound).map((recipe) => {
            return <RecipeIcon recipe={recipe} />;
          })
        ) : (
          <Empty
            style={{
              justifyContent: "center",
              alignContent: "center",
              width: "80vw",
              height: "60vh",
            }}
            description={
              <span style={{ color: "whitesmoke", fontSize: "18px" }}>
                No Recipes Found
              </span>
            }
          />
        )}
      </div>
      {recipeList && recipeList.length > 0 && (
        <Pagination
          defaultCurrent={1}
          total={Math.ceil((recipeList.length * 10) / (itemsPerRow * 2))}
          onChange={handlePageChange}
          style={{ margin: "10px", justifySelf: "right" }}
        />
      )}
    </div>
  );
};

export default RecipeDisplay;
