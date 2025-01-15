const express = require('express');
const multer = require('multer');
const upload = multer();
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};



router.post('/users/allWS', async (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  console.log(req.body);

  const startIndex = parseInt(req.body.startIndex) || 1;
  const endIndex = parseInt(req.body.endIndex) || 50;

  try {
    const query = `
    SELECT function_name, a.* 
    FROM (
      SELECT 
        
        b.name AS function_name, 
        a.* ,
        ROW_NUMBER() OVER (ORDER BY a.id DESC) AS rnum
      FROM ws_log a
      JOIN functionapi b ON a.id_fonction = b.ID
    ) a
    WHERE a.rnum BETWEEN ? AND ?
  `;
  const values = [startIndex, endIndex];
  connection.query(query, values, (error, results, fields) => {
    if (error) {
      console.error('Error executing query:', error.message);
      res.status(500).json({ message: 'Error executing query' });
      return;
    }
      const data = results.map(row => ({
        ID: row.id,
        URL_ENDPOINT: row.url_endpoint,
        FUNCTION_NAME: row.function_name,
        ID_FONCTION: row.id_fonction,
        STATUS: row.status,
        DATE_RESPONSE: row.date_response,
        LOG_TRACE: row.log_trace, 
        RESPONSE: row.response,   
      }));

      connection.end();

      res.json(data);
    });
  } catch (err) {
    console.error('Erreur serveur:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;