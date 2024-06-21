const express = require('express');
const bodyParser = require('body-parser');
const Docker = require('dockerode');
const path = require('path');
const cors = require('cors');

const app = express();
const docker = new Docker();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Servir les fichiers statiques (CSS, images, etc.)
app.use(express.static(path.join(__dirname, './')));

app.get('Network/LVL1', (req, res)=>{
	res.sendFile(path.join(__diranme, './Network/LVL 1/network1.html'));
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

