import React, { useState, useContext } from 'react';
import { Modal, List } from 'antd';
import { SelectedIngredientsContext, RecipeListContext } from '../context/Context';
import styles from './css_modules/IngredientModal.module.css'

const IngredientModal = () => {
  const {selectedIngredients, setSelectedIngredients} = useContext(SelectedIngredientsContext);
  const {loadRecipes} = useContext(RecipeListContext);

  const handleDeleteIngredient = (e, item) => {
    e.preventDefault();

    setSelectedIngredients(selectedIngredients.filter(i => i !== item));
    
    loadRecipes();
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };  
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button type="primary" onClick={showModal}>
        Ingredients
      </button>

      <Modal title="Selected Ingredients" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <List
          size="small"
          bordered
          dataSource={selectedIngredients}
          renderItem={(item) => <List.Item>
            <div className={styles.ingredientIcon}>
              {item}
              <img className = "delete-icon" src = '/deleteicon.png' alt = "Delete Icon" onClick = {(e) => handleDeleteIngredient(e, item)}/>
            </div>
            </List.Item>}
        />
      </Modal>
    </>
  );
};
export default IngredientModal;