const express = require("express");
const { openDb } = require("../db-sqlite");
const jwt = require("jsonwebtoken");

const router = express.Router();

let db;
openDb().then(database => {
  db = database;
  console.log("✅ Donations routes connected to database");
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Token de acesso necessário" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "segredo");
    console.log("🔓 Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ Token verification failed:", error);
    return res.status(401).json({ error: "Token inválido" });
  }
};

// Debug endpoint to check user data
router.get("/debug-user/:id", async (req, res) => {
  try {
    console.log("🔍 Debugging user ID:", req.params.id);
    const user = await db.get("SELECT * FROM usuarios WHERE id = ?", [req.params.id]);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    console.log("✅ User found:", user);
    res.json({
      user: user,
      tableInfo: {
        columns: Object.keys(user),
        hasNome: 'nome' in user,
        nomeValue: user.nome
      }
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Registrar nova doação (requer autenticação)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { projeto_id, valor } = req.body;

    console.log("💰 Processing donation request:", { 
      user: req.user, 
      projeto_id, 
      valor 
    });

    // Validate donation amount
    if (!valor || valor <= 0) {
      return res.status(400).json({ error: "Valor da doação deve ser maior que zero" });
    }

    // Debug: Check what's in req.user
    console.log("🔍 req.user contents:", req.user);
    console.log("🔍 req.user.id:", req.user?.id);
    console.log("🔍 req.user.nome:", req.user?.nome);

    // If req.user doesn't have id, try to get it from the database using email
    let user;
    if (req.user.id) {
      user = await db.get("SELECT id, nome, email FROM usuarios WHERE id = ?", [req.user.id]);
    } else if (req.user.email) {
      user = await db.get("SELECT id, nome, email FROM usuarios WHERE email = ?", [req.user.email]);
      console.log("🔍 Found user by email:", user);
    }
    
    if (!user) {
      console.log("❌ User not found in database");
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    console.log("✅ User found:", user);

    // Check if nome exists and has a value
    if (!user.nome) {
      console.log("❌ User name is null/undefined, using fallback");
      user.nome = "Doador"; // Fallback name
    }

    console.log("✅ Using user name:", user.nome);

    // Get project data
    const project = await db.get("SELECT * FROM projetos WHERE id = ?", [projeto_id]);
    if (!project) {
      return res.status(404).json({ error: "Projeto não encontrado" });
    }

    console.log("✅ Project found:", project.nome);

    // Insert donation using complete user data
    const result = await db.run(
      "INSERT INTO doacoes (projeto_id, nome_doador, email, valor) VALUES (?, ?, ?, ?)",
      [projeto_id, user.nome, user.email, valor]
    );

    console.log("✅ Donation inserted with ID:", result.lastID);

    // Update project's total collected
    await db.run(
      "UPDATE projetos SET totalArrecadado = COALESCE(totalArrecadado, 0) + ? WHERE id = ?",
      [valor, projeto_id]
    );

    console.log("✅ Project total updated");

    // Return success response
    res.json({ 
      success: true,
      message: "Doação registrada com sucesso!",
      donation: {
        id: result.lastID,
        projeto_nome: project.nome,
        projeto_localizacao: project.localizacao,
        projeto_categoria: project.categoria,
        valor: valor,
        data_doacao: new Date().toISOString()
      }
    });

    console.log("✅ Donation completed successfully");

  } catch (err) {
    console.error("❌ Erro ao registrar doação:", err);
    res.status(500).json({ 
      success: false,
      error: "Erro interno do servidor: " + err.message 
    });
  }
});

// 🔹 Listar doações do usuário logado
router.get("/my-donations", verifyToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    
    console.log("📋 Fetching donations for user:", userEmail);
    
    const donations = await db.all(`
      SELECT d.id, d.valor, d.data_doacao, p.nome as projeto_nome, 
             p.localizacao as projeto_localizacao, p.categoria as projeto_categoria
      FROM doacoes d
      JOIN projetos p ON d.projeto_id = p.id
      WHERE d.email = ?
      ORDER BY d.data_doacao DESC
    `, [userEmail]);

    console.log(`✅ Found ${donations.length} donations for user`);
    res.json(donations);
  } catch (err) {
    console.error("❌ Erro ao buscar doações do usuário:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Listar todas as doações (apenas para transparência)
router.get("/", async (req, res) => {
  try {
    const donations = await db.all(`
      SELECT d.id, d.nome_doador, d.email, d.valor, d.data_doacao, p.nome AS projeto_nome,
             p.localizacao as projeto_localizacao, p.categoria as projeto_categoria
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

// Debug endpoint to check current token
router.get("/debug-token", verifyToken, async (req, res) => {
  try {
    console.log("🔍 Debugging token data:", req.user);
    
    // Get fresh user data from database
    const freshUser = await db.get("SELECT * FROM usuarios WHERE id = ?", [req.user.id]);
    
    res.json({
      tokenData: req.user,
      freshUserData: freshUser,
      comparison: {
        tokenId: req.user.id,
        tokenNome: req.user.nome,
        dbId: freshUser?.id,
        dbNome: freshUser?.nome
      }
    });
  } catch (error) {
    console.error("Token debug error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;