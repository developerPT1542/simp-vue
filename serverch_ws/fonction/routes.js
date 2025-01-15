const express = require('express');
const multer = require('multer');
const upload = multer();
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const verify = require('../middlwares/authmiddlware')

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};


//fonction
router.get('/users/fonction', async (req, res) => {
  const connection = mysql.createConnection(dbConfig);

  try {
    const query = `
      SELECT * FROM functionapi
      ORDER BY id DESC`;

    connection.query(query, (error, results) => {
      if (error) {
        console.error('Erreur serveur2:', error.message);
        res.status(500).json({ message: 'Erreur serveur1' });
        return;
      }

      const data = results.map(row => ({
        ID: row.id,
        NAME: row.name,
        FUNCTIONTYPE: row.functiontype,
      }));
      connection.end();

      res.json(data);
    });
  } catch (err) {
    console.error('Erreur serveur1:', err.message);
    res.status(500).json({ message: 'Erreur serveur2' });
  }
});

//addFonction
router.post('/users/addFonction', async (req, res) => {
  const { NAME, FUNCTIONTYPE } = req.body;

  try {
    const connection = mysql.createConnection(dbConfig);

    const query = 'INSERT INTO functionapi (NAME, FUNCTIONTYPE) VALUES (?, ?)';
    
    const values = [NAME, FUNCTIONTYPE];

    connection.query(query, values, (error, result) => {
      connection.end();

      if (error) {
        console.error('Erreur lors de l\'ajout du log:', error);
        return res.status(500).json({ message: 'Échec de l\'ajout du log' });
      }

      if (result.affectedRows === 1) {
        res.status(200).json({ message: 'Urls ajouté avec succès' });
      } else {
        res.status(500).json({ message: 'Échec de l\'ajout du log' });
      }
    });
  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

//editFonction
router.get('/users/getFonc/:Id', async (req, res) => {
  const Id = req.params.Id;
  try {
    const connection = mysql.createConnection(dbConfig);
    connection.connect(); 

    const query = `SELECT * FROM functionapi WHERE Id = ?`;
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

        const functionapi = result[0];
        connection.end();
        resolve(functionapi);
      });
    });

    res.json(result);
  } catch (error) {
    console.error('Erreur lors de la récupération des données de l\'endpoint', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/users/updateFonc/:Id', async (req, res) => {
  const Id = req.params.Id;
  const updatedUser = req.body;
  try {
    const connection = mysql.createConnection(dbConfig);
    connection.connect();

    const query = `UPDATE functionapi SET NAME = ?, FUNCTIONTYPE = ? WHERE ID = ?`;

    const values = [updatedUser.name, updatedUser.functiontype, Id];

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
//deleteFonc
router.delete('/users/deleteFonc/:userId', async (req, res) => {
  const userId = req.params.userId;
  const connection = mysql.createConnection(dbConfig);

  try {
    const checkQuery = 'SELECT COUNT(*) AS userCount FROM functionapi WHERE ID = ?';
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
    const deleteQuery = 'DELETE FROM functionapi WHERE ID = ?';
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