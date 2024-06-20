const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');  // Importation de path pour travailler avec les chemins de fichiers

const app = express();
const port = 5000;

app.use(bodyParser.json());
 
// Servir les fichiers statiques dans le répertoire courant
app.use(express.static('public'));



// Fonction de hachage pour générer un hash à partir d'une chaîne donnée
function generateHash(input) {
    const secret = 'your_secret_string_or_password_here'; // Remplacez par une chaîne sécurisée
    const hash = crypto.createHmac('sha256', secret)
                       .update(input)
                       .digest('hex');
    return hash;
}

// Route avec la vulnérabilité XSS pour récupérer le flag
app.get('/getFlag', (req, res) => {
    const query = req.query.query || '';

    // Générer le hash de la chaîne de requête
    const inputHash = generateHash(query);

    // Hash prédéfini pour permettre l'accès au flag
    const allowedHash = generateHash('<script>alert(document.flgdo);</script>');
    
    // Comparer les hashes
    if (inputHash === allowedHash) {
        // Flag hardcodé
        res.send('CTF{SGlCYXJiaWU=}'); // Remplacez par votre flag réel
    } else {
        res.send('No flag for you!');
    }
});

// Endpoint pour récupérer la liste des challenges
app.get('/web_lvl4', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/index.html'));
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
