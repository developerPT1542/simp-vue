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



//proc
router.get('/users/proc', async (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  console.log(req.body);

  try {
      const query = `SELECT m.id, b.name AS FUNCTION_NAME, m.NAME, m.PATHURL,
      m.PARAMINURL, m.RESPONSECODE, m.NEXTFUNCTION, m.POSTGET, m.ISASYNC FROM processapi m JOIN functionapi b ON m.FUNCTIONID = b.ID ORDER BY 
      b.id, m.id ASC`;
  
      connection.query(query, (error, results, fields) => {
        if (error) {
          console.error('Erreur serveur:', error.message);
          res.status(500).json({ message: 'Erreur serveur' });
          return;
        }
  
        const data = results.map(row => ({
          ID: row.id,
          FUNCTION_NAME: row.FUNCTION_NAME,
          NAME: row.NAME,
          PATHURL: row.PATHURL,
          PARAMINURL: row.PARAMINURL,
          RESPONSECODE: row.RESPONSECODE,
          NEXTFUNCTION: row.NEXTFUNCTION,
          POSTGET: row.POSTGET,
          ISASYNC: row.ISASYNC,
        }));
  
        connection.end();
  
        res.json(data);
      });
    } catch (err) {
      console.error('Erreur serveur:', err.message);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
///addProc
router.post('/users/addProc', async (req, res) => {
  const { NAME, PATHURL, POSTGET, ISASYNC, FUNCTIONID } = req.body;

  try {
    const connection = mysql.createConnection(dbConfig);

    // Insertion pour le code de réponse 200
    const query200 = 'INSERT INTO processapi (NAME, PATHURL,RESPONSECODE, POSTGET, ISASYNC, FUNCTIONID) VALUES (?, ?,200, ?, ?, ?)';
    let name200 = NAME +': 200'
    const binds200 = [name200, PATHURL, POSTGET, ISASYNC, FUNCTIONID];

    await queryAsync(connection, query200, binds200);

    // Insertion pour le code de réponse 400
    const query400 = 'INSERT INTO processapi (NAME, PATHURL,RESPONSECODE, POSTGET, ISASYNC, FUNCTIONID) VALUES (?, ?, 400, ?, ?, ?)';
    let name400 = NAME +': 400'
    const binds400 = [name400, PATHURL, POSTGET, ISASYNC, FUNCTIONID];


    await queryAsync(connection, query400, binds400);

    connection.end();

    res.status(200).json({ message: 'Enregistrements ajoutés avec succès' });
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



//editProc
router.get('/users/getProc/:Id', async (req, res) => {
  const Id = req.params.Id;
  try {
    const connection = mysql.createConnection(dbConfig);
    const query = `SELECT 
    m.*,
    f.name AS fonction_name
FROM processapi m
  JOIN functionapi f ON m.FUNCTIONID = f.id
WHERE m.ID = ?`;
const values = [Id];

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

router.put('/users/updateProc/:id', async (req, res) => {
  const id = req.params.id;
  const updatedUser = req.body;

  try {
    const connection = mysql.createConnection(dbConfig);

    const updateQuery = 'UPDATE processapi SET PATHURL = ?, POSTGET = ?, ISASYNC = ? WHERE ID = ?';
    const values = [updatedUser.pathurl, updatedUser.postget, updatedUser.isasync, id];

    const result = await new Promise((resolve, reject) => {
      connection.query(updateQuery, values, (error, result) => {
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

//deletProc 
router.delete('/users/deleteProc/:userId', async (req, res) => {
  const userId = req.params.userId;
  const connection = mysql.createConnection(dbConfig);

  try {
    const checkQuery = 'SELECT COUNT(*) AS userCount FROM processapi WHERE ID = ?';
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
    const deleteQuery = 'DELETE FROM processapi WHERE ID = ?';
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