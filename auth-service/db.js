const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

// Resolves to backend/database/tasks.db from auth-service directory
// In Docker, override DATABASE_PATH in .env to shared volume path
const dbPath = path.resolve(__dirname, process.env.DATABASE_PATH || '../backend/database/tasks.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

// Ensure users table exists (safe if already created by backend)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

module.exports = db;
