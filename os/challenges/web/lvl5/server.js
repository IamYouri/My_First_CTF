const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const csrf = require('csurf');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware pour analyser les requêtes POST et les cookies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



// Configuration de la session
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true, sameSite: 'None' }  // Utiliser secure: true en production avec HTTPS
}));

// Variable globale pour stocker le cookie
cookieSession = 's:0brr08oCzG77weft2bBCcd-50P3FRKhi.B3ppKHSLjfg/O46MvfDw9xkXG5zGRPZYbWR04HlHWR4';

// Utiliser cors pour permettre les requêtes cross-origin avec les cookies
app.use(cors({
    origin: 'http://127.0.0.1:5500',  // Remplacez par l'origine de votre Live Server
    methods: 'GET,OPTIONS,POST',
    allowedHeaders:'Content-Type, Authorization',
    credentials: true
}));

// const csrfProtection = csrf({ cookie: true });

let users = [{ id: 1, name: 'admin', password: 'password', flag: 'CTF{csrf_success}', loggedIn: false }];

// Page d'accueil
app.get('/', (req, res) => {
    res.send('<h1>Bienvenue à l\'Hôtel de la Paix</h1><p>Connectez-vous en tant qu\'administrateur pour vérifier les informations de sécurité.</p><a href="/login">Connexion</a>');
});


{/* <input type="hidden" name="_csrf" value="${req.csrfToken()}"></input> */}

// Page de connexion
app.get('/login', (req, res) => {
    res.send(`
        <h1>Connexion Administrateur</h1>
        <form action="/login" method="POST">
            <label for="name">Nom :</label><br>
            <input type="text" id="name" name="name"><br>
            <label for="password">Mot de passe :</label><br>
            <input type="password" id="password" name="password"><br>
            <button type="submit">Connexion</button>
        </form>
    `);
});

// Traitement de la connexion
app.post('/login', (req, res) => {
    const { name, password } = req.body;

    const user = users.find(u => u.name === name && u.password === password);
    if (user) {
        req.session.user = user;
        user.loggedIn = true;
        res.send(name + '<h1>Connexion réussie</h1> + voici votre cookie : s:0brr08oCzG77weft2bBCcd-50P3FRKhi.B3ppKHSLjfg/O46MvfDw9xkXG5zGRPZYbWR04HlHWR4');
    } else {
        res.send('Nom ou mot de passe incorrect');
    }
});

// // Page de l'administrateur
// app.get('/admin', (req, res) => {
//     console.log("cookie de admin : " + cookieSession);
//     console.log("cookie de hacker : "+ req.body.cookie);
//     if (req.body.cookie === cookieSession) {
//         res.send(`Voici xxx votre flag : ${req.session.user.flag}`);
//     } else {
//         res.send('Accès refusé. Veuillez vous connecter.');
//     }
// });

// Middleware pour analyser les requêtes POST et les cookies
app.use(bodyParser.json());

// Page de l'administrateur
app.post('/admin', (req, res) => {
    console.log("cookie de admin : " + cookieSession);
    console.log("cookie de hacker : " + req.body.cookie);
    console.log(users.flag);
    if (req.body.cookie === cookieSession) {
        res.send(`Voici votre flag : ${users[0].flag}`);
    } else {
        res.send('Accès refusé. Veuillez vous connecter.');
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
