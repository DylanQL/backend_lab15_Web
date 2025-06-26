const { Sequelize } = require('sequelize');

// Configuración para producción (Vercel) vs desarrollo
const sequelize = process.env.NODE_ENV === 'production' 
  ? new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:', // Base de datos en memoria para Vercel
      logging: false
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: './database.sqlite'
    });

module.exports = sequelize;