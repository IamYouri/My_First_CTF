var express = require('express');
//Lire des données sous la forme de flux (ou de « streams ») 
const { createReadStream } = require('fs');
//Express est un framework MVC basé sur NodeJS, il est très populaire au sein de la communauté
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', function (req, res) {
        createReadStream('index.html').pipe(res);
});
app.post('/login', function (req, res) {
});
var server = app.listen(5000, function () {
    console.log('Node server is running..');
});