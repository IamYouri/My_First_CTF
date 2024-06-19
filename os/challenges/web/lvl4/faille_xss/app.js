const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/getFlag', (req, res) => {
    const query = req.query.query || '';
    if (query.includes('<script>')) {
        res.send('CTF{SGlCYXJiaWU=}');
    } else {
        res.send('No flag for you!');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
