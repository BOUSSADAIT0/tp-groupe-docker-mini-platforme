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
    // D'abord vérifier si la collection est vide (approche plus fiable)
    const count = await Recipe.countDocuments();
    
    if (count === 0) {
      console.log('Base vide, importation des recettes depuis TheMealDB...');
      try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/filter.php?a=Chinese');
        
        if (response.data?.meals) {
          // Utiliser insertMany pour plus d'efficacité
          await Recipe.insertMany(response.data.meals.map(meal => ({
            idMeal: meal.idMeal,
            strMeal: meal.strMeal,
            strMealThumb: meal.strMealThumb,
            createdAt: new Date() // Ajouter un timestamp
          })));
          
          console.log(`${response.data.meals.length} recettes importées`);
        }
      } catch (apiError) {
        console.error('Erreur API TheMealDB:', apiError.message);
      }
    }

    // Maintenant récupérer toutes les recettes
    const allRecipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(allRecipes);
    
  } catch (err) {
    console.error('Erreur GET /:', err);
    res.status(500).json({ message: err.message });
  }
});
// GET - Importer les recettes depuis TheMealDB
// POST - Initialiser la base avec des recettes par défaut
router.post('/init', async (req, res) => {
  try {
    await Recipe.deleteMany({}); // Nettoyer la base
    
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/filter.php?a=Chinese');
    const recipes = response.data.meals.map(meal => ({
      idMeal: meal.idMeal,
      strMeal: meal.strMeal,
      strMealThumb: meal.strMealThumb,
      createdAt: new Date()
    }));
    
    await Recipe.insertMany(recipes);
    res.json({ message: `${recipes.length} recettes importées` });
    
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