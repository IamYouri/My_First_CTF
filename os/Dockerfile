# # Utiliser une image de base légère contenant Alpine Linux
# FROM alpine:latest

# # Mettre à jour les dépôts et installer OpenSSH et procps
# RUN apk update && apk add --no-cache openssh procps

# # Générer les clés d'hôte SSH
# RUN ssh-keygen -A

# # Configurer SSH
# RUN mkdir /var/run/sshd && \
#     echo 'root:root' | chpasswd && \
#     sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
#     echo 'PasswordAuthentication yes' >> /etc/ssh/sshd_config && \
#     echo 'AllowUsers root' >> /etc/ssh/sshd_config

# # Exposer le port 22 pour SSH
# EXPOSE 22

# # Démarrer le service SSH en premier plan
# CMD ["/usr/sbin/sshd", "-D"]



# ****************node + ssh 
# Ps : wireshark --> tshark


# docker build -t node-ssh-image . 
# docker run -d -p 2222:22 -p 3000:3000 --name node-ssh-container node-ssh-image
# docker exec -it node-ssh-container /bin/sh


# Utiliser une image de base légère contenant Alpine Linux
FROM alpine:latest

# Mettre à jour les dépôts et installer OpenSSH, Node.js et npm
RUN apk update && \
    apk add --no-cache openssh nodejs npm

# Générer les clés d'hôte SSH
RUN ssh-keygen -A

# Configurer SSH
RUN mkdir /var/run/sshd && \
    echo 'root:root' | chpasswd && \
    sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    echo 'PasswordAuthentication yes' >> /etc/ssh/sshd_config && \
    echo 'AllowUsers root' >> /etc/ssh/sshd_config

# Copier le script server.js dans le conteneur
COPY serveur.js /usr/src/app/serveur.js

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

COPY ./challenges ./challenges

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Installer les dépendances Node.js
RUN npm install

# Exposer les ports nécessaires pour SSH et Node.js
EXPOSE 22
EXPOSE 5000

# Script de démarrage pour démarrer SSH et Node.js
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Démarrer le service SSH et Node.js
CMD ["/usr/local/bin/start.sh"]
