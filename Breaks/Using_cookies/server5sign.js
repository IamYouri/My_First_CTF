var express = require('express');
const { createReadStream } = require('fs');
const cookieParser = require('cookie-parser');
//const COOKIE_SECRET = '1546414291';
const {randomBytes} = require('crypto')
const SESSIONS = {} //sessionID -> username
let nextSessionId = 0;
var app = express();
app.use(cookieParser());
const USERS = {alice: 'p1', bob: 'p2'}
const BALANCES = { alice: 500, bob: 100 }
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', function (req, res) {
    const sessionId = req.cookies.sessionId;
    const username = SESSIONS[sessionId];
    if (username) {
        const balance = BALANCES[username];
        res.send(`Hi ${username}!, your balance is ${balance}`);
    }
    else {
        createReadStream('index.html').pipe(res)
    }
});
app.get('/logout', (req, res) => {
    const sessionId = req.cookies.sessionId;
    delete SESSIONS[sessionId];
    res.clearCookie('sessionId');

    res.redirect('/');
})
app.post('/login', function (req, res) {
    var name = req.body.firstName + ' ' + req.body.password;
    console.log(name);
    console.log(req.body);
    const username = req.body.firstName;
    const password = USERS[username];
    if (req.body.password === password) {
        //res.cookie('username', username,  {signed: true});
        nextSessionId = randomBytes(16).toString('base64');
        res.cookie('sessionId', nextSessionId, {maxAge: 60 * 60 * 1000});
        SESSIONS[nextSessionId] = username;
        //nextSessionId = nextSessionId + 1;
        const balance = BALANCES[username]
        res.send(`Hi ${username}!, your balance is ${balance}`);
        //res.redirect('/');
    } else {
        res.send('fail!');
    }
});
var server = app.listen(5000, function () {
    console.log('Node server is running..');
});