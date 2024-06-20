FROM ubuntu:20.04

# Définir les variables d'environnement pour la sélection géographique et la zone horaire
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Etc/UTC




# Installer SSH et autres dépendances
RUN apt-get update && apt-get install -y openssh-server sudo nodejs npm
RUN mkdir /var/run/sshd

# Créer un utilisateur pour SSH
RUN useradd -ms /bin/bash theprofessor
RUN echo 'theprofessor:darko' | chpasswd
RUN echo 'theprofessor ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

RUN useradd -ms /bin/bash tokio
RUN echo 'tokio:tokio' | chpasswd
RUN echo 'tokio ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers


# Autoriser les connexions root via SSH (facultatif et non recommandé en production)
RUN echo 'PermitRootLogin yes' >> /etc/ssh/sshd_config

# Configurer le répertoire home de tokio
RUN mkdir /home/tokio/bash && \
    cp /bin/bash /home/tokio/bash && \
    chown tokio:tokio /home/tokio/bash && \
    chmod 4755 /home/tokio/bash

# Exposer les ports nécessaires
EXPOSE 22
EXPOSE 5000

# # Copier les fichiers de l'application
# WORKDIR /usr/src/app
# COPY package*.json ./
# COPY server.js ./


# RUN npm install 

# Démarrer les services SSH et Node.js
CMD service ssh start 
