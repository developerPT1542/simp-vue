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

//ajouter url
router.post('/users/addLog', async (req, res) => {
    const { URLLINK, POSTGET, IDENDPOINT } = req.body;
     try {
       // if (!isValidDateFormat(DATE_RESPONSE)) {
       //   return res.status(400).json({ message: 'Format de DATE_RESPONSE invalide. Utilisez le format "YYYY-MM-DD".' });
       // }
   
       const connection = mysql.createConnection(dbConfig);
       
       const query = 'INSERT INTO urls (urllink, postget, idendpoint) VALUES (?, ?, ?)';
       const values = [URLLINK, POSTGET, IDENDPOINT];
   
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
   
   
   
   // function isValidDateFormat(dateString) {
   //   const pattern = /^\d{4}-\d{2}-\d{2}$/;
   //   return pattern.test(dateString);
   // }
   
   
   
   router.get('/users/urls', async (req, res) => {
     const connection = mysql.createConnection(dbConfig);
     console.log(req.body);
     
     try {
       const query = `
         SELECT a.id, a.urllink, a.postget, b.name AS end_name
         FROM urls a
         JOIN endpoint b ON a.IDENDPOINT = b.ID
         ORDER BY a.id DESC
       `;
     
       connection.query(query, (error, results, fields) => {
         if (error) {
           console.error('Erreur serveur:', error.message);
           res.status(500).json({ message: 'Erreur serveur' });
           return;
         }
   
         const data = results.map(row => ({
           ID: row.id,
           URLLINK: row.urllink,
           POSTGET: row.postget,
           end_name: row.end_name,
         }));
   
         connection.end();
   
         res.json(data);
       });
     } catch (err) {
       console.error('Erreur serveur:', err.message);
       res.status(500).json({ message: 'Erreur serveur' });
     }
   });
   
   router.delete('/users/deleteLog/:userId', async (req, res) => {
     const userId = req.params.userId;
     const connection = mysql.createConnection(dbConfig);
   
     try {
       // Checking if the user exists
       const checkQuery = 'SELECT COUNT(*) AS userCount FROM URLS WHERE ID = ?';
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
       // Deleting the user
       const deleteQuery = 'delete FROM urls WHERE ID = ?';
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
   
   
   
   
   router.put('/users/updateUser/:Id', async (req, res) => {
     const Id = req.params.Id;
     const updatedUser = req.body;
   
     try {
       const connection = mysql.createConnection(dbConfig);
       connection.connect();
       // const fetchFonctionQuery = 'SELECT f.name AS ENDPOINT FROM WS_HEADER m JOIN endpoint f ON m.ID_ENDPOINT = f.id WHERE m.ID = ?';
       // const fetchFonctionBinds = [Id];
       // const fetchFonctionResult = await queryAsync(connection, fetchFonctionQuery, fetchFonctionBinds);
   
       // const currentFonctionName = fetchFonctionResult[0].ENDPOINT;
   
       const query = 'UPDATE urls SET URLLINK = ?, POSTGET = ? WHERE ID = ?';
       const values = [updatedUser.urllink, updatedUser.postget, Id];
   
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
   
   
   
   router.get('/users/GetUser/:Id', async (req, res) => {
     const Id = req.params.Id;
     try {
       const connection = mysql.createConnection(dbConfig);
       const query = `SELECT 
       m.* ,f.name as end_name FROM urls m JOIN endpoint f ON m.IDENDPOINT = f.id WHERE m.ID = ?`;
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

   module.exports = router;