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

// Serve the main page for root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});

// SPA fallback - handle all other non-API routes
app.use((req, res, next) => {
  // Only handle GET requests that aren't API routes and haven't been handled by static files
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, "../Frontend/index.html"));
  } else {
    // For API routes that don't exist, return 404
    if (req.path.startsWith('/api/')) {
      res.status(404).json({ error: 'API route not found' });
    } else {
      next();
    }
  }
});

// Debug endpoint to check user data
app.get("/api/debug-user/:id", async (req, res) => {
  try {
    const { openDb } = require("./db-sqlite");
    const db = await openDb();
    const user = await db.get("SELECT * FROM usuarios WHERE id = ?", [req.params.id]);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({
      user: user,
      tableInfo: {
        columns: Object.keys(user)
      }
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Using SQLite database`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Projects: http://localhost:${PORT}/api/projects`);
  console.log(`🌍 Frontend: http://localhost:${PORT}`);
});