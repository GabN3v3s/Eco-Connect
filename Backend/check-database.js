const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function checkDatabase() {
  const db = await open({
    filename: path.join(__dirname, 'doacoes_ambientais.db'),
    driver: sqlite3.Database
  });

  console.log('🔍 Checking database for duplicate projects...');

  const projects = await db.all("SELECT * FROM projetos");
  console.log(`Total projects in database: ${projects.length}`);

  projects.forEach((project, index) => {
    console.log(`${index + 1}. ${project.nome} (ID: ${project.id})`);
  });

  // Check for duplicates by name
  const duplicates = await db.all(`
    SELECT nome, COUNT(*) as count 
    FROM projetos 
    GROUP BY nome 
    HAVING COUNT(*) > 1
  `);

  if (duplicates.length > 0) {
    console.log('\n❌ Found duplicate projects:');
    duplicates.forEach(dup => {
      console.log(`- ${dup.nome}: ${dup.count} entries`);
    });

    console.log('\n💡 To fix, run:');
    console.log('DELETE FROM projetos WHERE id NOT IN (SELECT MIN(id) FROM projetos GROUP BY nome)');
  } else {
    console.log('\n✅ No duplicate projects found');
  }

  await db.close();
}

checkDatabase().catch(console.error);