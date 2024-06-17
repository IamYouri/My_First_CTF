const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

// Configurez la connexion à la base de données
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'hotel_enigma',
    password: "password", // Spécifiez le mot de passe ici si nécessaire
    port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Ajouter pour analyser le JSON

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
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].usr_password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Mot de passe incorrect.' });
        }

        res.status(200).json({ message: 'Connexion réussie' });
    } catch (err) {
        console.error('Erreur lors de la connexion:', err.message);
        res.status(500).json({ message: 'Erreur lors de la connexion. Veuillez réessayer.' });
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
