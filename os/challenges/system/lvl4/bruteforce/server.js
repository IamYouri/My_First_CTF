const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 4321;

app.use(bodyParser.urlencoded({ extended: true }));

const username = 'Ramirez';
const password = 'canavaro';

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
