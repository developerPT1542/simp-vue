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


router.get('/users/header', async (req, res) => {
  const connection = mysql.createConnection(dbConfig);

  try {
    const query = `
      SELECT m.id, m.KEY_PARAM, m.VALUE_PARAM, f.name AS EndPoint
      FROM ws_header m
      JOIN endpoint f ON m.ID_ENDPOINT = f.id
      ORDER BY m.id DESC`;

    connection.query(query, (error, results, fields) => {
      if (error) {
        console.error('Erreur serveur:', error.message);
        res.status(500).json({ message: 'Erreur serveur' });
        return;
      }

      const data = results.map(row => ({
        ID: row.id,
        KEY_PARAM: row.KEY_PARAM,
        VALUE_PARAM: row.VALUE_PARAM,
        ENDPOINT: row.EndPoint,
      }));

      connection.end();

      res.json(data);
    });
  } catch (err) {
    console.error('Erreur serveur:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

//addHeader 
router.post('/users/addheader', async (req, res) => {
  const {KEY_PARAM, VALUE_PARAM, ID_ENDPOINT} = req.body;

  try {
    const connection = mysql.createConnection(dbConfig);
    
    const query = `INSERT INTO ws_header (KEY_PARAM, VALUE_PARAM, ID_ENDPOINT) VALUES (?, ?, ?)`;

    const values = [KEY_PARAM, VALUE_PARAM, ID_ENDPOINT];

    connection.query(query, values, (error, results) => {
      if (error) {
        console.error('Erreur lors de l\'ajout du log:', error);
        res.status(500).json({ message: 'Échec de l\'ajout du log' });
        return;
      }

      connection.end();
      
      if (results.affectedRows === 1) {
        res.status(200).json({ message: 'Urls ajouté avec succès' });
      } else {
        res.status(500).json({ message: 'Échec de l\'ajout du log' });
      }
    });
  } catch (err) {
    console.error('Erreur lors de l\'ajout du log:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
//editHeader
router.get('/users/getHeader/:Id', async (req, res) => {
  const Id = req.params.Id;
  try {
    const connection = mysql.createConnection(dbConfig);
    const query = `SELECT 
    m.* ,f.name as end_name FROM ws_header m JOIN endpoint f ON m.ID_ENDPOINT = f.id WHERE m.ID = ?`;
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


router.put('/users/updateHeader/:Id', async (req, res) => {
  const Id = req.params.Id;
  const updatedUser = req.body;
  try {
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    // const fetchFonctionQuery = `SELECT f.name AS end_name
    // FROM WS_HEADER m
    // JOIN ENDPOINT f ON m.ID_ENDPOINT = f.id
    // WHERE m.ID = :Id`;

    // const fetchFonctionBinds = { Id };
    // const fetchFonctionOptions = { outFormat: oracledb.OUT_FORMAT_OBJECT };
    // const fetchFonctionResult = await connection.execute(fetchFonctionQuery, fetchFonctionBinds, fetchFonctionOptions);

    // const currentFonctionName = fetchFonctionResult.rows[0].END_NAME;

    const query = `UPDATE ws_header SET KEY_PARAM = ?, VALUE_PARAM = ? WHERE ID = ?`;
    
    const values = [updatedUser.key_param, updatedUser.value_param, Id];

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

//deleteHeader
router.delete('/users/deleteHeader/:userId', async (req, res) => {
  const userId = req.params.userId;
  const connection = mysql.createConnection(dbConfig);

  try {
    const checkQuery = 'SELECT COUNT(*) AS userCount FROM ws_header WHERE ID = ?';
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
    const deleteQuery = 'DELETE FROM ws_header WHERE ID = ?';
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