const express = require('express');
const multer = require('multer');
const upload = multer();
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { json } = require('body-parser');
require("dotenv").config();


const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  JWT_SECRET: process.env.JWT_SECRET
};

 function checkAdminRole (req, res, next){ // Supposons que le rôle est envoyé dans les en-têtes de la requête
    const token = req.headers['authorization']
    const decoded = jwt.verify(token, dbConfig.JWT_SECRET);
    const userRole =  decoded.role;
  console.log('checkAdminRole' + userRole)
    if (!userRole) {
      return res.status(403).json({ message: "Rôle non fourni" });
    }
  
    if (userRole.toLowerCase() !== 'admin') {
      return res.status(403).json({ message: "Accès interdit : rôle insuffisant" });
    }
  
    next(); // Passe au prochain middleware si le rôle est valide
  }


router.post('/users/addend', async (req, res) => {
    const { NAME, CERTFILE } = req.body;
    console.log('checkAdminRole')
    try {
      const connection = mysql.createConnection(dbConfig);
      
      const query = 'INSERT INTO endpoint (NAME, CERTFILE) VALUES (?, ?)';
      const values = [NAME, CERTFILE];
  
      connection.query(query, values, (error, results, fields) => {
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
  
  
  router.get('/users/endpoint', async (req, res) => {
    const connection = mysql.createConnection(dbConfig);
 
    try {
      const query = 'SELECT * FROM endpoint ORDER BY id DESC';
  
      connection.query(query, (error, results, fields) => {
        if (error) {
          console.error('Erreur serveur:', error.message);
          res.status(500).json({ message: 'Erreur serveur' });
          return;
        }
  
        const data = results.map(row => ({
          ID: row.id,
          NAME: row.name,
          CERTFILE: row.certfile,
        }));
        connection.end();
  
        res.json(data);
      });
    } catch (err) {
      console.error('Erreur serveur:', err.message);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
  router.delete('/users/deleteend/:userId', async (req, res) => {
    const userId = req.params.userId;
    const connection = mysql.createConnection(dbConfig);
  
    try {
      const checkQuery = 'SELECT COUNT(*) AS userCount FROM endpoint WHERE ID = ?';
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
  
        const deleteQuery = 'DELETE FROM endpoint WHERE ID = ?';
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
  
  router.get('/users/Getend/:Id', async (req, res) => {
    const Id = req.params.Id;
  
    try {
      const connection = mysql.createConnection(dbConfig);
      connection.connect(); 
  
      const query = 'SELECT * FROM endpoint WHERE ID = ?';
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
  
  router.put('/users/updateend/:Id', async (req, res) => {
    const Id = req.params.Id;
    const updatedUser = req.body;
  
    try {
      const connection = mysql.createConnection(dbConfig);
      connection.connect(); // Add this line to establish a connection
  
      const query = 'UPDATE endpoint SET NAME = ?, CERTFILE = ? WHERE ID = ?';
      const values = [updatedUser.name, updatedUser.certfile, Id];
  
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

  module.exports = router;