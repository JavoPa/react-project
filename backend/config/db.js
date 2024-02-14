const mysql = require('mysql2');
const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = require('./env.js');
require('dotenv').config();

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME
});

pool.getConnection((err, connection) => {
  if(err) {
    console.error("Something went wrong connecting to the database ...");
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error("Database connection was closed.")
    }
    if(err.code === 'ER_CON_COUNT_ERROR') {
      console.error("Database has too many connections.")
    }
    if(err.code === 'ECONNREFUSED') {
      console.error("Database connection was refused.")
    }
  }

  if(connection) {
    connection.release();
  }
});

const promisePool = pool.promise();

async function setupDB() {
  try {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to the database');
        process.exit(1); // Exit the process with a failure code
      } else {
        console.log('Connected to the database');
        connection.release();
      }
    });
  } catch (err) {
    console.error(err);
  }
}

module.exports = {setupDB, promisePool};