const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');  // Importation de path pour travailler avec les chemins de fichiers
const cookieParser = require('cookie-parser');

const app = express();
const port = 5000;

app.use(bodyParser.json());
 
// Servir les fichiers statiques dans le répertoire courant
app.use(express.static(path.join(__dirname)));



// Endpoint pour récupérer la liste des challenges
app.get('/web_lvl3', (req, res) => {
    res.sendFile(path.resolve(__dirname, './web_lvl3/challenge5.html'));
});

// ***************
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

// Page de connexion
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/web_lvl3/login.html');
});

// Page du challenge 5
app.get('/challenge5page', (req, res) => {
    res.sendFile(__dirname + '/web_lvl3/challenge5.html');
});

// Traitement du formulaire de connexion
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Vérification des informations de connexion
    if (username === 'admin' && password === 'admin') {
        // Créer un cookie contenant le mot de passe
        res.cookie('password', 'YouriGoatest', { path: '/', httpOnly: true });
        res.redirect('/challenge5page');
    } else {
        res.redirect('/login');
    }
});

// Route pour le challenge 5
app.get('/challenge5', (req, res) => {
    if (req.cookies.password === 'YouriGoatest') {
        // Ajouter un cookie pour le flag du challenge 5
        res.cookie('flag5', 'CTF{challenge_5_flag}', { path: '/' });
        res.send('Bienvenue au Challenge 5. Fouillez vos cookies pour trouver le flag.');
    } else {
        res.redirect('/login');
    }
});

// Page du drapeau (flag)
app.get('/flag', (req, res) => {
    if (req.cookies.password === 'YouriGoatest') {
        res.send('Félicitations ! Voici votre flag : CTF{flag_example}');
    } else {
        res.redirect('/login');
    }
});
// ***************
// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
