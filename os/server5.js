const express = require('express');
const bodyParser = require('body-parser');
const Docker = require('dockerode');
const path = require('path');

const app = express();
const docker = new Docker();
const port = 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'challenges')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'challenges', 'index.html'));
});

app.get('/Network/LVL1', (req, res) => {
    res.sendFile(path.join(__dirname, 'challenges', 'Breaks', 'Network', 'LVL 1','network1.html'));
});


app.get('/Network/LVL2', (req, res) => {
    res.sendFile(path.join(__dirname, 'challenges', 'Breaks', 'Network', 'LVL 2','network2.html'));
});


app.get('/Network/LVL3', (req, res) => {
    res.sendFile(path.join(__dirname, 'challenges', 'Breaks', 'Network', 'LVL 3','network3.html'));
});


// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
