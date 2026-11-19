/**
 * Inicializador do Banco de Dados SQLite para ambiente Node.js
 * Projeto Integrador - Senac SP
 */
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const schemaPath = path.join(__dirname, 'schema.sql');
const seedPath = path.join(__dirname, 'seed.sql');

console.log('🔄 Inicializando banco de dados ConectaEdu...');

const schemaSql = fs.readFileSync(schemaPath, 'utf8');
const seedSql = fs.readFileSync(seedPath, 'utf8');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao SQLite:', err.message);
    process.exit(1);
  }
  console.log('✅ Conexão com SQLite estabelecida.');
});

db.serialize(() => {
  db.exec(schemaSql, (err) => {
    if (err) {
      console.error('❌ Erro ao executar schema.sql:', err.message);
      return;
    }
    console.log('✅ Esquema de tabelas criado com sucesso.');

    db.exec(seedSql, (seedErr) => {
      if (seedErr) {
        console.error('❌ Erro ao executar seed.sql:', seedErr.message);
        return;
      }
      console.log('✅ Dados iniciais (Seed) inseridos com sucesso!');
      db.close();
    });
  });
});
