// db-sqlite.js
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const path = require("path");

async function openDb() {
  const db = await open({
    filename: path.join(__dirname, "database.sqlite"),
    driver: sqlite3.Database
  });

  console.log("✅ Banco de dados SQLite inicializado com sucesso!");
  return db;
}

module.exports = { openDb };
