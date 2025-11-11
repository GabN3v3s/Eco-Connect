const express = require("express");
const { openDb } = require("../db-sqlite");

const router = express.Router();

let db;
openDb().then(database => {
  db = database;
  console.log("✅ Projects routes connected to database");
});

// 🔹 Obter todos os projetos
router.get("/", async (req, res) => {
  try {
    const projects = await db.all("SELECT * FROM projetos");
    res.json(projects);
  } catch (err) {
    console.error("❌ Erro ao buscar projetos:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Adicionar um novo projeto
router.post("/", async (req, res) => {
  try {
    const { nome, descricao, localizacao, meta, categoria } = req.body;

    await db.run(
      "INSERT INTO projetos (nome, descricao, localizacao, meta, categoria, totalArrecadado) VALUES (?, ?, ?, ?, ?, 0)",
      [nome, descricao, localizacao, meta, categoria]
    );

    res.json({ message: "Projeto cadastrado com sucesso!" });
  } catch (err) {
    console.error("❌ Erro ao cadastrar projeto:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Atualizar total arrecadado (após doação)
router.put("/:id/arrecadacao", async (req, res) => {
  try {
    const { id } = req.params;
    const { valor } = req.body;

    await db.run(
      "UPDATE projetos SET totalArrecadado = totalArrecadado + ? WHERE id = ?",
      [valor, id]
    );

    res.json({ message: "Arrecadação atualizada com sucesso!" });
  } catch (err) {
    console.error("❌ Erro ao atualizar arrecadação:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
