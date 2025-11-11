const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const donationRoutes = require("./routes/donations");

const app = express();
app.use(cors());
app.use(express.json());

// Simple middleware to log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/donations", donationRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    database: "SQLite",
    timestamp: new Date().toISOString(),
    message: "EcoConnect API is running"
  });
});

app.get("/api/test-projects", async (req, res) => {
  try {
    const { openDb } = require("./db-sqlite");
    const db = await openDb();
    const projects = await db.all("SELECT * FROM projetos");
    res.json(projects);
  } catch (error) {
    console.error("❌ Erro ao testar conexão com projetos:", error);
    res.status(500).json({ error: error.message });
  }
});

const path = require("path");

// Servir os arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, "../Frontend")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Using SQLite database`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Test projects: http://localhost:${PORT}/api/test-projects`);
});
