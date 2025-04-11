import React from 'react';
import RecipeCard from './RecipeCard';

function RecipeList({ recipes }) {
  if (!recipes || recipes.length === 0) {
    return (
      <div className="no-recipes">
        <p>Chargement des recettes...</p>
      </div>
    );
  }

  return (
    <div className="recipe-list">
      <h2>Liste des recettes</h2>
      <div className="recipes-grid">
        {recipes.map(recipe => (
          <RecipeCard key={recipe._id || recipe.idMeal} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default RecipeList;