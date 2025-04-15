# FROM node:18

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 5000

# CMD ["node", "server.js"]

# Utilisation de Node 18 comme base
FROM node:18-alpine

# Création et définition du répertoire de travail
WORKDIR /app

# Copie des fichiers package.json et package-lock.json
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste du code source
COPY . .

# Exposition du port 5000
EXPOSE 5000

# Commande pour démarrer l'application
CMD ["node", "server.js"]