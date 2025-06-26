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

// Base de datos en memoria (array)
let productos = [
  {
    codProducto: 1,
    nomPro: "Producto de prueba",
    precioProducto: 29.99,
    stockProducto: 10
  }
];

let nextId = 2;

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    totalProductos: productos.length
  });
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// RUTAS DE PRODUCTOS

// GET /api/productos - Obtener todos los productos
app.get('/api/productos', (req, res) => {
  res.json(productos);
});

// GET /api/productos/:id - Obtener un producto por ID
app.get('/api/productos/:codProducto', (req, res) => {
  const id = parseInt(req.params.codProducto);
  const producto = productos.find(p => p.codProducto === id);
  
  if (!producto) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }
  
  res.json(producto);
});

// POST /api/productos - Crear un nuevo producto
app.post('/api/productos', (req, res) => {
  try {
    const { nomPro, precioProducto, stockProducto } = req.body;
    
    if (!nomPro || precioProducto === undefined || stockProducto === undefined) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos: nomPro, precioProducto, stockProducto' 
      });
    }
    
    const nuevoProducto = {
      codProducto: nextId++,
      nomPro,
      precioProducto: parseFloat(precioProducto),
      stockProducto: parseInt(stockProducto)
    };
    
    productos.push(nuevoProducto);
    
    res.status(201).json(nuevoProducto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/productos/:id - Actualizar un producto
app.put('/api/productos/:codProducto', (req, res) => {
  try {
    const id = parseInt(req.params.codProducto);
    const productoIndex = productos.findIndex(p => p.codProducto === id);
    
    if (productoIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    const { nomPro, precioProducto, stockProducto } = req.body;
    
    if (nomPro !== undefined) productos[productoIndex].nomPro = nomPro;
    if (precioProducto !== undefined) productos[productoIndex].precioProducto = parseFloat(precioProducto);
    if (stockProducto !== undefined) productos[productoIndex].stockProducto = parseInt(stockProducto);
    
    res.json(productos[productoIndex]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/productos/:id - Eliminar un producto
app.delete('/api/productos/:codProducto', (req, res) => {
  try {
    const id = parseInt(req.params.codProducto);
    const productoIndex = productos.findIndex(p => p.codProducto === id);
    
    if (productoIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    const productoEliminado = productos.splice(productoIndex, 1)[0];
    res.json({ message: 'Producto eliminado', producto: productoEliminado });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Backend corriendo en http://localhost:${PORT}`);
  });
}

// Exportar la app para Vercel
module.exports = app;
