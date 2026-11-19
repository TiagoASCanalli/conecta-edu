/**
 * ConectaEdu - Servidor Backend RESTful
 * Projeto Integrador: Desenvolvimento de Sistemas Orientado a Dispositivos Móveis e Baseados na Web
 * Senac SP - TADS 2026
 * Equipe: Jonathan da Silva Cavalcanti, Renan Duarte Coelho, Tiago Alves dos Santos Canalli, Vanessa Kolbe da Silva
 * Professor Orientador: Prof. Msc Anderson Clayton Garcia Lopes
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'database.sqlite');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao SQLite:', err.message);
  } else {
    console.log('✅ Conectado ao banco SQLite em:', DB_PATH);
  }
});

// Helper de query com Promises
const queryAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const queryGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const queryRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

// ==========================================
// ROTAS DA API REST
// ==========================================

// 1. Listar Disciplinas
app.get('/api/disciplines', async (req, res) => {
  try {
    const disciplinas = await queryAll('SELECT * FROM disciplinas ORDER BY periodo, nome');
    res.json(disciplinas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Listar e Buscar Tópicos (Mecanismo de Busca da PoC)
app.get('/api/topics', async (req, res) => {
  try {
    const { q, discipline } = req.query;
    let sql = `
      SELECT t.*, d.nome AS disciplina_nome, d.codigo AS disciplina_codigo, d.cor_tema
      FROM topicos t
      JOIN disciplinas d ON t.disciplina_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (q) {
      sql += ` AND (t.titulo LIKE ? OR t.resumo_teorico LIKE ? OR t.tags LIKE ?)`;
      const term = `%${q}%`;
      params.push(term, term, term);
    }

    if (discipline) {
      sql += ` AND t.disciplina_id = ?`;
      params.push(discipline);
    }

    sql += ` ORDER BY t.titulo ASC`;

    const topicos = await queryAll(sql, params);
    res.json(topicos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Obter Detalhes de um Tópico
app.get('/api/topics/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const topico = await queryGet(`
      SELECT t.*, d.nome AS disciplina_nome, d.codigo AS disciplina_codigo, d.cor_tema
      FROM topicos t
      JOIN disciplinas d ON t.disciplina_id = d.id
      WHERE t.id = ?
    `, [id]);

    if (!topico) {
      return res.status(404).json({ error: 'Tópico não encontrado' });
    }

    res.json(topico);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Mapeamento de Conteúdos Correlatos (Recomendação Interdisciplinar da PoC)
app.get('/api/topics/:id/related', async (req, res) => {
  try {
    const { id } = req.params;

    // Busca conexões onde o tópico é origem
    const outgoing = await queryAll(`
      SELECT 
        c.id AS conexao_id,
        c.relacao_tipo,
        c.explicacao_ponte,
        c.exemplo_integracao,
        'destino' AS direcao,
        t.id AS topico_relacionado_id,
        t.titulo AS topico_relacionado_titulo,
        t.resumo_teorico,
        t.aplicacao_pratica,
        d.nome AS disciplina_nome,
        d.codigo AS disciplina_codigo,
        d.cor_tema
      FROM conexoes_interdisciplinares c
      JOIN topicos t ON c.topico_destino_id = t.id
      JOIN disciplinas d ON t.disciplina_id = d.id
      WHERE c.topico_origem_id = ?
    `, [id]);

    // Busca conexões onde o tópico é destino
    const incoming = await queryAll(`
      SELECT 
        c.id AS conexao_id,
        c.relacao_tipo,
        c.explicacao_ponte,
        c.exemplo_integracao,
        'origem' AS direcao,
        t.id AS topico_relacionado_id,
        t.titulo AS topico_relacionado_titulo,
        t.resumo_teorico,
        t.aplicacao_pratica,
        d.nome AS disciplina_nome,
        d.codigo AS disciplina_codigo,
        d.cor_tema
      FROM conexoes_interdisciplinares c
      JOIN topicos t ON c.topico_origem_id = t.id
      JOIN disciplinas d ON t.disciplina_id = d.id
      WHERE c.topico_destino_id = ?
    `, [id]);

    res.json({
      topico_id: id,
      correlatos: [...outgoing, ...incoming]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Trilhas de Aprendizado
app.get('/api/tracks', async (req, res) => {
  try {
    const { userId = 'usr_lucas' } = req.query;

    const trilhas = await queryAll(`
      SELECT tr.*, 
        COUNT(tt.topico_id) AS total_topicos,
        CASE WHEN fav.id IS NOT NULL THEN 1 ELSE 0 END AS favoritado
      FROM trilhas tr
      LEFT JOIN trilha_topicos tt ON tr.id = tt.trilha_id
      LEFT JOIN favoritos fav ON tr.id = fav.trilha_id AND fav.usuario_id = ?
      GROUP BY tr.id
    `, [userId]);

    // Calcular percentual concluído por trilha
    for (const trilha of trilhas) {
      const concluidos = await queryGet(`
        SELECT COUNT(p.id) as count
        FROM trilha_topicos tt
        JOIN progresso_aluno p ON tt.topico_id = p.topico_id
        WHERE tt.trilha_id = ? AND p.usuario_id = ? AND p.status = 'concluido'
      `, [trilha.id, userId]);

      trilha.topicos_concluidos = concluidos ? concluidos.count : 0;
      trilha.progresso_percentual = trilha.total_topicos > 0
        ? Math.round((trilha.topicos_concluidos / trilha.total_topicos) * 100)
        : 0;
    }

    res.json(trilhas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Detalhe da Trilha com tópicos ordenados
app.get('/api/tracks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId = 'usr_lucas' } = req.query;

    const trilha = await queryGet('SELECT * FROM trilhas WHERE id = ?', [id]);
    if (!trilha) return res.status(404).json({ error: 'Trilha não encontrada' });

    const topicos = await queryAll(`
      SELECT 
        t.*, 
        tt.ordem,
        d.nome AS disciplina_nome,
        d.codigo AS disciplina_codigo,
        d.cor_tema,
        COALESCE(p.status, 'a_fazer') AS status_progresso
      FROM trilha_topicos tt
      JOIN topicos t ON tt.topico_id = t.id
      JOIN disciplinas d ON t.disciplina_id = d.id
      LEFT JOIN progresso_aluno p ON t.id = p.topico_id AND p.usuario_id = ?
      WHERE tt.trilha_id = ?
      ORDER BY tt.ordem ASC
    `, [userId, id]);

    trilha.topicos = topicos;
    res.json(trilha);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Obter Progresso Geral do Usuário
app.get('/api/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const progresso = await queryAll(`
      SELECT p.*, t.titulo AS topico_titulo
      FROM progresso_aluno p
      JOIN topicos t ON p.topico_id = t.id
      WHERE p.usuario_id = ?
    `, [userId]);

    res.json(progresso);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Atualizar Status de Aprendizado (A Fazer / Em Andamento / Concluído)
app.post('/api/progress', async (req, res) => {
  try {
    const { userId = 'usr_lucas', topicId, status } = req.body;

    if (!topicId || !status || !['a_fazer', 'em_andamento', 'concluido'].includes(status)) {
      return res.status(400).json({ error: 'Parâmetros inválidos (topicId e status válidos são obrigatórios)' });
    }

    await queryRun(`
      INSERT INTO progresso_aluno (usuario_id, topico_id, status, atualizado_em)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(usuario_id, topico_id) 
      DO UPDATE SET status = excluded.status, atualizado_em = CURRENT_TIMESTAMP
    `, [userId, topicId, status]);

    res.json({ success: true, userId, topicId, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Alternar Favorito da Trilha
app.post('/api/favorites/toggle', async (req, res) => {
  try {
    const { userId = 'usr_lucas', trackId } = req.body;
    if (!trackId) return res.status(400).json({ error: 'trackId é obrigatório' });

    const exists = await queryGet(`
      SELECT id FROM favoritos WHERE usuario_id = ? AND trilha_id = ?
    `, [userId, trackId]);

    if (exists) {
      await queryRun('DELETE FROM favoritos WHERE id = ?', [exists.id]);
      res.json({ favoritado: false, message: 'Trilha removida dos favoritos' });
    } else {
      await queryRun('INSERT INTO favoritos (usuario_id, trilha_id) VALUES (?, ?)', [userId, trackId]);
      res.json({ favoritado: true, message: 'Trilha adicionada aos favoritos' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Cadastrar Nova Conexão Interdisciplinar (Painel do Curador / Prof. Carla)
app.post('/api/connections', async (req, res) => {
  try {
    const { originId, destinationId, relationType, explanation, example } = req.body;
    if (!originId || !destinationId || !relationType || !explanation) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    }

    const id = 'cx_' + Date.now();
    await queryRun(`
      INSERT INTO conexoes_interdisciplinares 
      (id, topico_origem_id, topico_destino_id, relacao_tipo, explicacao_ponte, exemplo_integracao)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, originId, destinationId, relationType, explanation, example || null]);

    res.status(201).json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Iniciar Servidor
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 ConectaEdu - Servidor Ativo na porta ${PORT}`);
  console.log(`👉 Acesse no navegador: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
