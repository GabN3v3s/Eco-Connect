const express = require("express");
const { openDb } = require("../db-sqlite");

const router = express.Router();

let db;
openDb().then(database => {
  db = database;
  console.log("✅ Donations routes connected to database");
});

// 🔹 Registrar nova doação
router.post("/", async (req, res) => {
  try {
    const { projeto_id, nome_doador, email, valor } = req.body;

    await db.run(
      "INSERT INTO doacoes (projeto_id, nome_doador, email, valor) VALUES (?, ?, ?, ?)",
      [projeto_id, nome_doador, email, valor]
    );

    // Atualiza o total arrecadado no projeto
    await db.run(
      "UPDATE projetos SET totalArrecadado = totalArrecadado + ? WHERE id = ?",
      [valor, projeto_id]
    );

    res.json({ message: "Doação registrada com sucesso!" });
  } catch (err) {
    console.error("❌ Erro ao registrar doação:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Listar todas as doações
router.get("/", async (req, res) => {
  try {
    const donations = await db.all(`
      SELECT d.id, d.nome_doador, d.email, d.valor, d.data_doacao, p.nome AS projeto_nome
      FROM doacoes d
      JOIN projetos p ON d.projeto_id = p.id
      ORDER BY d.data_doacao DESC
    `);
    res.json(donations);
  } catch (err) {
    console.error("❌ Erro ao buscar doações:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
