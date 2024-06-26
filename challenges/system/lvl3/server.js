const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');  // Importation de path pour travailler avec les chemins de fichiers

const app = express();
const port = 5000;

app.use(bodyParser.json());
 
// Servir les fichiers statiques dans le répertoire courant
app.use(express.static(path.join(__dirname)));



// // Endpoint pour récupérer la liste des challenges
// app.get('/sys_lvl1', (req, res) => {
//     res.sendFile(path.resolve(__dirname, './sys_lvl1/web3.html'));
// });

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
