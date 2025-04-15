# # Étape de build
# FROM node:18-alpine as build

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npm run build

# # Étape de production avec Nginx
# FROM nginx:alpine

# # Copier la configuration nginx personnalisée
# COPY --from=build /app/build /usr/share/nginx/html

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]

# Étape de build
FROM node:18-alpine as build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

RUN npm install
# Copier le reste du code source
COPY . .

# Construire l'application pour la production
# Build avec flags pour forcer les dépendances
RUN npm run build || { echo "Build failed - retrying with force"; npm rebuild && npm run build; }

# Étape de production
FROM nginx:alpine

# Copier la build de l'étape précédente dans le dossier de nginx
COPY --from=build /app/build /usr/share/nginx/html


# Exposer le port 80
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]