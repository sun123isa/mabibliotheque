require('dotenv').config();
const { Pool } = require('pg');

// Connexion propre à Supabase en utilisant la variable unique DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Obligatoire pour se connecter aux bases cloud depuis l'extérieur
  }
});


/* const {Pool }  = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});
 */
module.exports = pool;