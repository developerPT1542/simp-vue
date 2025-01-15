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



router.get('/users', (req, res) => {
  const connection = mysql.createConnection(dbConfig);

  // Requête SQL pour récupérer les informations des utilisateurs et leur rôle
  const query = `
    SELECT admin_user.Nom, admin_user.Email, role.code AS roleCode
    FROM admin_user
    INNER JOIN role ON admin_user.id_role = role.id
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erreur serveur:', error.message);
      connection.end(); // Ferme la connexion en cas d'erreur
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    if (results.length === 0) {
      connection.end(); // Ferme la connexion si aucun utilisateur n'est trouvé
      return res.status(404).json({ message: 'Aucun utilisateur trouvé' });
    }

    // Transformation des résultats pour les structurer
    const data = results.map(row => ({
      NOM: row.Nom,
      EMAIL: row.Email,
      ROLECODE: row.roleCode,
    }));

    connection.end(); // Ferme la connexion après l'exécution de la requête

    res.json(data); // Envoie les résultats au client
  });
});



//login
router.post('/users/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const connection = mysql.createConnection(dbConfig);

    // Jointure pour récupérer les informations de l'utilisateur et son rôle
    const query = `
      SELECT admin_user.Iduser, admin_user.Nom, admin_user.Pasword, role.code AS roleCode
      FROM admin_user
      INNER JOIN role ON admin_user.id_role = role.id
      WHERE admin_user.Nom = ?
    `;

    connection.query(query, [username], async (error, rows) => {
      if (error) {
        console.error('Erreur serveur:', error.message);
        connection.end(); // Ferme la connexion
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      if (rows.length === 0) {
        connection.end(); // Ferme la connexion
        return res.status(401).json({ message: 'Nom d\'utilisateur incorrect' });
      }

      const user = rows[0];
      const hashedPassword = user.Pasword;

      // Vérification du mot de passe
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (!passwordMatch) {
        connection.end(); // Ferme la connexion
        return res.status(401).json({ message: 'Mot de passe incorrect' });
      }

      // Génère le JWT avec le rôle
      const token = jwt.sign(
        {username: user.Nom, role: user.roleCode },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      connection.end(); // Ferme la connexion
      res.json({ user, token });    });
  } catch (err) {
    console.error('Erreur serveur:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

const saltRounds = 10;

// **2. Endpoint pour ajouter un utilisateur**
router.post('/users/addUser', async (req, res) => {
  const { Email, username, password } = req.body;

  try {
    const connection = mysql.createConnection(dbConfig);

    // Vérifier si l'email ou le nom d'utilisateur existe déjà
    const checkQuery = `SELECT * FROM admin_user WHERE Email = ? OR Nom = ?`;
    connection.query(checkQuery, [Email, username], async (checkError, checkResults) => {
      if (checkError) {
        console.error('Erreur serveur:', checkError.message);
        connection.end(); // Ferme la connexion
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      if (checkResults.length > 0) {
        connection.end(); // Ferme la connexion
        return res.status(409).json({ message: 'Email ou nom d\'utilisateur existe déjà' });
      }

      // Hachage du mot de passe si l'email et le nom d'utilisateur sont uniques
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Requête pour insérer un nouvel utilisateur avec id_role = 2 (utilisateur standard par défaut)
      const defaultRoleId = 2; // Rôle "user" par défaut
      const insertQuery = `
        INSERT INTO admin_user (Email, Nom, Pasword, id_role) 
        VALUES (?, ?, ?, ?)
      `;
      const values = [Email, username, hashedPassword, defaultRoleId];

      connection.query(insertQuery, values, (insertError, results) => {
        if (insertError) {
          console.error('Erreur serveur:', insertError.message);
          connection.end(); // Ferme la connexion
          return res.status(500).json({ message: 'Erreur serveur' });
        }

        if (results.affectedRows === 1) {
          res.status(201).json({ message: 'Utilisateur bien ajouté' });
        } else {
          res.status(400).json({ message: 'Échec de l\'ajout de l\'utilisateur' });
        }

        connection.end(); // Ferme la connexion après la requête
      });
    });
  } catch (err) {
    console.error('Erreur serveur:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// had lfonction ghi bach n extraire les données CLOB
async function fetchCLOB(lob) {
  return new Promise((resolve, reject) => {
    lob.getData((err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
//editUser
router.get('/user/:Id', async (req, res) => {
  const Id = req.params.Id;
   console.log(Id + 'hello')
  const connection = mysql.createConnection(dbConfig);

  const query = `SELECT Email, Nom FROM admin_user WHERE Iduser = ?`;
  const values = [Id];

  connection.query(query, values, (error, results, fields) => {
    if (error) {
      console.error('Erreur serveur:', error.message);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const user = results[0];
    console.log(JSON.stringify(user) + 'hay')
    res.status(200).json({ user });
    
    // Fermer la connexion après l'exécution de la requête
    connection.end();
  });
});



// Function to hash a password
async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

// Function to verify password against a hash
// async function verifyPassword(password, hashedPassword) {
//     const match = await bcrypt.compare(password, hashedPassword);
//     return match;
// }

// Function to update password
async function updatePasswordInDatabase(userId, newPassword) {
  try {
    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    const connection = mysql.createConnection(dbConfig);
    
    const updateQuery = "UPDATE admin_user SET Pasword = ? WHERE Iduser = ?";
    const updateValues = [hashedPassword, userId];

    connection.query(updateQuery, updateValues, (error, results, fields) => {
      if (error) {
        console.error('Server Error:', error.message);
        // Handle database update error
        connection.end();
        return;
      }
      console.log(userId)

      if (results.affectedRows === 1) {
        console.log("Password updated successfully.");
      } else {
        console.log("Failed to update password. User not found or password not updated.");
      }

      connection.end();
    });
  } catch (error) {
    console.error('Server Error:', error.message);
    // Handle hashing error
  }
}

// Your router post endpoint
router.post('/users/resetPassword', async (req, res) => {
  const { ID, newPassword } = req.body;

  try {
    // Update password in the database
    await updatePasswordInDatabase(ID, newPassword);
    console.log(ID)
    // Send response
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Server Error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router
   
  



