const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));


// Page du challenge 5
app.get('/challenge5page', (req, res) => {
    res.sendFile(__dirname + '/web_lvl3/challenge5.html');
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

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
