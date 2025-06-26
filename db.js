const { Sequelize } = require('sequelize');

// Configuración para producción (Vercel) vs desarrollo
let sequelize;

try {
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    // Configuración para Vercel - base de datos en memoria
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:', 
      logging: false,
      dialectModule: require('better-sqlite3'),
      define: {
        timestamps: false // Desactivar timestamps automáticos para simplificar
      }
    });
  } else {
    // Configuración para desarrollo local
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: './database.sqlite',
      logging: console.log
    });
  }
} catch (error) {
  console.error('Error al configurar Sequelize:', error);
  throw error;
}

module.exports = sequelize;