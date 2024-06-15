var express = require('express');
const { createReadStream } = require('fs');
const cookieParser = require('cookie-parser');
const COOKIE_SECRET = '1546414291';
var app = express();
app.use(cookieParser(COOKIE_SECRET));
const USERS = { alice: 'p2', bob: 'p2'}
const BALANCES = { alice: 500, bob: 100 }
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', function (req, res) {
    const username = req.signedCookies.username;
    const balance = BALANCES[username]
    if (username) {
        res.send(`Hi ${username}!, your balance is ${balance}`);
    }
    else {
        createReadStream('index.html').pipe(res)
    }
});
app.get('/logout', (req, res) => {
    res.clearCookie('username');
    res.redirect('/');
})
app.post('/login', function (req, res) {
    const username = req.body.firstName;
    const password = USERS[username];
    if (req.body.password === password) {
        res.cookie('username', username, {signed: true});
        const balance = BALANCES[username]
        res.send(`Hi ${username}!, your balance is $${balance}`);
    } else {
        res.send('fail!');
    }
});
app.get('/logout', (req, res) => {
    res.clearCookie('username');
    res.redirect('/');
})
var server = app.listen(5000, function () {
    console.log('Node server is running..');
});