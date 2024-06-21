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
const docker = new Docker();
const cron = require('node-cron');

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

app.get('/get-username', (req, res) => {
    if (req.session.username) {
        res.json({ username: req.session.username });
    } else {
        res.status(401).json({ message: 'Non autorisé' });
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


app.post('/add-resolved-ctf', (req, res) => {
    console.log('Received request to /add-resolved-ctf'); // Log when a request is received
    const { usr_id, ctf_id } = req.body;

    // Log the data received
    console.log(`usr_id: ${usr_id}, ctf_id: ${ctf_id}`);

    // Vérifier si l'utilisateur a déjà résolu le CTF
    const checkQuery = `
        SELECT * FROM t_resolved_rsv 
        WHERE usr_id = $1 AND ctf_id = $2
    `;

    pool.query(checkQuery, [usr_id, ctf_id], (error, results) => {
        if (error) {
            console.error('Erreur lors de la vérification du CTF résolu:', error);
            return res.status(500).json({ message: 'Erreur lors de la vérification du CTF résolu. Veuillez réessayer.' });
        }

        // Si l'utilisateur n'a pas encore résolu le CTF
        if (results.rows.length === 0) {
            // Insérer les données dans la base de données
            const insertQuery = `
                INSERT INTO t_resolved_rsv (usr_id, ctf_id) 
                VALUES ($1, $2)
            `;

            pool.query(insertQuery, [usr_id, ctf_id], (insertError, insertResults) => {
                if (insertError) {
                    console.error('Erreur lors de l\'insertion du CTF résolu:', insertError);
                    return res.status(500).json({ message: 'Erreur lors de l\'insertion du CTF résolu. Veuillez réessayer.' });
                }
                console.log('CTF résolu ajouté avec succès.');
                res.status(200).json({ message: 'CTF résolu ajouté avec succès.' });
            });
        } else {
            // Si l'utilisateur a déjà résolu le CTF
            console.log('L\'utilisateur a déjà résolu ce CTF.');
            res.status(400).json({ message: 'L\'utilisateur a déjà résolu ce CTF.' });
        }
    });
});


app.get('/check-ctfs', async (req, res) => {
    const { userId, etageNum, chambreNum } = req.query;

    try {
        const requiredCount = (etageNum - 1) * 3 + (chambreNum - 1);

        const resolvedCount = await pool.query(`
            SELECT COUNT(*) as count 
            FROM t_resolved_rsv rsv 
            JOIN t_CTF_ctf ctf ON rsv.ctf_id = ctf.ctf_id 
            WHERE rsv.usr_id = $1 AND (ctf.ctf_floor < $2 OR (ctf.ctf_floor = $2 AND ctf.ctf_id <= $3))
        `, [userId, etageNum, requiredCount]);

        if (resolvedCount.rows[0].count >= requiredCount) {
            res.status(200).json({ success: true });
        } else {
            res.status(403).json({ success: false, message: 'Vous devez résoudre tous les CTFs précédents pour accéder à cette chambre' });
        }
    } catch (error) {
        console.error('Erreur lors de la vérification des CTFs:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la vérification des CTFs' });
    }
});


app.get('/check-floor-access', async (req, res) => {
    const { userId, etageNum } = req.query;

    try {
        const requiredCount = (etageNum - 1) * 3;

        const resolvedCount = await pool.query(`
            SELECT COUNT(*) as count 
            FROM t_resolved_rsv rsv 
            JOIN t_CTF_ctf ctf ON rsv.ctf_id = ctf.ctf_id 
            WHERE rsv.usr_id = $1 AND ctf.ctf_floor < $2
        `, [userId, etageNum]);

        if (resolvedCount.rows[0].count >= requiredCount) {
            res.status(200).json({ success: true });
        } else {
            res.status(403).json({ success: false, message: 'Vous devez résoudre toutes les chambres de l\'étage précédent pour accéder à cet étage' });
        }
    } catch (error) {
        console.error('Erreur lors de la vérification des CTFs:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la vérification des CTFs' });
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

//////////////////////////////////////////////////////////////////////////////////////

///////////////////////////   KHALID ////////////////////////////////////////

app.get('/start_challenge', async (req, res) => {
    const { user_pseudo, challenge_id } = req.query;

    // Log the received parameters
    console.log('Received request to start challenge');
    console.log('Query parameters:', req.query);

    if (!user_pseudo || !challenge_id) {
        console.error('Missing user_pseudo or challenge_id in request');
        return res.status(400).json({ error: 'user_pseudo and challenge_id are required' });
    }

    // Fetch the user_id using user_pseudo
    let user_id;
    try {
        const result = await pool.query('SELECT user_id FROM t_user_usr WHERE usr_pseudo = $1', [user_pseudo]);
        if (result.rows.length === 0) {
            console.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
        user_id = result.rows[0].user_id;
    } catch (err) {
        console.error('Error fetching user_id:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }

    const challengeImage = `challenge_image_${challenge_id}`;
    let categoryPath = '';

    if (challenge_id == 1) {
        categoryPath = 'web_lvl1';
    } else if (challenge_id == 2) {
        categoryPath = 'net_lvl1';
    } else if (challenge_id == 3) {
        categoryPath = 'sys_lvl1';
    } else if (challenge_id == 4) {
        categoryPath = 'web_lvl2';
    } else if (challenge_id == 5) {
        categoryPath = 'net_lvl2';
    } else if (challenge_id == 6) {
        categoryPath = 'sys_lvl2';
    } else if (challenge_id == 7) {
        categoryPath = 'web_lvl3';
    } else if (challenge_id == 8) {
        categoryPath = 'net_lvl3';
    } else if (challenge_id == 9) {
        categoryPath = 'sys_lvl3';
    } else if (challenge_id == 10) {
        categoryPath = 'web_lvl4';
    } else if (challenge_id == 11) {
        categoryPath = 'net_lvl4';
    } else if (challenge_id == 12) {
        categoryPath = 'sys_lvl4';
    } else if (challenge_id == 13) {
        categoryPath = 'web_lvl5';
    } else if (challenge_id == 14) {
        categoryPath = 'net_lvl5';
    } else if (challenge_id == 15) {
        categoryPath = 'sys_lvl5';
    }
    try {
        const container = await docker.createContainer({
            Image: challengeImage,
            name: `challenge_${challenge_id}_${user_pseudo}_${Date.now()}`,
            ExposedPorts: {
                '5000/tcp': {},
                '22/tcp': {}
            },
            HostConfig: {
                PortBindings: {
                    '5000/tcp': [{ HostPort: '0' }],
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
            console.error('Port mapping is undefined or empty:', JSON.stringify(data.NetworkSettings.Ports, null, 2));
            throw new Error('Port mapping is undefined or empty');
        }

        const port5000 = port5000Mapping[0].HostPort;
        const port22 = port22Mapping[0].HostPort;

        console.log(`Storing container data in the database for container ID: ${container.id} with user_id: ${user_id}`);

        try {
            const result = await pool.query(
                'INSERT INTO user_containers (user_id, container_id, start_time) VALUES ($1, $2, NOW())',
                [user_id, container.id]
            );
            console.log('Data successfully inserted into user_containers table:', result.rowCount);
        } catch (dbErr) {
            console.error('Error inserting data into user_containers:', dbErr);
            throw dbErr;
        }

        res.json({
            container_id: container.id,
            challenge_urls: {
                app_url: `http://192.168.122.1:${port5000}/${categoryPath}`,
                ssh_url: `ssh user@192.168.122.1 -p ${port22}`,
                challenge_image: challengeImage
            }
        });
    } catch (err) {
        console.error('Error during container creation or database insertion:', err);
        res.status(500).json({ error: err.message });
    }
});

// Cron job to stop and remove containers after a minute
// Cron job to stop and remove containers after a minute
cron.schedule('*/1 * * * *', async () => {
    try {
        console.log('Cron job started');
        const userContainers = await pool.query('SELECT * FROM user_containers WHERE NOW() - start_time > interval \'2 hours\'');
        console.log('Containers to stop and remove:', userContainers.rows);
        for (const userContainer of userContainers.rows) {
            const container = docker.getContainer(userContainer.container_id);
            try {
                const containerData = await container.inspect();
                if (containerData.State.Running) {
                    await container.stop();
                    console.log(`Container ${userContainer.container_id} stopped`);
                } else {
                    console.log(`Container ${userContainer.container_id} is already stopped`);
                }
                await container.remove();
                console.log(`Container ${userContainer.container_id} removed`);
            } catch (err) {
                console.error(`Error stopping/removing container ${userContainer.container_id}:`, err.message);
            }
            await pool.query('DELETE FROM user_containers WHERE container_id = $1', [userContainer.container_id]);
            console.log(`Record for container ${userContainer.container_id} deleted from database`);
        }
    } catch (err) {
        console.error('Error in cron job:', err);
    }
});

///////////////////////////   KHALID ////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////

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


app.get('/user-ranking', async (req, res) => {
    try {
        const userScores = await pool.query(`
            SELECT usr.usr_pseudo, SUM(ctf.ctf_score) AS total_score
            FROM t_user_usr usr
            JOIN t_resolved_rsv rsv ON usr.usr_pseudo = rsv.usr_id
            JOIN t_ctf_ctf ctf ON rsv.ctf_id = ctf.ctf_id
            GROUP BY usr.usr_pseudo
            ORDER BY total_score DESC
        `);
        res.status(200).json(userScores.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération du classement des utilisateurs:', err.message);
        res.status(500).json({ message: 'Erreur lors de la récupération du classement des utilisateurs. Veuillez réessayer.' });
    }
});
app.get('/user-profile', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Non autorisé' });
    }

    try {
        const userId = req.session.userId;

        // Récupérer les informations de l'utilisateur
        const userProfile = await pool.query(`
            SELECT usr_pseudo, usr_first_name, usr_last_name, usr_email 
            FROM t_user_usr 
            WHERE user_id = $1
        `, [userId]);

        // Récupérer le score total de l'utilisateur
        const userScore = await pool.query(`
            SELECT SUM(ctf.ctf_score) AS total_score
            FROM t_resolved_rsv rsv
            JOIN t_ctf_ctf ctf ON rsv.ctf_id = ctf.ctf_id
            WHERE rsv.usr_id = $1
        `, [userProfile.rows[0].usr_pseudo]);

        // Combiner les informations de l'utilisateur et le score total
        const profileData = {
            ...userProfile.rows[0],
            total_score: userScore.rows[0].total_score || 0
        };

        res.status(200).json(profileData);
    } catch (err) {
        console.error('Erreur lors de la récupération du profil utilisateur:', err.message);
        res.status(500).json({ message: 'Erreur lors de la récupération du profil utilisateur. Veuillez réessayer.' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

