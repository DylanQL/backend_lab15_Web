// Importa Express para crear el servidor
const express = require('express');

// Importa CORS para permitir peticiones desde otros orígenes (por ejemplo, el frontend)
const cors = require('cors');

// Crea una aplicación de Express
const app = express();

// Middleware para permitir solicitudes desde otros dominios (evita errores de CORS)
app.use(cors());

// Middleware para poder recibir y procesar datos en formato JSON en las solicitudes
app.use(express.json());

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// Importa y configura las rutas de productos (solo si no hay errores)
try {
  const productosRoutes = require('./routes/productosRoutes.js');
  
  // Asigna el enrutador de productos bajo la ruta base /api/productos
  app.use('/api/productos', productosRoutes);
  
  // Inicializar la base de datos solo si las rutas se cargan correctamente
  const sequelize = require('./db');
  
  // Función para inicializar la base de datos
  async function initDatabase() {
    try {
      await sequelize.sync();
      console.log('Base de datos sincronizada');
    } catch (err) {
      console.error('Error al sincronizar base de datos:', err);
    }
  }
  
  // Inicializar la base de datos
  initDatabase();
  
} catch (err) {
  console.error('Error al cargar rutas o base de datos:', err);
  
  // Ruta de error para debug
  app.get('/debug', (req, res) => {
    res.json({ 
      error: 'Failed to load routes or database',
      message: err.message,
      stack: err.stack 
    });
  });
}

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Backend corriendo en http://localhost:${PORT}`);
  });
}

// Exportar la app para Vercel
module.exports = app;