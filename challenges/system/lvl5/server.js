const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');  // Importation de path pour travailler avec les chemins de fichiers

const app = express();
const port = 5000;

app.use(bodyParser.json());
 
// Servir les fichiers statiques dans le répertoire courant
app.use(express.static(path.join(__dirname)));



// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
