
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');  // Importation de path pour travailler avec les chemins de fichiers

const app = express();
const port = 5000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Ajouter pour analyser le JSON

// Servir les fichiers statiques (CSS, images, etc.)
app.use(express.static(path.join(__dirname, './')));

app.get('/index.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, './challenges/index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
