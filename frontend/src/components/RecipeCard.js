import React from 'react';

function RecipeCard({ recipe }) {
  if (!recipe) return null;
  
  // Gestion des recettes provenant de l'API TheMealDB
  if (recipe.strMeal) {
    return (
      <div className="recipe-card">
        <img 
          src={recipe.strMealThumb} 
          alt={recipe.strMeal}
          className="recipe-image"
        />
        <h3 className="recipe-title">{recipe.strMeal}</h3>
        
        {recipe.idMeal && (
          <div className="recipe-id">
            <span>ID: {recipe.idMeal}</span>
          </div>
        )}
      </div>
    );
  }
  
  // Gestion des recettes ajoutées manuellement
  const { name, ingredients, instructions, prepTime, cookTime } = recipe;
  
  return (
    <div className="recipe-card">
      <h3 className="recipe-title">{name}</h3>
      
      <div className="recipe-times">
        <span>Préparation: {prepTime} min</span>
        <span>Cuisson: {cookTime} min</span>
      </div>
      
      <div className="recipe-section">
        <h4>Ingrédients:</h4>
        <ul className="ingredients-list">
          {ingredients && ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
      
      <div className="recipe-section">
        <h4>Instructions:</h4>
        <p className="instructions">{instructions}</p>
      </div>
    </div>
  );
}

export default RecipeCard;