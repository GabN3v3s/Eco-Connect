const express = require("express");
const initializeDatabase = require("../db-sqlite");

const router = express.Router();

// Initialize database connection
let db;
initializeDatabase().then(database => {
  db = database;
  console.log('✅ Projects routes connected to database');
});

// Listar todos os projetos
router.get("/", async (req, res) => {
  try {
    const projects = await db.all("SELECT * FROM projetos");
    res.json(projects);
  } catch (err) {
    console.error("Erro ao buscar projetos:", err);
    res.status(500).json({ error: err.message });
  }
});

// Criar novo projeto
router.post("/", async (req, res) => {
  try {
    const { nome, descricao, localizacao, meta, categoria } = req.body;

    const result = await db.run(
      "INSERT INTO projetos (nome, descricao, localizacao, meta, categoria, arrecadado) VALUES (?, ?, ?, ?, ?, 0)",
      [nome, descricao, localizacao, meta, categoria]
    );
    
    res.json({ message: "Projeto cadastrado com sucesso!" });
  } catch (err) {
    console.error("Erro ao criar projeto:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;