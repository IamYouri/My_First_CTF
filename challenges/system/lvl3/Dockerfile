
# ************************************************
# FROM ubuntu:20.04

# # Définir les variables d'environnement pour la sélection géographique et la zone horaire
# ENV DEBIAN_FRONTEND=noninteractive
# ENV TZ=Etc/UTC

# # Installer SSH et autres dépendances
# RUN apt-get update && apt-get install -y openssh-server nano nodejs npm python2.7 libcap2-bin
# RUN mkdir /var/run/sshd

# # Créer un utilisateur pour SSH
# RUN useradd -ms /bin/bash user
# RUN echo 'user:password' | chpasswd

# # Autoriser les connexions root via SSH (facultatif et non recommandé en production)
# RUN echo 'PermitRootLogin yes' >> /etc/ssh/sshd_config

# # Donner à user le droit d'exécuter chmod sans sudo
# RUN setcap cap_dac_override,cap_fowner+ep /bin/chmod

# # Exposer les ports nécessaires
# EXPOSE 22
# EXPOSE 5000

# # Copier les fichiers de l'application
# WORKDIR /usr/src/app
# COPY package*.json ./
# COPY server.js ./

# COPY ./bufferOverflow/weird-password /home/user/bufferOverflow/weird-password

# # Installer les dépendances de l'application Node.js
# RUN npm install

# # Démarrer les services SSH et Node.js
# CMD service ssh start && node server.js
# *************************************************
FROM ubuntu:20.04

# Définir les variables d'environnement pour la sélection géographique et la zone horaire
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Etc/UTC

# Installer SSH et autres dépendances
RUN apt-get update && apt-get install -y \
    openssh-server \
    nano \
    nodejs \
    npm \
    python2.7 \
    libcap2-bin \
    gdb \
    git

RUN mkdir /var/run/sshd

# Créer un utilisateur pour SSH
RUN useradd -ms /bin/bash user
RUN echo 'user:password' | chpasswd

# Autoriser les connexions root via SSH (facultatif et non recommandé en production)
RUN echo 'PermitRootLogin yes' >> /etc/ssh/sshd_config

# Donner à user le droit d'exécuter chmod sans sudo
RUN setcap cap_dac_override,cap_fowner+ep /bin/chmod

# Installer PEDA pour GDB
RUN git clone https://github.com/longld/peda.git /opt/peda && \
    echo "source /opt/peda/peda.py" >> /home/user/.gdbinit && \
    chown user:user /home/user/.gdbinit

# Exposer les ports nécessaires
EXPOSE 22
EXPOSE 5000

# Copier les fichiers de l'application
WORKDIR /usr/src/app
COPY package*.json ./
COPY server.js ./

COPY ./bufferOverflow/weird-password /home/user/bufferOverflow/weird-password

# Installer les dépendances de l'application Node.js
RUN npm install

# Démarrer les services SSH et Node.js
CMD service ssh start && node server.js
