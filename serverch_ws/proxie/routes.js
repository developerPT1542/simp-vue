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


router.get('/users/proxies', async (req, res) => {
    const connection = mysql.createConnection(dbConfig);
  
    try {
      const query = `
        SELECT m.id, m.KEY_PARAM, m.VALUE_PARAM, f.name AS EndPoint
        FROM ws_proxies m
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
  router.post('/users/addproxies', async (req, res) => {
    const {KEY_PARAM, VALUE_PARAM, ID_ENDPOINT} = req.body;
  
    try {
      const connection = mysql.createConnection(dbConfig);
      
      const query = `INSERT INTO ws_proxies (KEY_PARAM, VALUE_PARAM, ID_ENDPOINT) VALUES (?, ?, ?)`;
  
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
  router.get('/users/getproxies/:Id', async (req, res) => {
    const Id = req.params.Id;
    try {
      const connection = mysql.createConnection(dbConfig);
      const query = `SELECT 
      m.* ,f.name as end_name FROM ws_proxies m JOIN endpoint f ON m.ID_ENDPOINT = f.id WHERE m.ID = ?`;
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
  
  
  router.put('/users/updateProxies/:Id', async (req, res) => {
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
  
      const query = `UPDATE ws_proxies SET KEY_PARAM = ?, VALUE_PARAM = ? WHERE ID = ?`;
      
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
  router.delete('/users/deleteProxies/:userId', async (req, res) => {
    const userId = req.params.userId;
    const connection = mysql.createConnection(dbConfig);
  
    try {
      const checkQuery = 'SELECT COUNT(*) AS userCount FROM ws_proxies WHERE ID = ?';
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
      const deleteQuery = 'DELETE FROM ws_proxies WHERE ID = ?';
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
  
  //Header_Url
  router.get('/users/proxiesUrl', async (req, res) => {
    const connection = mysql.createConnection(dbConfig);
  
    try {
      const query = `
        SELECT 
      h.id,
      u.URLLINK AS URLLINK,
      w.KEY_PARAM AS KEY_PARAM
  FROM 
      ws_proxies_url h
  JOIN 
      urls u ON h.id_url = u.id
  JOIN 
      ws_proxies w ON h.id_proxies = w.id
  ORDER BY 
      h.id DESC`;
  
      connection.query(query, (error, results, fields) => {
        if (error) {
          console.error('Erreur serveur:', error.message);
          res.status(500).json({ message: 'Erreur serveur' });
          return;
        }
  
        const data = results.map(row => ({
          ID: row.id,
          URLLINK: row.URLLINK,
          KEY_PARAM: row.KEY_PARAM
        }));
  
        connection.end();
  
        res.json(data);
      });
    } catch (err) {
      console.error('Erreur serveur:', err.message);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
  // Route pour récupérer les URLs par nom d'endpoint
  router.get('/users/:name/urlsandproxies', async (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const endpointName = req.params.name.toUpperCase(); // Convertir le nom en majuscules
  
    try {
      // Obtenir les IDs de l'endpoint
      const queryEndpoint = 'SELECT id FROM endpoint WHERE UPPER(name) = ?';
      
      connection.query(queryEndpoint, [endpointName], (error, endpointResults) => {
        if (error) {
          console.error('Erreur lors de la récupération de l\'endpoint:', error.message);
          connection.end();
          return res.status(500).json({ message: 'Erreur lors de la récupération de l\'endpoint' });
        }
        
        if (endpointResults.length === 0) {
          connection.end();
          return res.status(404).json({ message: 'Endpoint non trouvé' });
        }
        
        const endpointId = endpointResults[0].id;
        
        // Obtenir les URLs associées
        const queryUrls = `
          SELECT id AS url_id, urllink 
          FROM urls 
          WHERE IDENDPOINT = ?
        `;
        
        // Obtenir les Headers associés
        const queryHeaders = `
          SELECT id AS proxies_id, KEY_PARAM 
          FROM ws_proxies 
          WHERE ID_ENDPOINT = ?
        `;
        
        connection.query(queryUrls, [endpointId], (error, urlsResults) => {
          if (error) {
            console.error('Erreur lors de la récupération des URLs:', error.message);
            connection.end();
            return res.status(500).json({ message: 'Erreur lors de la récupération des URLs' });
          }
          
          connection.query(queryHeaders, [endpointId], (error, headersResults) => {
            if (error) {
              console.error('Erreur lors de la récupération des Headers:', error.message);
              connection.end();
              return res.status(500).json({ message: 'Erreur lors de la récupération des Headers' });
            }
            
            // Envoyer les résultats au client
            res.json({
              urls: urlsResults,
              headers: headersResults
            });
            
            connection.end();
          });
        });
      });
    } catch (err) {
      console.error('Erreur serveur:', err.message);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  // Route pour ajouter des lignes à la table ws_header_url en utilisant le nom d'endpoint
  router.post('/users/addproxiesUrls', async (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { urlIds, headerIds } = req.body; // Recevoir les IDs des URLs et Headers
  
    try {
      // Préparer les valeurs à insérer dans ws_header_urls
      const values = urlIds.flatMap(urlId =>
        headerIds.map(headerId => [urlId, headerId])
      );
  
      // Requête d'insertion
      const queryInsert = 'INSERT INTO ws_proxies_url (id_url, id_proxies) VALUES ?';
  
      connection.query(queryInsert, [values], (error) => {
        if (error) {
          console.error('Erreur lors de l\'insertion des données:', error.message);
          connection.end();
          return res.status(500).json({ message: 'Erreur lors de l\'insertion des données' });
        }
  
        connection.end();
        res.json({ message: 'Données ajoutées avec succès' });
      });
    } catch (err) {
      console.error('Erreur serveur:', err.message);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  //editHedeUrl
  router.put('/users/proxiesUrl/:id', async (req, res) => {
    const id = req.params.id; // Corrected to lowercase 'id'
    const updatedUser = req.body;
  
    try {
      const connection = mysql.createConnection(dbConfig);
      connection.connect();
  
      const query = `
        UPDATE ws_proxies_url h
        JOIN urls u ON h.id_url = u.id
        JOIN ws_proxies w ON h.id_proxies = w.id
        SET w.KEY_PARAM = ?, u.URLLINK = ?
        WHERE h.id = ?
      `;
  
      connection.query(query, [updatedUser.KEY_PARAM, updatedUser.URLLINK, id], (error, results) => {
        if (error) {
          console.error('Erreur serveur:', error.message);
          res.status(500).json({ message: 'Erreur serveur' });
          return;
        }
  
        // Closing the connection once the query is successful
        connection.end();
  
        res.json({ message: 'Enregistrement mis à jour avec succès' });
      });
  
    } catch (err) {
      console.error('Erreur serveur:', err.message);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
  
  
  // Get specific Header URL details
  router.get('/users/proxiesUrl/:id', async (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;
    
    try {
      const query = `
        SELECT 
          h.id,
          u.URLLINK AS URLLINK,
          w.KEY_PARAM AS KEY_PARAM
        FROM 
          ws_proxies_url h
        JOIN 
          urls u ON h.id_url = u.id
        JOIN 
          ws_proxies w ON h.id_proxies = w.id
        WHERE 
          h.id = ?
      `;
      
      connection.query(query, [id], (error, results) => {
        if (error) {
          console.error('Erreur serveur:', error.message);
          res.status(500).json({ message: 'Erreur serveur' });
          return;
        }
        
        if (results.length === 0) {
          res.status(404).json({ message: 'Enregistrement non trouvé' });
          return;
        }
  
        const record = {
          ID: results[0].id,
          URLLINK: results[0].URLLINK,
          KEY_PARAM: results[0].KEY_PARAM
        };
  
        connection.end();
        res.json(record);
      });
    } catch (err) {
      console.error('Erreur serveur:', err.message);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
  
  
  //deleteHedUrl
  router.delete('/users/deleteproxUrl/:userId', async (req, res) => {
    const userId = req.params.userId;
    const connection = mysql.createConnection(dbConfig);
  
    try {
      const checkQuery = 'SELECT COUNT(*) AS userCount FROM ws_proxies_url WHERE ID = ?';
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
      const deleteQuery = 'DELETE FROM ws_proxies_url WHERE ID = ?';
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