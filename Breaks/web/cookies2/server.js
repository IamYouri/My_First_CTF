const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const PORT = 7000;

// Middleware pour analyser les cookies et le corps des requêtes
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));


// Route de connexion
app.get('/', (req, res) => {
    // Définition du cookie avec des options supplémentaires
    res.cookie('flag5', 'CTF{challenge_5_flag}', { 
        path: '/', // Le cookie est disponible pour toutes les routes
        httpOnly: true, // Le cookie n'est pas accessible via JavaScript (pour des raisons de sécurité)
        maxAge: 24 * 60 * 60 * 1000 // Le cookie expire après 1 jour
    });
    
    // Envoi du fichier HTML comme réponse
    res.sendFile(__dirname + '/public/challenge5.html');
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
