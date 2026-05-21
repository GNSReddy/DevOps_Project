const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

// Database stored in ./database/tasks.db for Docker volume mounting later
const dbPath = path.join(__dirname, 'database', 'tasks.db');
const db = new Database(dbPath);

// WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// Ensure tables exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    priority TEXT DEFAULT 'MEDIUM',
    status TEXT DEFAULT 'TODO',
    due_date TEXT,
    completed INTEGER DEFAULT 0,
    user_id INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

module.exports = db;
