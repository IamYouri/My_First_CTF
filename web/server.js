const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const path = require('path');
const session = require('express-session'); 
const cookieParser = require('cookie-parser');
const PgSession = require('connect-pg-simple')(session);
const Docker = require('dockerode');

const app = express();
const port = 3001;

// Configurez la connexion à la base de données
const pool = new Pool({
    user: 'postgres',
    host: '192.168.122.1',
    database: 'hotel_enigma',
    password: "password", // Spécifiez le mot de passe ici si nécessaire
    port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Ajouter pour analyser le JSON
app.use(cookieParser());

// Middleware de session
app.use(session({
    store: new PgSession({
        pool: pool,                // Connection pool
        tableName: 'session'       // Use another table-name than the default "session" one
    }),
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 jours
}));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir les fichiers statiques (CSS, images, etc.)
app.use(express.static(path.join(__dirname, './')));



function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    } else {
        res.redirect('/login'); // Rediriger vers la page de connexion si non authentifié
    }
}

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
        return res.status(400).json({ message: 'Les mots de passe ne correspondent pas.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword);

        const newUser = await pool.query(
            'INSERT INTO t_user_usr (usr_pseudo, usr_first_name, usr_last_name, usr_email, usr_password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [username, firstname, lastname, email, hashedPassword]
        );

        console.log('New user inserted:', newUser.rows[0]);
        res.status(201).json({ message: 'Inscription réussie' }); // Envoyer une réponse JSON
    } catch (err) {
        console.error('Erreur lors de l\'inscription:', err.message);
        res.status(500).json({ message: 'Erreur lors de l\'inscription. Veuillez réessayer.' });
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
            console.log('Utilisateur non trouvé.');
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].usr_password);
        if (!validPassword) {
            console.log('Mot de passe incorrect.');
            return res.status(401).json({ message: 'Mot de passe incorrect.' });
        }

        // Enregistrer l'utilisateur dans la session
        req.session.userId = user.rows[0].user_id;
        req.session.username = user.rows[0].usr_pseudo;
        console.log('Session créée:', req.session);

        console.log('Connexion réussie.');
        res.status(200).json({ message: 'Connexion réussie', redirect: '/hotel.html' });
    } catch (err) {
        console.error('Erreur lors de la connexion:', err.message);
        res.status(500).json({ message: 'Erreur lors de la connexion. Veuillez réessayer.' });
    }
});


// Route pour la page de l'hôtel (protégée)
app.get('/hotel.html', isAuthenticated, (req, res) => {
    res.sendFile(path.resolve(__dirname, './html/hotel.html'));
});

// Route pour la page de l'étage (protégée)
app.get('/etage.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, './html/etage.html'));
});

app.get('/chambre.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, './html/chambre.html'));
});

// Route pour la déconnexion
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la déconnexion. Veuillez réessayer.' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Déconnexion réussie' });
    });
});

// Route pour récupérer toutes les solutions CTF
app.get('/ctf-solutions', async (req, res) => {
    try {
        const ctfSolutions = await pool.query('SELECT ctf_id, ctf_solution FROM t_ctf_ctf');
        res.status(200).json(ctfSolutions.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des solutions CTF:', err.message);
        res.status(500).json({ message: 'Erreur lors de la récupération des solutions. Veuillez réessayer.' });
    }
});

app.post('/verify-solution', async (req, res) => {
    const { ctf_id, solution } = req.body;
    try {
        const ctf = await pool.query('SELECT * FROM t_ctf_ctf WHERE ctf_id = $1', [ctf_id]);
        if (ctf.rows.length > 0 && solution === ctf.rows[0].ctf_solution) {
            res.status(200).json({ success: true });
        } else {
            res.status(401).json({ success: false });
        }
    } catch (err) {
        console.error('Erreur lors de la vérification de la solution:', err.message);
        res.status(500).json({ message: 'Erreur lors de la vérification. Veuillez réessayer.' });
    }
});


app.post('/verify-access', async (req, res) => {
    const { etage, accessString } = req.body;
    const ctfIdMapping = { 2: 3, 3: 6, 4: 9, 5: 12 }; // Map étage to ctf_id for the solution

    try {
        const ctfId = ctfIdMapping[etage];
        if (!ctfId) {
            return res.status(400).json({ success: false, message: 'Invalid étage number' });
        }

        const ctf = await pool.query('SELECT ctf_solution FROM t_ctf_ctf WHERE ctf_id = $1', [ctfId]);
        if (ctf.rows.length > 0 && accessString === ctf.rows[0].ctf_solution) {
            res.status(200).json({ success: true });
        } else {
            res.status(401).json({ success: false });
        }
    } catch (err) {
        console.error('Erreur lors de la vérification de l\'accès:', err.message);
        res.status(500).json({ message: 'Erreur lors de la vérification. Veuillez réessayer.' });
    }
});

app.post('/verify-solution', async (req, res) => {
    const { ctf_id, solution } = req.body;
    try {
        const ctf = await pool.query('SELECT * FROM t_ctf_ctf WHERE ctf_id = $1', [ctf_id]);
        if (ctf.rows.length > 0 && solution === ctf.rows[0].ctf_solution) {
            res.status(200).json({ success: true });
        } else {
            res.status(401).json({ success: false });
        }
    } catch (err) {
        console.error('Erreur lors de la vérification de la solution:', err.message);
        res.status(500).json({ message: 'Erreur lors de la vérification. Veuillez réessayer.' });
    }
});
/*-----------------------------------*/
app.get('/api/checkProgress', async (req, res) => {
    const userId = req.query.userId;
    const ctfId = req.query.ctfId;

    // Vérifiez la base de données pour voir si l'utilisateur a terminé tous les défis précédents
    const hasCompletedPreviousChallenges = await db.query('SELECT has_solved_previous_challenges($1, $2)', [userId, ctfId]);

    res.send(hasCompletedPreviousChallenges.rows[0].has_solved_previous_challenges);
});
app.get('/start-game', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.userId;

        // Fetch user data
        const userResult = await pool.query('SELECT usr_pseudo FROM t_user_usr WHERE user_id = $1', [userId]);
        const usr_pseudo = userResult.rows[0].usr_pseudo;

        // Extract floor and room from query parameters
        const floor = req.query.floor;
        const room = req.query.room;

        // Compute ctf_id based on floor and room
        const ctf_id = (floor - 1) * 3 + parseInt(room);

        res.status(200).json({ usr_pseudo, ctf_id });
    } catch (err) {
        console.error('Error fetching start game data:', err.message);
        res.status(500).json({ message: 'Error fetching start game data' });
    }
});


app.get('/start_challenge', async (req, res) => {
    const { user_id, challenge_id } = req.query;  // Extraction des paramètres de la requête GET
    const challengeImage = `challenge_image_${challenge_id}`;  // Nom de l'image Docker pour lancer tous les challenges

    try {
        const container = await docker.createContainer({
            Image: challengeImage,
            name: `challenge_${challenge_id}_${user_id}_${Date.now()}`,
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


