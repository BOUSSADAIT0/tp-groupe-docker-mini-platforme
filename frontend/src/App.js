import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import RecipeForm from './components/RecipeForm';
import RecipeSlider from './components/RecipeSlider';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // // URL de l'API backend
  const API_URL = process.env.REACT_APP_API_URL ;

  // Charger les recettes
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/recipes', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Données reçues:', response.data); // Debug
      setRecipes(response.data);
    } catch (err) {
      console.error('Erreur complète:', err.response); // Affiche plus de détails
      setError('Erreur lors du chargement des recettes');
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const closeRecipeDetails = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-title">Plats Chinois</h1>
          <button className="import-button" onClick={() => window.location.href = '#add-recipe'}>
          🥺  Donner nous la recette  svp 🥺 
          </button>
        </div>
      </nav>

      <main>
        {loading ? (
          <p className="loading">Chargement des recettes...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <RecipeSlider 
              recipes={recipes} 
              onRecipeClick={handleRecipeClick}
            />
            
            {selectedRecipe && (
              <div className="recipe-details-modal">
                <div className="recipe-details-content">
                  <button className="close-button" onClick={closeRecipeDetails}>×</button>
                  {selectedRecipe.strMeal ? (
                    <>
                      <h2>{selectedRecipe.strMeal}</h2>
                      <img src={selectedRecipe.strMealThumb} alt={selectedRecipe.strMeal} />
                    </>
                  ) : (
                    <>
                      <h2>{selectedRecipe.name}</h2>
                      <div className="recipe-times">
                        <span>Préparation: {selectedRecipe.prepTime} min</span>
                        <span>Cuisson: {selectedRecipe.cookTime} min</span>
                      </div>
                      <div className="recipe-section">
                        <h3>Ingrédients:</h3>
                        <ul>
                          {selectedRecipe.ingredients.map((ingredient, idx) => (
                            <li key={idx}>{ingredient}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="recipe-section">
                        <h3>Instructions:</h3>
                        <p>{selectedRecipe.instructions}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            
            <div id="add-recipe" className="add-recipe-section">
              <RecipeForm onAddRecipe={(newRecipe) => {
                setRecipes([newRecipe, ...recipes]);
              }} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;