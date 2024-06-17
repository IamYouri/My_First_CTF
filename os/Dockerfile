FROM ubuntu:20.04
# mdp:password
# ssh user@192.168.226.144 -p <port generé>

# Installer SSH et autres dépendances
RUN apt-get update && apt-get install -y openssh-server sudo
RUN mkdir /var/run/sshd

# Créer un utilisateur pour SSH
RUN useradd -ms /bin/bash user
RUN echo 'user:password' | chpasswd
RUN echo 'user ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Autoriser les connexions root via SSH (facultatif et non recommandé en production)
RUN echo 'PermitRootLogin yes' >> /etc/ssh/sshd_config

# Exposer le port SSH
EXPOSE 22

# Démarrer le service SSH
CMD ["/usr/sbin/sshd", "-D"]
