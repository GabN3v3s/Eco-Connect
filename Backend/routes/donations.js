
const express = require("express");
const db = require("../db");

const router = express.Router();

// Registrar doação
router.post("/", (req, res) => {
  const { projeto_id, nome, email, valor } = req.body;

  // Registrar doação
  db.query(
    "INSERT INTO doacoes (projeto_id, nome, email, valor) VALUES (?, ?, ?, ?)",
    [projeto_id, nome, email, valor],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      // Atualizar total arrecadado do projeto
      db.query(
        "UPDATE projetos SET arrecadado = arrecadado + ? WHERE id = ?",
        [valor, projeto_id],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2 });
          res.json({ message: "Doação registrada com sucesso!" });
        }
      );
    }
  );
});

module.exports = router;
