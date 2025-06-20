const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// garante que o banco fique sempre em data.db na raiz do projeto
const dbPath = path.join(__dirname, 'data.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // só cria se não existir — NÃO DESTRÓI a tabela em cada start
  db.run(`
    CREATE TABLE IF NOT EXISTS evaluations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      consent INTEGER NOT NULL,
      phone TEXT,
      rating INTEGER NOT NULL,
      comment TEXT
    );
  `);
});

module.exports = db;
