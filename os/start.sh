#!/bin/sh

# Démarrer le service SSH en arrière-plan
/usr/sbin/sshd

# Démarrer le serveur Node.js
node /usr/src/app/serveur.js
