
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

// Cadastro
router.post("/register", (req, res) => {
  const { nome, email, senha, tipo } = req.body;
  const hashedPassword = bcrypt.hashSync(senha, 8);

  db.query(
    "INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)",
    [nome, email, hashedPassword, tipo],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Usuário cadastrado com sucesso!" });
    }
  );
});

// Login
router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: "Usuário não encontrado" });

    const user = results[0];
    const validPassword = bcrypt.compareSync(senha, user.senha);

    if (!validPassword) return res.status(401).json({ message: "Senha inválida" });

    const token = jwt.sign({ id: user.id, email: user.email }, "segredo", { expiresIn: "1h" });
    res.json({ message: "Login realizado com sucesso!", token });
  });
});

module.exports = router;
