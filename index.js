// Importa Express para crear el servidor
const express = require('express');

// Importa CORS para permitir peticiones desde otros orígenes (por ejemplo, el frontend)
const cors = require('cors');

// Importa las rutas definidas para productos
const productosRoutes = require('./routes/productosRoutes.js');

// Importa la instancia de conexión Sequelize a la base de datos
const sequelize = require('./db');

// Crea una aplicación de Express
const app = express();

// Middleware para permitir solicitudes desde otros dominios (evita errores de CORS)
app.use(cors());

// Middleware para poder recibir y procesar datos en formato JSON en las solicitudes
app.use(express.json());

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente' });
});

// Asigna el enrutador de productos bajo la ruta base /api/productos
app.use('/api/productos', productosRoutes);

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

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Backend corriendo en http://localhost:${PORT}`);
  });
}

// Exportar la app para Vercel
module.exports = app;