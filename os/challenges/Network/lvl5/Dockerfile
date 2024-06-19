FROM ubuntu:20.04

# ssh user@192.168.122.1 -p <port>
# mdp:password

#FROM ubuntu:20.04

# Définir les variables d'environnement pour la sélection géographique et la zone horaire
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Etc/UTC

# Installer SSH et autres dépendances
#RUN apt-get update && apt-get install -y openssh-server sudo nodejs npm
#RUN mkdir /var/run/sshd

# Créer un utilisateur pour SSH




# Installer SSH et autres dépendances
RUN apt-get update && apt-get install -y openssh-server sudo nodejs npm
RUN mkdir /var/run/sshd

# Créer un utilisateur pour SSH
RUN useradd -ms /bin/bash user
RUN echo 'user:password' | chpasswd
RUN echo 'user ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Autoriser les connexions root via SSH (facultatif et non recommandé en production)
RUN echo 'PermitRootLogin yes' >> /etc/ssh/sshd_config

# Exposer les ports nécessaires
EXPOSE 22
EXPOSE 5000

# Copier les fichiers de l'application
WORKDIR /usr/src/app
COPY package*.json ./
COPY server.js ./

COPY . ./net_lvl1

RUN npm install

# Démarrer les services SSH et Node.js
CMD service ssh start && node server.js
