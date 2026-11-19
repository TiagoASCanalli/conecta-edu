-- Carga Inicial de Dados (Seed) - ConectaEdu
-- Projeto Integrador Senac SP - TADS 2026

-- 1. Usuários / Personas
INSERT INTO usuarios (id, nome, papel, avatar, bio) VALUES
('usr_lucas', 'Lucas Mendes', 'estudante', '👨‍💻', 'Estudante de Análise e Desenvolvimento de Sistemas (3º Período) e Estagiário de Suporte. Busca conectar a teoria do curso a desafios reais do mercado de trabalho.'),
('usr_carla', 'Prof.ª Dra. Carla Silveira', 'curadora', '👩‍🏫', 'Professora Universitária e Coordenadora Acadêmica no Senac SP. Curadora de trilhas interdisciplinares.');

-- 2. Disciplinas Curriculares do Curso TADS
INSERT INTO disciplinas (id, codigo, nome, periodo, cor_tema, descricao) VALUES
('disc_bd', 'TADS301', 'Modelagem de Banco de Dados', 3, '#0284c7', 'Fundamentos de bancos de dados relacionais, álgebra relacional, normalização e SQL padrão ANSI.'),
('disc_web', 'TADS302', 'Programação Web e Serviços', 3, '#10b981', 'Desenvolvimento de aplicações web modernas, APIs RESTful, arquitetura cliente-servidor e integração.'),
('disc_es', 'TADS303', 'Engenharia de Software', 3, '#8b5cf6', 'Ciclos de vida de software, padrões de projeto arquiteturais, requisitos e boas práticas de engenharia.'),
('disc_mob', 'TADS401', 'Desenvolvimento para Dispositivos Móveis', 4, '#f59e0b', 'Construção de aplicações para smartphones e tablets, integração com APIs, PWAs e persistência local.');

-- 3. Tópicos de Conhecimento
INSERT INTO topicos (id, disciplina_id, titulo, resumo_teorico, aplicacao_pratica, codigo_exemplo, tags, tempo_estimado_minutos) VALUES
(
    'top_bd_relacional',
    'disc_bd',
    'Modelagem de Banco de Dados Relacional',
    'Estudo formal de entidades, atributos, relacionamentos, cardinalidades (1:1, 1:N, N:N) e regras de integridade referencial. Aplicação das Formas Normais (1FN, 2FN e 3FN) para evitar redundância e anomalias de atualização.',
    'No mercado de software, a modelagem conceitual e lógica do banco relacional é a base que dá sustentação a qualquer sistema de médio/grande porte corporativo. Os modelos DER/MER são traduzidos em migrações que estruturam tabelas no PostgreSQL ou SQLite.',
    '-- DDL: Tabela de Alunos e Matrículas Relacionais
CREATE TABLE alunos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE matriculas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aluno_id INTEGER NOT NULL,
    curso VARCHAR(80) NOT NULL,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE
);',
    'banco de dados, relacional, sql, ddl, normalização, tabelas',
    45
),
(
    'top_orm_web',
    'disc_web',
    'Integração ORM em Aplicações Web',
    'Mapeamento Objeto-Relacional (ORM) é a técnica arquitetural que abstrai o modelo relacional de tabelas/colunas em classes e objetos orientados a objetos no código do backend, eliminando a escrita manual de queries SQL cruas e reduzindo riscos de SQL Injection.',
    'Em APIs corporativas Node.js ou Java, o desenvolvedor raramente escreve queries puras: utiliza ferramentas ORM (como Prisma, TypeORM, Hibernate) para manipular os registros do banco como instâncias de classes, acelerando o desenvolvimento e facilitando testes unitários.',
    '// Backend Node.js / TypeScript com Prisma ORM
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Criar aluno e matrícula vinculada em uma única transação ORM
export async function matricularAluno(nome: string, email: string, curso: string) {
  return await prisma.aluno.create({
    data: {
      nome,
      email,
      matriculas: {
        create: { curso }
      }
    },
    include: { matriculas: true }
  });
}',
    'orm, backend, nodejs, prisma, web, sql injection, persistencia',
    40
),
(
    'top_api_rest',
    'disc_web',
    'Desenvolvimento de APIs RESTful',
    'Conceitos fundamentais da arquitetura REST: statelessness, métodos HTTP semânticos (GET, POST, PUT, DELETE), cabeçalhos, códigos de status (200, 201, 400, 404, 500) e formato de representação JSON.',
    'APIs REST são o canal padrão de comunicação entre backends e clientes modernos (frontends React, Vue, aplicações Android/iOS). O ORM fornece os dados para a camada de serviço da API, que os expõe de forma padronizada via rotas HTTP.',
    '// Rota Express conectada à camada de persistência
app.get("/api/alunos/:id", async (req, res) => {
  try {
    const aluno = await alunoService.buscarPorId(req.params.id);
    if (!aluno) return res.status(404).json({ error: "Aluno não encontrado" });
    return res.status(200).json(aluno);
  } catch (err) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
});',
    'api, rest, express, json, http, backend, microservicos',
    35
),
(
    'top_mobile_pwa',
    'disc_mob',
    'Consumo de APIs e Cache Offline em Apps Mobile',
    'Padrões de consumo assíncrono de APIs a partir de interfaces móveis. Uso de Service Workers, Cache API e Web Storage (LocalStorage/IndexedDB) para garantir navegação resiliente mesmo em conexões lentas ou offline.',
    'Permite que estudantes como o Lucas continuem navegando pelas trilhas de aprendizado no transporte público (offline) e sincronizem seu progresso de estudo assim que o dispositivo recuperar o sinal de internet.',
    '// Service Worker PWA com estratégia Cache-First
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).then((networkResponse) => {
        return caches.open("conectaedu-v1").then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});',
    'mobile, pwa, offline, cache, service worker, responsivo',
    50
),
(
    'top_padroes_mvc',
    'disc_es',
    'Padrões Arquiteturais: Model-View-Controller (MVC)',
    'Separação de responsabilidades em camadas distintas: Model (regras de negócio e dados), View (interface com o usuário) e Controller (intermediação de eventos e orquestração).',
    'Garante a manutenibilidade do código em equipes ágeis, permitindo que alterações na interface ou na tecnologia do banco de dados não quebrem a lógica essencial da aplicação.',
    '// Estrutura modular MVC em camadas
// 1. Model: Define entidades e regras de validação
// 2. Controller: Recebe requisições da rota e chama o serviço
// 3. View: Renderiza o HTML/JSON retornado ao cliente',
    'engenharia de software, mvc, arquitetura, boas praticas, design patterns',
    30
);

