#!/bin/bash

# Démarrer Apache en premier plan
apachectl start

# Démarrer l'application Node.js
node /usr/src/app/server.js

# Prévenir le conteneur de se terminer immédiatement
tail -f /dev/null
