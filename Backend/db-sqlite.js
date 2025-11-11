// db-sqlite.js
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const path = require("path");

async function openDb() {
  const db = await open({
    filename: path.join(__dirname, "database.sqlite"),
    driver: sqlite3.Database
  });

  // Criação das tabelas se não existirem
  await db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      tipo TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projetos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      localizacao TEXT,
      meta REAL,
      categoria TEXT,
      totalArrecadado REAL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS doacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projeto_id INTEGER,
      nome_doador TEXT,
      email TEXT,
      valor REAL,
      data_doacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (projeto_id) REFERENCES projetos(id)
    );
  `);

  console.log("✅ Banco de dados SQLite inicializado com sucesso!");
  return db;
}

module.exports = { openDb };
