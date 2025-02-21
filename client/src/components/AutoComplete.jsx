import React, { useContext, useState, useEffect } from 'react';
import { IngredientsContext, SelectedIngredientsContext } from '../context/Context';
import styles from './css_modules/AutoComplete.module.css';

const AutoComplete = () => {
    const {ingredientList} = useContext(IngredientsContext);
    const {selectedIngredients, setSelectedIngredients} = useContext(SelectedIngredientsContext);
    const [text, setText] = useState("");
    const [suggestedIngredients, setSuggestedIngredients] = useState(ingredientList);

    const handleInput = (e) => {
        const inputText = e.target.value.toLowerCase()
        
       const filtered = ingredientList.filter(ingredient => ingredient.includes(inputText))

        setText(inputText)
        setSuggestedIngredients(filtered)
    } 

    const handleAdd = (e) => {
        e.preventDefault();

        if(ingredientList.includes(text.trim()) && !selectedIngredients.includes(text)){
            setSelectedIngredients([...selectedIngredients, text.trim()]);

            setText("");
        }
    }

    useEffect(() => {
        if (text === "") {
            setSuggestedIngredients([]); // Clear suggestions when input is cleared
        }
    }, [text]);

  return (
    <div>
        <form id = {styles.searchBar}>
            <h3>Add Ingredient: </h3>
            <input list = "ingredient-input" type = "text" value = {text} onChange = {handleInput}/>
            <datalist id = "ingredient-input">
            {suggestedIngredients && suggestedIngredients.map(ingredient => {
                return <option value = {ingredient}/>
            })}
            </datalist>
            <button onClick = {handleAdd}>Add</button>
        </form>
    </div>
  )
}

export default AutoComplete
