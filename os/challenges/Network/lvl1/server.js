const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');  // Importation de path pour travailler avec les chemins de fichiers

const app = express();
const port = 3000;

app.use(bodyParser.json());
 
// Servir les fichiers statiques dans le répertoire courant
app.use(express.static(path.join(__dirname)));



// Endpoint pour récupérer la liste des challenges
app.get('/net_lvl1', (req, res) => {
    res.sendFile(path.resolve(__dirname, './net_lvl1/network1.html'));
});

// Démarrage du serveur
app.listen(port, '0.0.0.0', () => {
    console.log(`Backend API listening at http://0.0.0.0:${port}`);
});

