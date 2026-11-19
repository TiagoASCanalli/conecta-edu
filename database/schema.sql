-- Esquema do Banco de Dados Relacional - ConectaEdu
-- Projeto Integrador Senac SP - TADS 2026

DROP TABLE IF EXISTS favoritos;
DROP TABLE IF EXISTS progresso_aluno;
DROP TABLE IF EXISTS conexoes_interdisciplinares;
DROP TABLE IF EXISTS trilha_topicos;
DROP TABLE IF EXISTS trilhas;
DROP TABLE IF EXISTS topicos;
DROP TABLE IF EXISTS disciplinas;
DROP TABLE IF EXISTS usuarios;

-- Tabela de Usuários / Personas
CREATE TABLE usuarios (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    papel TEXT NOT NULL, -- 'estudante' ou 'curador'
    avatar TEXT,
    bio TEXT
);

-- Tabela de Disciplinas Curriculares
CREATE TABLE disciplinas (
    id TEXT PRIMARY KEY,
    codigo TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    periodo INTEGER NOT NULL,
    cor_tema TEXT DEFAULT '#2563eb',
    descricao TEXT
);

-- Tabela de Tópicos de Aprendizado
CREATE TABLE topicos (
    id TEXT PRIMARY KEY,
    disciplina_id TEXT NOT NULL,
    titulo TEXT NOT NULL,
    resumo_teorico TEXT NOT NULL,
    aplicacao_pratica TEXT NOT NULL,
    codigo_exemplo TEXT,
    tags TEXT,
    tempo_estimado_minutos INTEGER DEFAULT 30,
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id) ON DELETE CASCADE
);

-- Tabela de Trilhas Integradoras
CREATE TABLE trilhas (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    nivel TEXT NOT NULL, -- 'Iniciante', 'Intermediário', 'Avançado'
    duracao_horas INTEGER DEFAULT 10,
    icone TEXT DEFAULT 'book-open'
);

-- Tabela de Associação Trilha <-> Tópicos (Muitos para Muitos com Ordem)
CREATE TABLE trilha_topicos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trilha_id TEXT NOT NULL,
    topico_id TEXT NOT NULL,
    ordem INTEGER NOT NULL,
    FOREIGN KEY (trilha_id) REFERENCES trilhas(id) ON DELETE CASCADE,
    FOREIGN KEY (topico_id) REFERENCES topicos(id) ON DELETE CASCADE,
    UNIQUE(trilha_id, topico_id)
);

-- Tabela de Conexões Interdisciplinares (O Grafo Interdisciplinar)
CREATE TABLE conexoes_interdisciplinares (
    id TEXT PRIMARY KEY,
    topico_origem_id TEXT NOT NULL,
    topico_destino_id TEXT NOT NULL,
    relacao_tipo TEXT NOT NULL, -- 'Prática Aplicada', 'Pré-requisito Teórico', 'Evolução Tecnológica'
    explicacao_ponte TEXT NOT NULL,
    exemplo_integracao TEXT,
    FOREIGN KEY (topico_origem_id) REFERENCES topicos(id) ON DELETE CASCADE,
    FOREIGN KEY (topico_destino_id) REFERENCES topicos(id) ON DELETE CASCADE
);

-- Tabela de Acompanhamento de Progresso do Aluno
CREATE TABLE progresso_aluno (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id TEXT NOT NULL,
    topico_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('a_fazer', 'em_andamento', 'concluido')),
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (topico_id) REFERENCES topicos(id) ON DELETE CASCADE,
    UNIQUE(usuario_id, topico_id)
);

-- Tabela de Trilhas Favoritadas pelo Aluno
CREATE TABLE favoritos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id TEXT NOT NULL,
    trilha_id TEXT NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (trilha_id) REFERENCES trilhas(id) ON DELETE CASCADE,
    UNIQUE(usuario_id, trilha_id)
);
