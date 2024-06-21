# Utiliser une image de base pour Node.js
FROM node:16-slim

# Créer un répertoire de travail
WORKDIR /usr/src/app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install
RUN npm install express-session


# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port 3000 pour l'application Node.js
EXPOSE 3001

# Commande pour lancer l'application Node.js
CMD ["node", "server.js"]
