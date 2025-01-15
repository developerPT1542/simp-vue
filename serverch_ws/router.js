const express = require('express');
const multer = require('multer');
const upload = multer();
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const BpmnModdle = require('bpmn-moddle');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

router.use(express.static(path.join(__dirname, 'public')));

// Endpoint to get the content of the file
const filePath = '/home/pts/Simp_20022/premium2/templates/iso20022_template.txt';
const filePath1 = '/home/pts/Simp_20022/premium2/templates/mt103_template.txt';


router.get('/file', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
     console.error('Error reading file:', err);
      return res.status(500).send('Error reading file.');
    }
    res.send(data);
  });
});

router.post('/file', (req, res) => {
  const content = req.body.content;
  fs.writeFile(filePath, content, 'utf8', (err) => {
    if (err) {
      return res.status(500).send('Error saving file.');
    }
    res.send('File saved successfully.');
  });
});
// Serve the frontend HTML file
router.get('/fille', (req, res) => {
  fs.readFile(filePath1, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file.');
    }
    res.send(data);
  });
});

// Endpoint to save the modified content to the file
router.post('/fille', (req, res) => {
  const content = req.body.content;
  fs.writeFile(filePath1, content, 'utf8', (err) => {
    if (err) {
      return res.status(500).send('Error saving file.');
    }
    res.send('File saved successfully.');
  });
});

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload1 = multer({ storage });

// Middleware pour servir les fichiers statiques dans le dossier "uploads"
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint pour l'upload de fichiers
router.post('/upload', upload1.single('file'), (req, res) => {
  console.log('Incoming request...');
  if (!req.file) {
    console.log('No file uploaded.');
    return res.status(400).send('No file uploaded.');
  }
  console.log('File uploaded successfully:', req.file);
  res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
});

//bpmn

router.get('/generate-bpmn/:id', (req, res) => {
  const processId = req.params.id;
  const connection = mysql.createConnection(dbConfig);

  const query = `SELECT m.id, b.name AS FUNCTION_NAME, m.NOM, m.PATHURL, m.ISASYNC
                 FROM processapi m
                 JOIN functionapi b ON m.FUNCTIONID = b.ID
                 WHERE m.id = ?`;
  const values = [processId];

  connection.query(query, values, (error, results, fields) => {
    if (error) {
      console.error('Erreur serveur:', error.message);
      res.status(500).json({ message: 'Erreur serveur' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: 'ID non trouvé' });
      return;
    }

    const isAsync = results[0].ISASYNC;
    const FUNCTION_NAME = results[0].FUNCTION_NAME;
    const NOM = results[0].NOM;
    const PATHURL = results[0].PATHURL;

    // Définissez le modèle BPMN de base
    const baseBpmn = `<?xml version="1.0" encoding="UTF-8"?>
      <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                        xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                        xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                        xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                        xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
                        id="Definitions_1">
        <bpmn:process id="Process_1" isExecutable="false">
          <bpmn:startEvent id="StartEvent_1" name="Start"/>
          <bpmn:task id="Task_1" name="${FUNCTION_NAME}"/>
          <bpmn:task id="Task_2" name="${NOM}"/>
          <bpmn:task id="Task_3" name="${PATHURL}"/>
          <bpmn:exclusiveGateway id="Gateway_1" name="ISASYNC?"/>
          <bpmn:endEvent id="EndEvent_1" name="${isAsync}">
            <bpmn:terminateEventDefinition/>
          </bpmn:endEvent>
          <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1"/>
          <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="Task_2"/>
          <bpmn:sequenceFlow id="Flow_3" sourceRef="Task_2" targetRef="Task_3"/>
          <bpmn:sequenceFlow id="Flow_4" sourceRef="Task_3" targetRef="Gateway_1"/>
          <bpmn:sequenceFlow id="Flow_5" sourceRef="Gateway_1" targetRef="EndEvent_1">
            <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">\${m.ISASYNC == 0}</bpmn:conditionExpression>
          </bpmn:sequenceFlow>
          <bpmn:sequenceFlow id="Flow_6" sourceRef="Gateway_1" targetRef="EndEvent_2">
            <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">\${m.ISASYNC == 1}</bpmn:conditionExpression>
          </bpmn:sequenceFlow>
        </bpmn:process>
        <bpmndi:BPMNDiagram id="BPMNDiagram_1">
          <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
            <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
              <dc:Bounds x="173" y="102" width="36" height="36"/>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="Task_1_di" bpmnElement="Task_1">
              <dc:Bounds x="259" y="80" width="100" height="80"/>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="Task_2_di" bpmnElement="Task_2">
              <dc:Bounds x="409" y="80" width="100" height="80"/>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="Task_3_di" bpmnElement="Task_3">
              <dc:Bounds x="559" y="80" width="100" height="80"/>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="Gateway_1_di" bpmnElement="Gateway_1">
              <dc:Bounds x="709" y="95" width="50" height="50"/>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
              <dc:Bounds x="849" y="102" width="36" height="36"/>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="EndEvent_2_di" bpmnElement="EndEvent_2">
              <dc:Bounds x="849" y="202" width="36" height="36"/>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
              <di:waypoint x="209" y="120"/>
              <di:waypoint x="259" y="120"/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
              <di:waypoint x="359" y="120"/>
              <di:waypoint x="409" y="120"/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge id="Flow_3_di" bpmnElement="Flow_3">
              <di:waypoint x="509" y="120"/>
              <di:waypoint x="559" y="120"/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge id="Flow_4_di" bpmnElement="Flow_4">
              <di:waypoint x="659" y="120"/>
              <di:waypoint x="709" y="120"/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge id="Flow_5_di" bpmnElement="Flow_5">
              <di:waypoint x="759" y="120"/>
              <di:waypoint x="849" y="120"/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge id="Flow_6_di" bpmnElement="Flow_6">
              <di:waypoint x="759" y="120"/>
              <di:waypoint x="759" y="220"/>
              <di:waypoint x="849" y="220"/>
            </bpmndi:BPMNEdge>
          </bpmndi:BPMNPlane>
        </bpmndi:BPMNDiagram>
      </bpmn:definitions>`;

    res.send(baseBpmn);
  });
});


module.exports = router;

 