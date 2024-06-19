const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');  // Importation de path pour travailler avec les chemins de fichiers

const app = express();
const port = 5000;

app.use(bodyParser.json());
 
// Servir les fichiers statiques dans le répertoire courant
app.use(express.static(path.join(__dirname)));



// Endpoint pour récupérer la liste des challenges
app.get('/sys_lvl4', (req, res) => {
    res.sendFile(path.resolve(__dirname, './sys_lvl4/login.html'));
});
// ***************

app.use(bodyParser.urlencoded({ extended: true }));

const username = 'Ramirez';
const password = 'canavaro';


app.post('/login', (req, res) => {
    console.log(`Received login attempt: ${JSON.stringify(req.body)}`);

    const { username: inputUsername, password: inputPassword } = req.body;

    if (inputUsername !== username) {
        res.send('Invalid username');
    } else if (inputPassword !== password) {
        res.send('Invalid password');
    } else {
        res.send('Login successful!');
    }
});

// ***************
// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
