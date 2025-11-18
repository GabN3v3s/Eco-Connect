const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { openDb } = require("../db-sqlite");

const router = express.Router();

// Inicializa a conexão com o banco
let db;
openDb().then(database => {
  db = database;
  console.log("✅ Auth routes connected to database");
});

// Cadastro
router.post("/register", async (req, res) => {
  try {
    console.log("📝 Registration attempt:", req.body);
    
    const { nome, email, senha, tipo } = req.body;
    
    // Validate required fields
    if (!nome || !email || !senha || !tipo) {
      return res.status(400).json({ 
        error: "Todos os campos são obrigatórios: nome, email, senha, tipo" 
      });
    }

    // Check if user already exists
    const existingUser = await db.get("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (existingUser) {
      return res.status(409).json({ 
        error: "Email já cadastrado" 
      });
    }

    // Use bcrypt with async/await
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    const result = await db.run(
      "INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)",
      [nome, email, hashedPassword, tipo]
    );

    console.log("✅ User registered successfully:", result);

    res.json({ 
      message: "Usuário cadastrado com sucesso!",
      user: {
        id: result.lastID,
        nome,
        email,
        tipo
      }
    });
  } catch (err) {
    console.error("❌ Erro no cadastro:", err);
    res.status(500).json({ 
      error: "Erro interno do servidor",
      details: err.message 
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validate required fields
    if (!email || !senha) {
      return res.status(400).json({ 
        error: "Email e senha são obrigatórios" 
      });
    }

    const user = await db.get("SELECT * FROM usuarios WHERE email = ?", [email]);

    if (!user) {
      return res.status(404).json({ 
        error: "Usuário não encontrado" 
      });
    }

    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword) {
      return res.status(401).json({ 
        error: "Senha inválida" 
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "segredo",
      { expiresIn: "1h" }
    );

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
    console.error("❌ Erro no login:", err);
    res.status(500).json({ 
      error: "Erro interno do servidor",
      details: err.message 
    });
  }
});

module.exports = router;