-- 4. Trilhas de Aprendizado
INSERT INTO trilhas (id, titulo, descricao, nivel, duracao_horas, icone) VALUES
(
    'trilha_fullstack_orm',
    'Integração ORM em Aplicações Web',
    'Trilha interdisciplinar que conecta a teoria de Modelagem de Banco de Dados com a implementação prática de APIs RESTful e ORM moderno no Backend Web.',
    'Intermediário',
    12,
    'database'
),
(
    'trilha_mobile_integrado',
    'Ecossistema Mobile & PWA Integrado a APIs',
    'Aprenda a construir interfaces responsivas que consomem APIs corporativas e funcionam em qualquer smartphone com suporte a cache offline.',
    'Avançado',
    16,
    'smartphone'
);

-- 5. Tópicos da Trilha
INSERT INTO trilha_topicos (trilha_id, topico_id, ordem) VALUES
('trilha_fullstack_orm', 'top_bd_relacional', 1),
('trilha_fullstack_orm', 'top_orm_web', 2),
('trilha_fullstack_orm', 'top_api_rest', 3),
('trilha_fullstack_orm', 'top_padroes_mvc', 4),
('trilha_mobile_integrado', 'top_api_rest', 1),
('trilha_mobile_integrado', 'top_mobile_pwa', 2);

-- 6. Conexões Interdisciplinares (Grafo do Conhecimento)
INSERT INTO conexoes_interdisciplinares (id, topico_origem_id, topico_destino_id, relacao_tipo, explicacao_ponte, exemplo_integracao) VALUES
(
    'cx_bd_para_orm',
    'top_bd_relacional',
    'top_orm_web',
    'Prática Aplicada',
    'A modelagem relacional (tabelas e chaves estrangeiras) converte-se diretamente em classes de modelos e decorators em ORMs modernos. Em vez de escrever comandos SQL crus repetitivos, o desenvolvedor usa o ORM para mapear a lógica de negócio.',
    'Tabela SQL "alunos" -> Classe/Schema "model Aluno { id Int @id, nome String, email String }"'
),
(
    'cx_orm_para_api',
    'top_orm_web',
    'top_api_rest',
    'Integração de Camada',
    'O ORM alimenta os endpoints da API REST, fornecendo os dados que serão serializados em JSON e entregues ao frontend.',
    'Rota GET /alunos -> Controller chama alunoService.listar() via ORM -> Resposta HTTP 200 com JSON'
),
(
    'cx_api_para_mobile',
    'top_api_rest',
    'top_mobile_pwa',
    'Consumo de Serviço',
    'A aplicação mobile consome a API REST criada, armazenando cópias locais em cache/IndexedDB para viabilizar estudos offline.',
    'App Mobile faz fetch("/api/trilhas") -> Salva no Cache do Service Worker -> Funciona offline no smartphone'
),
(
    'cx_mvc_para_api',
    'top_padroes_mvc',
    'top_api_rest',
    'Fundamentação Arquitetural',
    'O padrão arquitetural MVC orienta como organizar os controllers, services e models para evitar acoplamento no backend.',
    'Organização de pastas: /controllers, /models, /routes e /services'
);

-- 7. Estado Inicial do Progresso do Lucas Mendes (para demonstrar a PoC)
INSERT INTO progresso_aluno (usuario_id, topico_id, status) VALUES
('usr_lucas', 'top_bd_relacional', 'a_fazer'),
('usr_lucas', 'top_orm_web', 'a_fazer');

-- 8. Favoritos Iniciais
INSERT INTO favoritos (usuario_id, trilha_id) VALUES
('usr_lucas', 'trilha_fullstack_orm');
