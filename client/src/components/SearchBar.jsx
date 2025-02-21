import React, { useContext, useEffect } from 'react';
import dbQuery from '../apis/dbQuery';
import AutoComplete from './AutoComplete';
import IngredientModal from '../components/IngredientModal'
import { IngredientsContext, RecipeListContext} from '../context/Context';
import styles from './css_modules/SearchBar.module.css'

const SearchBar = () => {
  const {setIngredientList} = useContext(IngredientsContext);
  const {loadRecipes} = useContext(RecipeListContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    loadRecipes();
  }

  useEffect(() => {
    const fetchData = async() => {
      try{
        const response = await dbQuery.get("/get-all-ingredients");
        setIngredientList(response.data.data.ingredients)
      } catch (err) {
        console.log(`Error: ${err}`)
      }
    }

    fetchData();
  }, []);

  return (
    <div className={styles.row}>
      <AutoComplete/>
      <IngredientModal/>
      <button className = "primary" onClick = {handleSubmit}>Submit</button>
    </div>
  )
}

export default SearchBar
