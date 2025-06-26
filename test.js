// Archivo de prueba mínimo para Vercel
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend Test - Funcionando!',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform
  });
});

app.get('/test', (req, res) => {
  res.json({ test: 'OK' });
});

module.exports = app;
