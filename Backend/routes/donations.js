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
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

// 🔹 Registrar nova doação (requer autenticação)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { projeto_id, valor } = req.body;
    const user_id = req.user.id;

    // Validate donation amount
    if (!valor || valor <= 0) {
      return res.status(400).json({ error: "Valor da doação deve ser maior que zero" });
    }

    // Get user data
    const user = await db.get("SELECT * FROM usuarios WHERE id = ?", [user_id]);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Get project data
    const project = await db.get("SELECT * FROM projetos WHERE id = ?", [projeto_id]);
    if (!project) {
      return res.status(404).json({ error: "Projeto não encontrado" });
    }

    // Check if project is still active
    if (project.istatus !== 'ativo') {
      return res.status(400).json({ error: "Este projeto não está mais aceitando doações" });
    }

    // Insert donation
    const result = await db.run(
      "INSERT INTO doacoes (projeto_id, nome_doador, email, valor) VALUES (?, ?, ?, ?)",
      [projeto_id, user.nome, user.email, valor]
    );

    // Update project's total collected
    await db.run(
      "UPDATE projetos SET totalArrecadado = totalArrecadado + ? WHERE id = ?",
      [valor, projeto_id]
    );

    // Get updated project data
    const updatedProject = await db.get("SELECT * FROM projetos WHERE id = ?", [projeto_id]);

    res.json({ 
      message: "Doação registrada com sucesso!",
      donation: {
        id: result.lastID,
        projeto_nome: project.nome,
        projeto_localizacao: project.localizacao,
        projeto_categoria: project.categoria,
        valor: valor,
        data_doacao: new Date().toISOString(),
        novo_total_arrecadado: updatedProject.totalArrecadado
      }
    });
  } catch (err) {
    console.error("❌ Erro ao registrar doação:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Listar doações do usuário logado
router.get("/my-donations", verifyToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const user = await db.get("SELECT * FROM usuarios WHERE id = ?", [user_id]);
    
    const donations = await db.all(`
      SELECT d.id, d.valor, d.data_doacao, p.nome as projeto_nome, 
             p.localizacao as projeto_localizacao, p.categoria as projeto_categoria
      FROM doacoes d
      JOIN projetos p ON d.projeto_id = p.id
      WHERE d.email = ?
      ORDER BY d.data_doacao DESC
    `, [user.email]);

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

// 🔹 Estatísticas de doações
router.get("/stats", verifyToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const user = await db.get("SELECT * FROM usuarios WHERE id = ?", [user_id]);
    
    const stats = await db.get(`
      SELECT 
        COUNT(*) as total_doacoes,
        SUM(valor) as total_doado,
        AVG(valor) as media_doacao,
        MAX(valor) as maior_doacao,
        MIN(valor) as menor_doacao
      FROM doacoes 
      WHERE email = ?
    `, [user.email]);

    res.json(stats);
  } catch (err) {
    console.error("❌ Erro ao buscar estatísticas:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;