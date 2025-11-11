const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

// Use a simple SQLite connection without MySQL fallback
async function initializeDatabase() {
  try {
    const db = await open({
      filename: path.join(__dirname, 'doacoes_ambientais.db'),
      driver: sqlite3.Database
    });

    console.log('✅ Connected to SQLite database');

    // Create tables
    await db.exec(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        tipo TEXT CHECK(tipo IN ('doador', 'organizacao')) NOT NULL,
        cpf_cnpj TEXT,
        causa_ambiental TEXT,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS projetos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT,
        localizacao TEXT,
        meta REAL,
        categoria TEXT,
        arrecadado REAL DEFAULT 0,
        usuario_id INTEGER,
        istatus TEXT DEFAULT 'ativo',
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      );

      CREATE TABLE IF NOT EXISTS doacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        doador_id INTEGER,
        projeto_id INTEGER,
        valor REAL NOT NULL,
        data_doacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (doador_id) REFERENCES usuarios(id),
        FOREIGN KEY (projeto_id) REFERENCES projetos(id)
      );

      CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT
      );
    `);

    // Insert sample data
    await db.exec(`
      INSERT OR IGNORE INTO categorias (nome, descricao) VALUES 
      ('Reflorestamento', 'Projetos de plantio e recuperação de áreas florestais degradadas'),
      ('Energia Renovável', 'Implementação de energia solar, eólica e outras fontes renováveis'),
      ('Conservação Marinha', 'Preservação de recursos hídricos, rios, lagos e mares'),
      ('Biodiversidade', 'Conservação da fauna e proteção de espécies ameaçadas'),
      ('Educação Ambiental', 'Programas de educação e conscientização ambiental');

      INSERT OR IGNORE INTO projetos (nome, descricao, localizacao, meta, categoria, arrecadado) VALUES 
      ('Reflorestamento da Mata Atlântica', 'Restaurar áreas degradadas da Mata Atlântica com espécies nativas.', 'São Paulo - SP', 250000, 'reflorestamento', 187500),
      ('Conservação Marinha Litoral Norte', 'Proteção de recifes de coral e limpeza de praias no litoral norte.', 'Ubatuba - SP', 180000, 'conservacao-marinha', 142000),
      ('Educação Ambiental nas Escolas', 'Campanha de educação ambiental em escolas públicas.', 'Rio de Janeiro - RJ', 120000, 'educacao-ambiental', 95000),
      ('Energia Solar Comunitária', 'Instalação de painéis solares em comunidades da Amazônia.', 'Manaus - AM', 450000, 'energia-renovavel', 276000),
      ('Proteção da Biodiversidade do Cerrado', 'Monitoramento de espécies ameaçadas no Cerrado.', 'Brasília - DF', 320000, 'biodiversidade', 98000);

      INSERT OR IGNORE INTO usuarios (nome, email, senha, tipo) VALUES 
      ('Maria Silva', 'maria@email.com', '123456', 'doador'),
      ('João Santos', 'joao@email.com', '123456', 'doador'),
      ('Admin', 'admin@ecoconnect.com', '123456', 'organizacao');
    `);

    console.log('✅ Database initialized with sample data');
    return db;
  } catch (error) {
    console.error('❌ Error initializing SQLite database:', error);
    throw error;
  }
}

module.exports = initializeDatabase;