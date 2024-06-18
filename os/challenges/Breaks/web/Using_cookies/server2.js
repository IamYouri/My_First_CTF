//Feross Aboukhadijeh, CS 253 Web Security, Fall 2021, https://web.stanford.edu/class/cs253/

var express = require('express');
const { createReadStream } = require('fs');
const cookieParser = require('cookie-parser');

var app = express();
app.use(cookieParser());
const USERS = {
    alice: 'p1',
    bob: 'p2'
}

const BALANCES = { alice: 500, bob: 100 }
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', function (req, res) {
    const username = req.cookies.username;
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
        res.cookie('username', username);
        res.send('nice!');
    } else {
        res.send('fail!');
    }
    // res.send(name + ' Submitted Successfully!');
});

var server = app.listen(5000, function () {
    console.log('Node server is running..');
});