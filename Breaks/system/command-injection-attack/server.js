const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 4000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// Middleware pour servir les fichiers statiques
app.use(express.static(PUBLIC_DIR));

// Fonction pour valider les commandes
function isValidCommand(cmd) {
    // Autoriser seulement les commandes `ls` et `cat <filename>` dans le répertoire public
    const allowedCommands = ['ls', 'cat'];
    const parts = cmd.split(' ');
    const command = parts[0];
    const argument = parts[1] ? path.normalize(parts[1]) : '';

    // Vérifier si la commande est valide et si l'argument reste dans le répertoire public
    if (allowedCommands.includes(command) && !argument.includes('..')) {
        return true;
    }
    return false;
}

// Route principale pour exécuter les commandes
app.get('/execute', (req, res) => {
    const cmd = req.query.cmd;

    if (cmd && isValidCommand(cmd)) {
        // Exécution de la commande fournie par l'utilisateur
        exec(cmd, { cwd: PUBLIC_DIR }, (error, stdout, stderr) => {
            if (error) {
                res.send(`Erreur : ${error.message}`);
                return;
            }
            if (stderr) {
                res.send(`Stderr : ${stderr}`);
                return;
            }
            res.send(`Résultat de la commande : ${stdout}`);
        });
    } else {
        res.send("Commande invalide ou non autorisée.");
    }
});

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
