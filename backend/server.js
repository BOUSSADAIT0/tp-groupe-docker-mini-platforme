const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const recipesRoutes = require('./routes/recipes');

// Configuration
dotenv.config();
const app = express();
const PORT = process.env.BACKEND_PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/recipes';

// Middlewares
app.use(cors());
app.use(express.json());

// Logging
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'log.txt'),
  { flags: 'a' }
);
app.use(morgan('combined', { stream: accessLogStream }));

// Routes
app.use('/api/recipes', recipesRoutes);

// Route pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API de recettes chinoises!' });
});

// Connexion à MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connecté à MongoDB');
    // Lors du démarrage du serveur, vérifier et importer des recettes si nécessaire
    // Cette partie sera gérée par la route GET /api/recipes
  })
  .catch(err => {
    console.error('Erreur de connexion à MongoDB:', err.message);
    process.exit(1);
  });

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});