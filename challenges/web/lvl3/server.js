const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');  // Importation de path pour travailler avec les chemins de fichiers
const cookieParser = require('cookie-parser');

const app = express();
const port = 5000;

app.use(bodyParser.json());
 
// Servir les fichiers statiques dans le répertoire courant
app.use(express.static(path.join(__dirname)));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));



// Endpoint pour récupérer la liste des challenges
app.get('/web_lvl3', (req, res) => {
    // Ajouter un cookie pour le flag du challenge 5
    res.cookie('flag5', 'CTF{challenge_5_flag}', { path: '/' });
    res.send('Blank... rienn');
    res.sendFile(path.resolve(__dirname, './web_lvl3/challenge5.html'));
});


// ***************
// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
