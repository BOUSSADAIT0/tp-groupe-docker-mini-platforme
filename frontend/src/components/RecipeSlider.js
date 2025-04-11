import React, { useEffect, useRef, useState } from 'react';
import './RecipeSlider.css';

const RecipeSlider = ({ recipes, onRecipeClick }) => {
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    if (!recipes || recipes.length === 0) return;
    
    // Configuration des boutons de navigation
    const sliderEl = sliderRef.current;
    if (sliderEl) {
      const nextBtn = sliderEl.querySelector('.slider-next');
      const prevBtn = sliderEl.querySelector('.slider-prev');
      
      if (nextBtn) nextBtn.addEventListener('click', nextCard);
      if (prevBtn) prevBtn.addEventListener('click', prevCard);
      
      return () => {
        if (nextBtn) nextBtn.removeEventListener('click', nextCard);
        if (prevBtn) prevBtn.removeEventListener('click', prevCard);
      };
    }
  }, [recipes]);
  
  // Fonctions de navigation
  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % recipes.length);
  };
  
  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + recipes.length) % recipes.length);
  };
  
  if (!recipes || recipes.length === 0) {
    return <div className="empty-slider">Aucune recette disponible</div>;
  }
  
  return (
    <div className="recipe-slider-container">
      <h2>Découvrez nos recettes</h2>
      
      <div className="recipe-slider" ref={sliderRef}>
        <div className="slider-cards-container">
          {recipes.map((recipe, index) => {
            // Calculer la position par rapport à l'index actif
            const position = index - activeIndex;
            
            // Déterminer la classe en fonction de la position
            let cardClass = "slider-card";
            if (position === 0) cardClass += " active";
            else if (position < 0) cardClass += " left";
            else cardClass += " right";
            
            // Appliquer une position plus éloignée pour les cartes qui ne sont 
            // pas immédiatement à côté de la carte active
            if (Math.abs(position) > 1) {
              cardClass += " far";
            }
            
            return (
              <div 
                key={recipe._id || recipe.idMeal || index}
                className={cardClass}
                style={{
                  // Déplacer horizontalement plutôt qu'en rotation
                  transform: `translateX(${position * 100}px) 
                             scale(${1 - Math.abs(position) * 0.15})`,
                  opacity: 1 - Math.abs(position) * 0.3,
                  zIndex: recipes.length - Math.abs(position)
                }}
                onClick={() => onRecipeClick(recipe)}
              >
                {recipe.strMealThumb ? (
                  <img 
                    src={recipe.strMealThumb} 
                    alt={recipe.strMeal}
                    className="slider-card-image"
                  />
                ) : (
                  <div className="slider-card-placeholder">
                    <h3>{recipe.name}</h3>
                  </div>
                )}
                <div className="slider-card-title">
                  {recipe.strMeal || recipe.name}
                </div>
              </div>
            );
          })}
        </div>
        
        <button className="slider-nav slider-prev">❮</button>
        <button className="slider-nav slider-next">❯</button>
      </div>
    </div>
  );
};

export default RecipeSlider;