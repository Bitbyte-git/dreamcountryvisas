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

  await ensureDomainColumn();

  console.log(`🗄️  MySQL ready — database "${DB_NAME}" @ ${DB_HOST}:${DB_PORT}`);
}

// Which site the enquiry came from (dreamcountryvisas.com vs .in). Added after
// the table already existed in production, so it's migrated in place. The app
// DB user may lack ALTER — then submissions keep working without the column
// and the log says how to add it once.
export const schema = { hasDomain: false };

async function ensureDomainColumn() {
  const [cols] = await pool.query(`SHOW COLUMNS FROM submissions LIKE 'domain'`);
  if (cols.length) {
    schema.hasDomain = true;
    return;
  }
  try {
    await pool.query(`ALTER TABLE submissions ADD COLUMN domain VARCHAR(100) NULL AFTER source`);
    schema.hasDomain = true;
    console.log('🗄️  Added "domain" column to submissions');
  } catch (err) {
    console.warn(
      `⚠️  Could not add the "domain" column (${err.code || err.message}). ` +
        'Run once as a MySQL admin: ALTER TABLE submissions ADD COLUMN domain VARCHAR(100) NULL AFTER source; — then restart the server.'
    );
  }
}

init().catch((err) => console.error('❌ MySQL init failed:', err.message));
