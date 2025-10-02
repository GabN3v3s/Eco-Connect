
const express = require("express");
const db = require("../db");

const router = express.Router();

//Listar todos os projetos
router.get("/", (req, res) => {
  db.query("SELECT * FROM projetos", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Criar novo projeto
router.post("/", (req, res) => {
  const { nome, descricao, localizacao, meta, categoria } = req.body;

  db.query(
    "INSERT INTO projetos (nome, descricao, localizacao, meta, categoria, arrecadado) VALUES (?, ?, ?, ?, ?, 0)",
    [nome, descricao, localizacao, meta, categoria],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Projeto cadastrado com sucesso!" });
    }
  );
});

module.exports = router;
