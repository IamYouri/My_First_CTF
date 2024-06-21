const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const PORT = 7000;

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Page de connexion
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/challenge5.html');
});

// Route pour le challenge 5
app.get('/challenge5', (req, res) => {
    // Ajouter un cookie pour le flag du challenge 5
    res.cookie('flag5', 'CTF{challenge_5_flag}', { path: '/' });
    res.send('Blank... rienn');
});

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
