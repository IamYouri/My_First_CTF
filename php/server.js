const express = require('express');
const bodyParser = require('body-parser');
const Docker = require('dockerode');
const cors = require('cors');  // Ajoutez ceci
const path = require('path');  
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const app = express();
const docker = new Docker();
const port = 3001;  // Note: port changed to 3001

// Configurez la connexion à la base de données
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'hotel_enigma',
    password: "password", // Spécifiez le mot de passe ici si nécessaire
    port: 5432,
});

app.use(cors());  // Ajoutez ceci
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir les fichiers statiques (CSS, images, etc.)
app.use(express.static(path.join(__dirname, './')));

// Route pour la page d'inscription
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, './html/register.html'));
});

// Route pour traiter l'inscription
app.post('/register', async (req, res) => {
    const { username, firstname, lastname, email, password, confirm_password } = req.body;

    console.log('Form data received:', { username, firstname, lastname, email, password, confirm_password });

    if (password !== confirm_password) {
        return res.send('Les mots de passe ne correspondent pas.');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword);

        const newUser = await pool.query(
            'INSERT INTO t_user_usr (usr_pseudo, usr_first_name, usr_last_name, usr_email, usr_password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [username, firstname, lastname, email, hashedPassword]
        );

        console.log('New user inserted:', newUser.rows[0]);
        res.redirect('/login');
    } catch (err) {
        console.error('Erreur lors de l\'inscription:', err.message);
        res.status(500).send('Erreur lors de l\'inscription. Veuillez réessayer.');
    }
});

// Route pour la page de connexion
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, './html/login.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './html/index.html'));
});

// Route pour traiter la connexion
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log('Login data received:', { email, password });

    try {
        const user = await pool.query('SELECT * FROM t_user_usr WHERE usr_email = $1', [email]);

        if (user.rows.length === 0) {
            return res.send('Utilisateur non trouvé.');
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].usr_password);
        if (!validPassword) {
            return res.send('Mot de passe incorrect.');
        }

        res.redirect('/hotel.html');
    } catch (err) {
        console.error('Erreur lors de la connexion:', err.message);
        res.status(500).send('Erreur lors de la connexion. Veuillez réessayer.');
    }
});

// Route pour la page de l'hôtel
app.get('/hotel.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, './html/hotel.html'));
});
// Route pour la page de l'étage
app.get('/etage.html', (req, res) => {
    res.sendFile(path.join(__dirname, './html/etage.html'));
});
app.get('/chambre.html', (req, res) => {
    res.sendFile(path.join(__dirname, './html/chambre.html'));
});

app.get('/start_challenge', async (req, res) => {
    const { user_id } = req.query;  // Extraction des paramètres de la requête GET
    const challengeImage = `challenges-image`;  // Nom de l'image Docker pour lancer tous les challenges

    try {
        const container = await docker.createContainer({
            Image: challengeImage,
            name: `challenge_${user_id}_${Date.now()}`,
            ExposedPorts: {
                '5000/tcp': {},
                '22/tcp': {}
            },
            HostConfig: {
                PortBindings: {
                    '5000/tcp': [{ HostPort: '0' }],  // Laisser Docker choisir un port automatiquement
                    '22/tcp': [{ HostPort: '0' }]
                }
            }
        });
        await container.start();
        const data = await container.inspect();

        const port5000Mapping = data.NetworkSettings.Ports['5000/tcp'];
        const port22Mapping = data.NetworkSettings.Ports['22/tcp'];

        if (!port5000Mapping || port5000Mapping.length === 0 || !port5000Mapping[0].HostPort ||
            !port22Mapping || port22Mapping.length === 0 || !port22Mapping[0].HostPort) {
            console.error('Port mapping is undefined or empty:', JSON.stringify(data.NetworkSettings.Pports, null, 2));
            throw new Error('Port mapping is undefined or empty');
        }

        const port5000 = port5000Mapping[0].HostPort;
        const port22 = port22Mapping[0].HostPort;

        res.json({ container_id: container.id, challenge_urls: {
            app_url: `http://localhost:${port5000}`,
            ssh_url: `ssh root@localhost -p ${port22}`
        }});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
