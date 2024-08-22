// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// module.exports = {
//   query: (text, params) => pool.query(text, params),
// };


// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// // Test the connection
// pool.query('SELECT NOW()', (err, res) => {
//   if (err) {
//     console.error("Error connecting to the database", err);
//   } else {
//     console.log("Successfully connected to the database");
//   }
// });

// module.exports = {
//   query: (text, params) => pool.query(text, params),
// };


const { Pool } = require("pg")

const pool = new Pool({
  // Format: postgres://user:password@host:5432/database
  connectionString: process.env.DB_URL,
});

if (process.env.NODE_ENV === 'production') {
  pool.ssl = { rejectUnauthorized: false }
}


module.exports = pool;