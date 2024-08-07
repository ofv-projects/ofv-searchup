const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const path = require('path');  // Modul zum Arbeiten mit Dateipfaden

const app = express();
const port = 3000;

// CORS aktivieren
app.use(cors());

// Eingebaute Middleware zum Parsen von JSON- und URL-kodierten Anfragen
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statische Dateien aus dem öffentlichen Ordner bereitstellen
app.use(express.static(path.join(__dirname, 'public'))); 

// Konfiguration für multer (Datei-Upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/uploads/'));  // Sicherer Pfad
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); 
  }
});

const upload = multer({ storage: storage });

// Hilfsfunktionen zum Lesen und Schreiben von JSON-Dateien
function readJSON(filename) {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data', filename), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Fehler beim Lesen der JSON-Datei:', error);
    return []; // Leeres Array zurückgeben, falls ein Fehler auftritt
  }
}

function writeJSON(filename, data) {
  fs.writeFileSync(path.join(__dirname, 'data', filename), JSON.stringify(data, null, 2));
}

// API-Endpunkte

app.get('/versions', (req, res) => {
  const partNumber = req.query.partNumber;
  const versions = readJSON('versions.json');
  const matchingVersions = versions.filter(version => version.partNumbers.includes(partNumber));
  res.json(matchingVersions);
});

app.post('/versions', upload.single('file'), (req, res) => {
  try {
    const { versionNumber, partNumbers } = req.body;
    const filename = req.file ? req.file.originalname : null;

    if (!filename) {
      return res.status(400).json({ error: 'Keine Datei hochgeladen' });
    }

    const versions = readJSON('versions.json');
    const newVersion = {
      id: versions.length + 1,
      versionNumber,
      filename,
      partNumbers: partNumbers.split(',')
    };
    versions.push(newVersion);
    writeJSON('versions.json', versions);

    res.json({ message: 'Version erfolgreich hochgeladen' });
  } catch (error) {
    console.error('Fehler beim Hochladen:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

app.get('/parts', (req, res) => {
  const parts = readJSON('parts.json');
  res.json(parts);
});

// Server starten
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
