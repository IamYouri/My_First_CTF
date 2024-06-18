const express = require('express');
const bodyParser = require('body-parser');
const Docker = require('dockerode');
const path = require('path');  // Importation de path pour travailler avec les chemins de fichiers

const app = express();
const docker = new Docker();
const port = 3000;

app.use(bodyParser.json());
 
// Servir les fichiers statiques dans le répertoire courant
app.use(express.static(path.join(__dirname)));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Autoriser toutes les origines
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Autoriser les méthodes HTTP
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Autoriser les en-têtes spécifiques
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Endpoint pour démarrer un challenge
// app.get('/start_challenge', async (req, res) => {
//     const { challenge_id, user_id } = req.body;
//     const challengeImage = `challenge-image-${challenge_id}`;  // Nom de l'image Docker spécifique au challenge
//     try {
//         const container = await docker.createContainer({
//             Image: challengeImage,
//             name: `challenge_${user_id}_${challenge_id}_${Date.now()}`,
//             ExposedPorts: { '80/tcp': {} },
//             HostConfig: {
//                 PortBindings: { '80/tcp': [{ HostPort: '' }] }
//             }
//         });
//         await container.start();
//         const data = await container.inspect();
//         const port = data.NetworkSettings.Ports['80/tcp'][0].HostPort;
//         res.json({ container_id: container.id, challenge_url: `http://localhost:${port}` });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });
// Endpoint pour démarrer un challenge
app.get('/start_challenge', async (req, res) => {
    const { user_id } = req.query;  // Extraction des paramètres de la requête GET
    const challengeImage = `challenges-image-v8`;  // Nom de l'image Docker pour lancer tous les challenges

    try {
        const container = await docker.createContainer({
            Image: challengeImage,
            name: `challenge_${user_id}_${Date.now()}`,
            ExposedPorts: { '5000/tcp': {} },
            HostConfig: {
                PortBindings: { '5000/tcp': [{ HostPort: '0' }] }  // Laisser Docker choisir un port automatiquement
            }
        });
        await container.start();
        const data = await container.inspect();

        const portMapping = data.NetworkSettings.Ports['5000/tcp'];
        if (!portMapping || portMapping.length === 0 || !portMapping[0].HostPort) {
            console.error('Port mapping is undefined or empty:', JSON.stringify(data.NetworkSettings.Ports, null, 2));
            throw new Error('Port mapping is undefined or empty');
        }

        const port = portMapping[0].HostPort;
        res.json({ container_id: container.id, challenge_url: `http://localhost:${port}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


// Endpoint pour récupérer la liste des challenges
app.get('/get_challenges', (req, res) => {
    res.json([{ id: 1, name: 'SQL Injection' }, { id: 2, name: 'XSS Attack' }]);
});

// Démarrage du serveur
app.listen(port, '0.0.0.0', () => {
    console.log(`Backend API listening at http://0.0.0.0:${port}`);
});

app.get('/', (req, res) => {
    res.render(path.join(__dirname, 'index.php'));
});
