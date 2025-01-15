const express = require('express');
const multer = require('multer');
const upload = multer();
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const authmiddlware = require('../middlwares/authmiddlware')

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

router.post('/users/mapping', async (req, res) => {
  const connection = mysql.createConnection(dbConfig);

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err.message);
      res.status(500).json({ message: 'Error connecting to MySQL' });
      return;
    }

    try {
      const startIndex = parseInt(req.body.startIndex) || 1;
      const endIndex = parseInt(req.body.endIndex) || 50;

      const query = `
      SELECT m.id, m.INPUTNAME, m.DESTINATIONNAME,
      m.TOLOG, m.INPUTOUTPUT, m.RESPONSECODE, m.MANDATORY, m.FUNCTION_NAME, m.URL_NAME, m.PROC_NAME  
FROM (
  SELECT 
     m.id, 
     m.INPUTNAME, 
     m.DESTINATIONNAME, 
     m.TOLOG, 
     m.INPUTOUTPUT, 
     m.RESPONSECODE, 
     m.MANDATORY, 
     b.name AS FUNCTION_NAME, 
     u.urllink AS URL_NAME, 
     p.NAME AS PROC_NAME,
     ROW_NUMBER() OVER (ORDER BY b.id, m.id DESC) AS rnum
  FROM mapping m 
  JOIN functionapi b ON m.IDFUNCTION = b.ID
  JOIN urls u ON m.IDURL = u.id
  JOIN processapi p ON m.IDPROCESSAPI = p.id
) m
WHERE m.rnum BETWEEN ? AND ?
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
          INPUTNAME: row.INPUTNAME,
          DESTINATIONNAME: row.DESTINATIONNAME,
          TOLOG: row.TOLOG,
          INPUTOUTPUT: row.INPUTOUTPUT,
          RESPONSECODE: row.RESPONSECODE,
          MANDATORY: row.MANDATORY,
          fonction_name: row.FUNCTION_NAME,
          url_name: row.URL_NAME,
          proc_name: row.PROC_NAME,
        }));

        connection.end();

        res.json(data);
      });
    } catch (err) {
      console.error('Server error:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
});

router.post('/users/addMap', upload.none(), async (req, res) => {
  const step1Records = JSON.parse(req.body.step1Records);
  const step2Records = JSON.parse(req.body.step2Records);
  console.log(step1Records);
  console.log(step2Records);

  try {
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    for (const step2Record of step2Records) {
      const query = `INSERT INTO mapping (INPUTNAME, DESTINATIONNAME, TOLOG, INPUTOUTPUT, MANDATORY, IDFUNCTION, IDURL, IDPROCESSAPI) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      const values = [
        step2Record.INPUTNAME,
        step2Record.DESTINATIONNAME,
        step2Record.TOLOG,
        step2Record.INPUTOUTPUT,
        step2Record.MANDATORY,
        step1Records[0].IDFUNCTION,
        step1Records[0].IDURL,
        step1Records[0].IDPROCESSAPI,
      ];

      
      const result = await queryAsync(connection, query, values);
    }

    connection.end();

    res.status(200).json({ message: 'Urls ajoutés avec succès' });
  } catch (err) {
    console.error('Erreur lors de l\'ajout du log:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Function to promisify MySQL queries
function queryAsync(connection, query, values) {
  return new Promise((resolve, reject) => {
    connection.query(query, values, (error, result) => {
      if (error) {
        console.error('Erreur lors de l\'exécution de la requête MySQL:', error);
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

router.get('/users/recup', async (req, res) => {
  const connection = mysql.createConnection(dbConfig);

  try {
    const queryFunction = `select * from functionapi ORDER BY id DESC`;
    const queryProcess = `SELECT * FROM processapi ORDER BY ID DESC`;

    const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };

    const resultFunction = await connection.execute(queryFunction, [], options);
    const resultProcess = await connection.execute(queryProcess, [], options);

    const dataFunction = resultFunction.rows.map((row) => ({
      ID: row[0],
      NAME: row[1],
    }));

    const dataProcess = resultProcess.rows.map((row) => ({
      ID: row[0],
      NAME: row[1],
    }));

    connection.close();

    res.json({ functions: dataFunction, processes: dataProcess });
  } catch (err) {
    console.error('Erreur serveur:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



//editMapping
router.get('/users/GetMap/:Id', async (req, res) => {
  const Id = req.params.Id;
  try {
    const connection = mysql.createConnection(dbConfig);
    connection.connect(); 
    const query = `SELECT 
      m.*,
      f.name AS fonction_name,
      p.urllink AS url_name
    FROM mapping m
    JOIN functionapi f ON m.IDFUNCTION = f.id
    JOIN urls p ON m.IDURL = p.id
    WHERE m.ID = ?`;
    const values =[Id];
    const result = await new Promise((resolve, reject) => {
      connection.query(query, values, (error, result) => {
        if (error) {
          console.error('Erreur lors de la récupération des données de l\'endpoint', error);
          reject(error);
          return;
        }

        if (result.length === 0) {
          connection.end();
          reject({ status: 404, message: 'Endpoint non trouvé' });
          return;
        }

        const endpoint = result[0];
        connection.end();
        resolve(endpoint);
      });
    });

    res.json(result);
  } catch (error) {
    console.error('Erreur lors de la récupération des données de l\'endpoint', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/users/updateMap/:Id', async (req, res) => {
  const Id = req.params.Id;
  const updatedUser = req.body;
  try {
    const connection = mysql.createConnection(dbConfig);
   
    const query = `UPDATE mapping 
    SET 
        INPUTNAME = ?, DESTINATIONNAME = ?,
        TOLOG = ?,
        INPUTOUTPUT = ?,
        MANDATORY = ?
    WHERE 
        ID = ?`;

        const values = [updatedUser.inputname, updatedUser.destinationname,updatedUser.tolog,updatedUser.inputoutput,updatedUser.mandatory, Id];
    
    
        const result = await new Promise((resolve, reject) => {
          connection.query(query, values, (error, result) => {
            if (error) {
              console.error('Erreur lors de la mise à jour de l\'endpoint:', error);
              reject(error);
              return;
            }
    
            if (result.affectedRows === 1) {
              resolve({ status: 200, message: 'Endpoint mis à jour avec succès' });
            } else {
              reject({ status: 404, message: 'Endpoint non trouvé' });
            }
    
            connection.end();
          });
        });
    
        res.status(result.status).json({ message: result.message });
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'endpoint:', error);
        res.status(500).json({ message: 'Erreur serveur' });
      }
    });
    

//deletemap
router.delete('/users/deleteMap/:userId', async (req, res) => {
  const userId = req.params.userId;
  const connection = mysql.createConnection(dbConfig);

  try {
    const checkQuery = 'SELECT COUNT(*) AS userCount FROM mapping WHERE ID = ?';
    const checkValues = [userId];

    connection.query(checkQuery, checkValues, async (checkError, checkResult) => {
      if (checkError) {
        console.error('Erreur lors de la vérification de l\'utilisateur:', checkError);
        connection.end();
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      const userCount = checkResult[0].userCount;

      if (userCount === 0) {
        connection.end();
        return res.status(404).json({ message: 'Endpoint introuvable' });
      }

    const deleteQuery = 'DELETE FROM mapping WHERE ID = ?';
    const deleteValues = [userId];

      connection.query(deleteQuery, deleteValues, (deleteError, deleteResult) => {
        if (deleteError) {
          console.error('Erreur lors de la suppression de l\'endpoint:', deleteError);
          connection.end();
          return res.status(500).json({ message: 'Échec de la suppression de l\'endpoint' });
        }

        connection.end();
        return res.status(200).json({ message: 'Endpoint supprimé avec succès' });
      });
    });
  } catch (err) {
    console.error('Erreur serveur:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
module.exports = router;