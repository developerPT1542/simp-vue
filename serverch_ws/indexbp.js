const express = require('express');
const multer = require('multer');
const upload = multer();
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const routes = require('./router');
const route = require('./routes/login/routes');
const log = require('./logTrace/routes')
const map = require('./mapping/routes')
const hed = require('./header/routes')
const hedurl = require('./headerUrl/routes')
const fonction = require('./fonction/routes')
const proxies = require('./proxie/routes')
const proces = require('./process/routes')
const endpoint = require('./endpoint/routes')
const urls = require('./urls/routes')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const app = express();
const port = 3001;
const corsOptions = {
  //origin: 'http://localhost:8081', // hada pour Remplacez domaine li baghi
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Autorisation dyal authentification 
  optionsSuccessStatus: 204, 
};

app.use(cors(corsOptions));
app.use(bodyParser.json());


const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

app.use('/api', endpoint);
app.use('/api', routes);
app.use('/api', route);
app.use('/api', log);
app.use('/api', map);
app.use('/api', hed);
app.use('/api', hedurl);
app.use('/api', fonction);
app.use('/api', proxies);
app.use('/api', proces);
app.use('/api', urls);



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Erreur serveur');
});

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});


