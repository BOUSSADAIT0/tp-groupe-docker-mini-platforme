import React, { useState } from 'react';

function RecipeForm({ onAddRecipe }) {
  const [recipeData, setRecipeData] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    prepTime: '',
    cookTime: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipeData({
      ...recipeData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Formater les ingrédients en tableau
    const formattedRecipe = {
      ...recipeData,
      ingredients: recipeData.ingredients.split(',').map(item => item.trim()),
      prepTime: parseInt(recipeData.prepTime),
      cookTime: parseInt(recipeData.cookTime)
    };
    
    // Appeler la fonction de l'App pour ajouter la recette
    onAddRecipe(formattedRecipe);
    
    // Réinitialiser le formulaire
    setRecipeData({
      name: '',
      ingredients: '',
      instructions: '',
      prepTime: '',
      cookTime: ''
    });
  };

  return (
    <div className="recipe-form-container">
      <h2>Pouvez-vous reconnaître un plat et nous fournir la recette, s'il vous plaît ?</h2>
      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-group">
          <label htmlFor="name">Nom de la recette</label>
          <input
            type="text"
            id="name"
            name="name"
            value={recipeData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="ingredients">Ingrédients (séparés par des virgules)</label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={recipeData.ingredients}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            name="instructions"
            value={recipeData.instructions}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="prepTime">Temps de préparation (minutes)</label>
            <input
              type="number"
              id="prepTime"
              name="prepTime"
              value={recipeData.prepTime}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          
          <div className="form-group half">
            <label htmlFor="cookTime">Temps de cuisson (minutes)</label>
            <input
              type="number"
              id="cookTime"
              name="cookTime"
              value={recipeData.cookTime}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        </div>
        
        <button type="submit" className="submit-button">Ajouter la recette</button>
      </form>
    </div>
  );
}

export default RecipeForm;