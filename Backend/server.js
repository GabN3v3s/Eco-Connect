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

// Test endpoint to check projects
app.get("/api/test-projects", async (req, res) => {
  try {
    const initializeDatabase = require("./db-sqlite");
    const db = await initializeDatabase();
    const projects = await db.all("SELECT * FROM projetos");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Using SQLite database`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Test projects: http://localhost:${PORT}/api/test-projects`);
});
