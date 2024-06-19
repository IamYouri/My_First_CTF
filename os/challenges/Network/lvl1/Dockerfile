# Utiliser une image de base pour Node.js
FROM node:14-slim

# Créer un répertoire de travail
WORKDIR /usr/src/app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY server.js ./
COPY . ./net_lvl1
# COPY . /usr/src/app/net_lvl1
# Exposer le port 3000 pour l'application Node.js
EXPOSE 5000

# Commande pour lancer l'application Node.js
CMD ["node", "./server.js"]
