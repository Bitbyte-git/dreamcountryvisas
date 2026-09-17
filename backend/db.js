// MySQL connection pool + one-time schema setup.
import mysql from 'mysql2/promise';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'dc';

export const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// No top-level await here — Hostinger's Node hosting requires this module via
// require(), which errors (ERR_REQUIRE_ASYNC_MODULE) on an ESM graph that uses
// top-level await. Provisioning runs async instead; errors are logged, not thrown.
async function init() {
  // First connect without a database selected, so we can create it if missing.
  const bootstrap = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
  });

  await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await bootstrap.end();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      source VARCHAR(40) NOT NULL,
      program VARCHAR(255),
      english_level VARCHAR(60),
      salutation VARCHAR(10),
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      phone_code VARCHAR(10),
      phone VARCHAR(30),
      email VARCHAR(190),
      nationality VARCHAR(100),
      residence VARCHAR(100),
      updates_opt_in TINYINT(1) DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_created_at (created_at)
    )
  `);

  console.log(`🗄️  MySQL ready — database "${DB_NAME}" @ ${DB_HOST}:${DB_PORT}`);
}

init().catch((err) => console.error('❌ MySQL init failed:', err.message));
