const express = require('express');
const crypto = require('crypto');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Fonction de hachage pour générer un hash à partir d'une chaîne donnée
function generateHash(input) {
    const secret = 'your_secret_string_or_password_here'; // Remplacez par une chaîne sécurisée
    const hash = crypto.createHmac('sha256', secret)
                       .update(input)
                       .digest('hex');
    return hash;
}


// Route pour envoyer le formulaire index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
