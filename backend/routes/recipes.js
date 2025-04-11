const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const router = express.Router();

// Modèle de recette - SCHÉMA
const recipeSchema = new mongoose.Schema({
  // Champs pour les recettes manuelles
  name: { type: String, required: false },
  ingredients: [String],
  instructions: String,
  prepTime: Number, // en minutes
  cookTime: Number, // en minutes
  createdAt: { type: Date, default: Date.now },
  
  // Champs pour les recettes de TheMealDB
  idMeal: String,
  strMeal: String,
  strMealThumb: String
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// GET - Liste de toutes les recettes (locales + TheMealDB)
router.get('/', async (req, res) => {
  try {
    // Récupérer les recettes locales de notre base de données
    const localRecipes = await Recipe.find().sort({ createdAt: -1 });
    
    // Vérifier si on a déjà des recettes de TheMealDB dans notre base
    const hasMealDbRecipes = await Recipe.findOne({ idMeal: { $exists: true } });
    
    // Si on n'a pas encore de recettes de TheMealDB, les récupérer et les sauvegarder
    if (!hasMealDbRecipes) {
      try {
        console.log('Récupération des recettes depuis TheMealDB...');
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/filter.php?a=Chinese');
        
        if (response.data && response.data.meals) {
          const mealDbRecipes = response.data.meals;
          
          // Sauvegarder les recettes dans notre base de données
          for (const meal of mealDbRecipes) {
            const exists = await Recipe.findOne({ idMeal: meal.idMeal });
            
            if (!exists) {
              await Recipe.create({
                idMeal: meal.idMeal,
                strMeal: meal.strMeal,
                strMealThumb: meal.strMealThumb
              });
            }
          }
          
          console.log(`${mealDbRecipes.length} recettes importées depuis TheMealDB`);
        }
      } catch (apiError) {
        console.error('Erreur lors de la récupération depuis TheMealDB:', apiError.message);
      }
    }
    
    // Récupérer toutes les recettes (incluant celles qu'on vient d'ajouter)
    const allRecipes = await Recipe.find().sort({ createdAt: -1 });
    
    res.json(allRecipes);
  } catch (err) {
    console.error('Erreur lors de la récupération des recettes:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// POST - Ajouter une nouvelle recette (manuelle)
router.post('/', async (req, res) => {
  const recipe = new Recipe({
    name: req.body.name,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    prepTime: req.body.prepTime,
    cookTime: req.body.cookTime
  });

  try {
    const newRecipe = await recipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET - Importer les recettes depuis TheMealDB
router.get('/import', async (req, res) => {
  try {
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/filter.php?a=Chinese');
    
    if (!response.data || !response.data.meals) {
      return res.status(404).json({ message: 'Aucune recette trouvée sur TheMealDB' });
    }
    
    const mealDbRecipes = response.data.meals;
    let importCount = 0;
    
    // Sauvegarder les recettes dans notre base de données
    for (const meal of mealDbRecipes) {
      const exists = await Recipe.findOne({ idMeal: meal.idMeal });
      
      if (!exists) {
        await Recipe.create({
          idMeal: meal.idMeal,
          strMeal: meal.strMeal,
          strMealThumb: meal.strMealThumb
        });
        importCount++;
      }
    }
    
    res.json({ 
      message: `${importCount} nouvelles recettes importées depuis TheMealDB`,
      totalRecipes: mealDbRecipes.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET - Obtenir une recette spécifique
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recette non trouvée' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;