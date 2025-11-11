const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const initializeDatabase = require("../db-sqlite");

const router = express.Router();

// Initialize database connection
let db;
initializeDatabase().then(database => {
  db = database;
  console.log('✅ Auth routes connected to database');
});

// Cadastro
router.post("/register", async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;
    const hashedPassword = bcrypt.hashSync(senha, 8);

    const result = await db.run(
      "INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)",
      [nome, email, hashedPassword, tipo]
    );
    
    res.json({ message: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    console.error("Erro no cadastro:", err);
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await db.get("SELECT * FROM usuarios WHERE email = ?", [email]);
    
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const validPassword = bcrypt.compareSync(senha, user.senha);

    if (!validPassword) {
      return res.status(401).json({ message: "Senha inválida" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "segredo", { expiresIn: "1h" });
    res.json({ 
      message: "Login realizado com sucesso!", 
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo
      }
    });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;