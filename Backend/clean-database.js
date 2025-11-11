const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function cleanDatabase() {
  const db = await open({
    filename: path.join(__dirname, 'doacoes_ambientais.db'),
    driver: sqlite3.Database
  });

  console.log('🧹 Cleaning duplicate projects...');

  // Keep only the first occurrence of each project name
  await db.run(`
    DELETE FROM projetos 
    WHERE id NOT IN (
      SELECT MIN(id) 
      FROM projetos 
      GROUP BY nome
    )
  `);

  const projects = await db.all("SELECT * FROM projetos");
  console.log(`✅ Cleaned database. Now have ${projects.length} unique projects:`);

  projects.forEach((project, index) => {
    console.log(`${index + 1}. ${project.nome}`);
  });

  await db.close();
}

cleanDatabase().catch(console.error);