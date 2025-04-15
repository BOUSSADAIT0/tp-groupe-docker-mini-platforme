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
const PORT = 5000 ;

// Middlewares
// Configurez CORS plus précisément
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://frontend:80',
    'http://localhost:5000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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

const connectWithRetry = () => {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => {
      console.error('Erreur de connexion, nouvelle tentative dans 5s...', err);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});