const express = require("express");
const { openDb } = require("../db-sqlite");
const jwt = require("jsonwebtoken");

const router = express.Router();

let db;
openDb().then(database => {
  db = database;
  console.log("✅ Projects routes connected to database");
});

// Middleware to verify JWT token (optional for projects listing)
const verifyTokenOptional = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "segredo");
      req.user = decoded;
    } catch (error) {
      // Token is invalid but we still allow access to projects
      console.log("⚠️ Invalid token, but allowing project access");
    }
  }
  next();
};

// Middleware to require authentication
const verifyTokenRequired = (req, res, next) => {
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

// 🔹 Obter todos os projetos (authentication optional)
router.get("/", verifyTokenOptional, async (req, res) => {
  try {
    console.log("📊 Fetching projects, user:", req.user ? req.user.id : 'anonymous');
    
    const projects = await db.all(`
      SELECT p.*, 
             COUNT(d.id) as doadores,
             COALESCE(SUM(d.valor), 0) as arrecadado
      FROM projetos p
      LEFT JOIN doacoes d ON p.id = d.projeto_id
      GROUP BY p.id
      ORDER BY p.id DESC
    `);
    
    // Map fields to match frontend expectations
    const mappedProjects = projects.map(project => ({
      id: project.id,
      nome: project.nome,
      descricao: project.descricao,
      localizacao: project.localizacao,
      meta: project.meta,
      arrecadado: project.arrecadado || project.totalArrecadado || 0,
      categoria: project.categoria,
      doadores: project.doadores || 0
    }));
    
    console.log(`✅ Returning ${mappedProjects.length} projects to frontend`);
    res.json(mappedProjects);
  } catch (err) {
    console.error("❌ Erro ao buscar projetos:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Adicionar um novo projeto (requires authentication)
router.post("/", verifyTokenRequired, async (req, res) => {
  try {
    const { nome, descricao, localizacao, meta, categoria } = req.body;

    // Get user info from token
    const user = await db.get("SELECT * FROM usuarios WHERE id = ?", [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

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
router.put("/:id/arrecadacao", verifyTokenRequired, async (req, res) => {
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