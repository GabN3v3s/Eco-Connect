const express = require("express");
const initializeDatabase = require("../db-sqlite");

const router = express.Router();

// Initialize database connection
let db;
initializeDatabase().then(database => {
  db = database;
  console.log('✅ Donations routes connected to database');
});

// Registrar doação
router.post("/", async (req, res) => {
  try {
    const { projeto_id, nome, email, valor } = req.body;

    // For SQLite, we'll simulate the donor_id since we don't have proper user auth yet
    const donor = await db.get("SELECT id FROM usuarios WHERE email = ?", [email]);
    let donor_id = donor ? donor.id : null;

    if (!donor_id) {
      // Create a temporary donor record
      const newDonor = await db.run(
        "INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)",
        [nome, email, 'temp', 'doador']
      );
      donor_id = newDonor.lastID;
    }

    // Registrar doação
    await db.run(
      "INSERT INTO doacoes (projeto_id, doador_id, valor) VALUES (?, ?, ?)",
      [projeto_id, donor_id, valor]
    );

    // Atualizar total arrecadado do projeto
    await db.run(
      "UPDATE projetos SET arrecadado = arrecadado + ? WHERE id = ?",
      [valor, projeto_id]
    );
    
    res.json({ message: "Doação registrada com sucesso!" });
  } catch (err) {
    console.error("Erro ao registrar doação:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;