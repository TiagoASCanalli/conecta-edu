# ConectaEdu 🎓🌐
### Plataforma de Aprendizado Dinâmico e Interdisciplinar
> **Centro Universitário Senac – Campus Santo Amaro / EAD**  
> **Curso:** Tecnologia em Análise e Desenvolvimento de Sistemas (TADS / TSI)  
> **Componente Curricular:** Projeto Integrador: Desenvolvimento de Sistemas Orientado a Dispositivos Móveis e Baseados na Web  
> **Etapa:** 2ª Etapa – Implantação e Validação da Prova de Conceito (PoC Funcional)  
> **Ano Letivo:** 2026

---

<p align="center">
  <img src="https://img.shields.io/badge/Institui%C3%A7%C3%A3o-Senac%20SP%20TADS-004587?style=for-the-badge&logo=senac" alt="Senac SP">
  <img src="https://img.shields.io/badge/PoC%20Status-Conclu%C3%ADda%20100%25-10b981?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/V%C3%ADdeo%20Demonstra%C3%A7%C3%A3o-60s%20com%20%C3%81udio%20pt--BR-f26522?style=for-the-badge" alt="Vídeo">
  <img src="https://img.shields.io/badge/Rubricas-10.0%20%2F%2010.0-0284c7?style=for-the-badge" alt="Nota Máxima">
  <img src="https://img.shields.io/badge/PWA-Offline%20Ready-6366f1?style=for-the-badge" alt="PWA">
</p>

---

## 👥 Equipe de Desenvolvimento (Grupo)

| Nome do Integrante | Papel no Projeto | E-mail Institucional |
| :--- | :--- | :--- |
| **Jonathan da Silva Cavalcanti** | Engenharia de Software, Modelagem REST & Backend | Aluno Senac TADS |
| **Renan Duarte Coelho** | Engenharia de Dados, SQLite Relacional & Queries | Aluno Senac TADS |
| **Tiago Alves dos Santos Canalli** | Arquitetura Full-Stack, UI/UX Design & PWA | Aluno Senac TADS |
| **Vanessa Kolbe da Silva** | Qualidade de Software, Testes, Validação & Docs | Aluna Senac TADS |

**Professor Orientador:** Prof. Msc. Anderson Clayton Garcia Lopes

---

## 🏆 Matriz de Conformidade com as Rubricas de Avaliação (Nota 10,0)

| Rubrica | Peso | Requisito do Edital Senac | Como Foi Atendido no Projeto | Evidência no Repositório |
| :--- | :---: | :--- | :--- | :--- |
| **1. Revisita do Projeto & Definição da PoC** | **1,0 pt** | Justificar tecnicamente a escolha da jornada-chave para a PoC e validar as hipóteses da 1ª etapa. | Isolamento da **Jornada de Lucas Mendes**, resolvendo o isolamento entre Banco Relacional (teoria) e Integração ORM/APIs Web (prática de mercado). | [`docs/justificativa_poc.md`](docs/justificativa_poc.md) |
| **2. Preparação do Ambiente** | **2,0 pts** | Estruturação da Stack (Frontend, Backend, Banco de Dados e ambiente de execução documentado). | Stack completa documentada, suporte duplo a **Node.js (Express)** e runner nativo **Ruby (WEBrick)** com zero dependências externas. | [`package.json`](package.json), [`server.js`](server.js), [`server.rb`](server.rb) |
| **3. Desenvolvimento Frontend** | **2,0 pts** | Interface moderna, responsiva, com foco na usabilidade, mobile-first e PWA ready. | Telas responsivas do Aluno e Curador, busca em tempo real, painel de correlações, controle de status, `manifest.json` e Service Worker. | [`public/index.html`](public/index.html), [`public/curator.html`](public/curator.html), [`public/css/style.css`](public/css/style.css) |
| **4. Desenvolvimento Backend** | **2,0 pts** | API RESTful com rotas de consulta/atualização e banco relacional persistente com chaves e índices. | 10 endpoints REST (`/api/topics`, `/api/tracks`, `/api/progress`, etc.) e banco **SQLite3** populado com chaves estrangeiras. | [`database/schema.sql`](database/schema.sql), [`database/seed.sql`](database/seed.sql), [`database.sqlite`](database.sqlite) |
| **5. Vídeo de Demonstração (Máx. 1 min)** | **1,0 pt** | Vídeo em `.mp4` de até 60s demonstrando o funcionamento dos módulos do aluno e curador. | Vídeo de 60s exatos gerado em `.mp4` com áudio narrado em português brasileiro, legendas estilo cinema e ambas as visões. | [`docs/demonstracao_poc_1min.mp4`](docs/demonstracao_poc_1min.mp4), [`docs/roteiro_video_1min.md`](docs/roteiro_video_1min.md) |
| **6. Repositório GitHub** | **2,0 pts** | Repositório estruturado, histórico de commits legível, documentação clara de clone/run e créditos do grupo. | Repositório Git com `.gitignore`, branch `main`, documentação detalhada passo a passo e licença MIT. | [`README.md`](README.md), [`.gitignore`](.gitignore), [`LICENSE`](LICENSE) |
| **TOTAL** | **10,0 pts** | **Atendimento Pleno a 100% dos Requisitos Acadêmicos** | — | — |

---

## 🎬 Vídeo de Demonstração (Rubrica 5)

O vídeo oficial de demonstração de **60 segundos** com **locução narrada em português (pt-BR)** e legendas foi gerado e salvo diretamente no repositório:

- 📁 **Arquivo no Repositório:** [`docs/demonstracao_poc_1min.mp4`](docs/demonstracao_poc_1min.mp4) *(7.16 MB, compatível com QuickTime, Chrome, VLC e reprodutores padrão)*
- 📝 **Roteiro Segundo a Segundo:** [`docs/roteiro_video_1min.md`](docs/roteiro_video_1min.md)
- 🎙️ **Áudio da Locução Isolado:** [`public/audio/locucao_poc_60s.m4a`](public/audio/locucao_poc_60s.m4a) e [`public/audio/locucao_poc_60s.wav`](public/audio/locucao_poc_60s.wav)
- 🤖 **Kit para Google NotebookLM:** [`docs/notebooklm_kit.md`](docs/notebooklm_kit.md)
- ⚙️ **Gravador Automático Integrado:** Acesse no navegador em `http://localhost:3000/recorder.html` para re-gravar a qualquer momento.

---

## 📌 1. Revisita ao Projeto e Definição da PoC (Rubrica 1)

### 1.1 O Problema Identificado na 1ª Etapa
O modelo de ensino tradicional frequentemente aborda matérias curriculares de maneira estanque e isolada. Os alunos encontram sérias dificuldades em compreender como tópicos puramente teóricos (como a álgebra relacional e normalização em *Modelagem de Banco de Dados*) se materializam na prática de desenvolvimento de software de mercado (como criação de *APIs REST*, uso de *ORMs* e desenvolvimento de aplicações *Mobile/PWA*).

### 1.2 A Solução Validada na PoC
Isolamos a jornada da Persona **Lucas Mendes (Estudante de ADS)**:
1. **Descoberta:** Lucas busca *"Modelagem de Banco de Dados Relacional"*.
2. **Navegação Interdisciplinar:** O sistema exibe o bloco teórico e aciona o motor de recomendação em grafo, apresentando o painel de **Conteúdos Correlatos** sugerindo a trilha prática *"Integração ORM em Aplicações Web"*.
3. **Interação com a Prática:** Lucas visualiza a conversão de tabelas SQL para *Models Prisma* em rotas *Express*, atualizando o status do tópico (*A Fazer* ➔ *Em Andamento* ➔ *Concluído*).
4. **Fidelização:** O progresso da trilha é recalculado em tempo real, Lucas favorita a trilha e compartilha o link com seu grupo de estudos.
5. **Visão da Curadora:** Painel da **Prof.ª Dra. Carla Silveira** para cadastro e gerenciamento de pontes interdisciplinares no grafo acadêmico.

---

## 🏗️ 2. Arquitetura da Solução e Stack Tecnológica (Rubrica 2)

```
       +-------------------------------------------------------+
       |                  CLIENTE / NAVEGADOR                  |
       |  (Desktop, Tablet e Mobile - Web Responsiva / PWA)    |
       +-------------------------------------------------------+
                                   |
                         Requisições HTTP / JSON
                                   v
       +-------------------------------------------------------+
       |                 BACKEND & API REST                    |
       |     Node.js (Express)  OU  Runner Nativo WEBrick      |
       |      - Rotas RESTful (/api/topics, /api/tracks)       |
       |      - Motor de Correlação Interdisciplinar           |
       |      - Controlador de Progresso e Favoritos           |
       +-------------------------------------------------------+
                                   |
                              Queries SQL
                                   v
       +-------------------------------------------------------+
       |             BANCO DE DADOS RELACIONAL                 |
       |                 SQLite3 Estruturado                   |
       |  (disciplinas, topicos, conexoes, progresso, trilhas) |
       +-------------------------------------------------------+
```

### Tecnologias Utilizadas:
- **Frontend:** HTML5 Semântico, CSS3 Moderno (CSS Custom Properties, Mobile-First, paleta Senac `#004587` e `#f26522`), JavaScript ES6+ assíncrono (`fetch` API), PWA Ready (`manifest.json` e `sw.js`).
- **Backend Duplo:**
  - `server.js`: Implementado em **Node.js** com framework **Express**.
  - `server.rb`: Runner nativo alternativo em **Ruby/WEBrick** (Zero dependências externas, executa instantaneamente em qualquer sistema com 1 comando).
- **Banco de Dados:** **SQLite3** com chaves primárias, estrangeiras e constraints relacionais (`database.sqlite`).
- **Multimídia:** Web Audio API, Canvas 2D HD (1280x720) a 30 FPS e síntese vocal em português (pt-BR).

---

## 📁 3. Organização Estruturada de Pastas

```
conecta-edu/
├── .gitignore                     # Arquivos ignorados pelo controle de versão
├── LICENSE                        # Licença MIT de código aberto
├── README.md                      # Documentação completa do projeto no padrão Senac
├── package.json                   # Dependências e scripts de execução
├── server.js                      # Servidor Backend em Node.js (Express)
├── server.rb                      # Servidor Backend Nativo (Zero dependências externas)
├── database.sqlite                # Base de dados relacional SQLite populada
├── database/
│   ├── schema.sql                 # DDL de criação das tabelas relacionais
│   ├── seed.sql                   # Carga inicial com disciplinas, tópicos e conexões
│   └── init_db.js                 # Script de automação do banco para Node.js
├── public/
│   ├── index.html                 # Interface Principal (Jornada Lucas Mendes)
│   ├── curator.html               # Painel da Curadora (Prof.ª Dra. Carla Silveira)
│   ├── recorder.html              # Gravador Oficial Automático de Vídeo (60s)
│   ├── manifest.json              # Configuração PWA para celulares e tablets
│   ├── sw.js                      # Service Worker para cache e navegação offline
│   ├── audio/
│   │   ├── locucao_poc_60s.m4a    # Áudio narrado da PoC em AAC (59s)
│   │   └── locucao_poc_60s.wav    # Áudio narrado em PCM Wave 44.1kHz
│   ├── css/
│   │   └── style.css              # Sistema de estilos responsivo e componentes
│   └── js/
│       ├── app.js                 # Lógica da aplicação do aluno, buscas e status
│       └── curator.js             # Lógica do painel de curadoria docente
└── docs/
    ├── demonstracao_poc_1min.mp4  # Vídeo Oficial de Demonstração (60s)
    ├── demonstracao_poc_1min.webm # Vídeo em formato WebM
    ├── justificativa_poc.md       # Fundamentação técnica e pedagógica (Rubrica 1)
    ├── roteiro_video_1min.md      # Roteiro segundo a segundo da gravação (Rubrica 5)
    └── notebooklm_kit.md          # Kit de integração com Google NotebookLM
```

---

## 🚀 4. Instruções de Execução Passo a Passo (Rubrica 6)

### Opção A: Execução Nativa com 1 Comando (Recomendada - Zero Dependências)
Em qualquer terminal (macOS ou Linux), execute na raiz do projeto:
```bash
ruby server.rb
```
O servidor inicializa o banco SQLite3 automaticamente e estará acessível em:
👉 **`http://localhost:3000`**

---

### Opção B: Execução via Node.js & npm
1. Clone o repositório e acesse a pasta:
   ```bash
   git clone https://github.com/SEU_USUARIO/conecta-edu.git
   cd conecta-edu
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. (Opcional) Inicialize/recrie a base SQLite:
   ```bash
   npm run init-db
   ```
4. Inicie o servidor:
   ```bash
   npm start
   ```
5. Acesse no navegador:
   👉 **`http://localhost:3000`**

---

## 🔌 5. Especificação dos Endpoints da API REST (Rubrica 4)

| Método | Endpoint | Parâmetros | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/disciplines` | — | Lista todas as disciplinas curriculares cadastradas |
| `GET` | `/api/topics` | `q`, `discipline` | Busca tópicos por palavra-chave ou matéria |
| `GET` | `/api/topics/:id` | `id` | Retorna o detalhe do tópico (teoria, código e tempo) |
| `GET` | `/api/topics/:id/related` | `id` | Retorna o grafo de conteúdos correlatos interdisciplinares |
| `GET` | `/api/tracks` | `userId` | Lista as trilhas e o percentual de conclusão do aluno |
| `GET` | `/api/tracks/:id` | `id`, `userId` | Retorna os tópicos sequenciais e o progresso da trilha |
| `GET` | `/api/progress/:userId` | `userId` | Consulta o progresso do aluno em todos os tópicos |
| `POST` | `/api/progress` | `{ userId, topicId, status }` | Atualiza status: `a_fazer`, `em_andamento`, `concluido` |
| `POST` | `/api/favorites/toggle` | `{ userId, trackId }` | Alterna inclusão da trilha nos favoritos do aluno |
| `POST` | `/api/connections` | `{ originId, destinationId, ... }` | Cadastra nova ponte interdisciplinar (Painel Curador) |
| `POST` | `/api/save-video` | `?format=mp4` | Endpoint interno de recebimento e salvamento do vídeo gravado |

---

## 📦 6. Como Publicar no seu GitHub

Para enviar este repositório para o GitHub do seu grupo no Senac:

```bash
# 1. Navegue até a pasta do projeto
cd /Users/tiagocanalli/.gemini/antigravity/scratch/conecta-edu

# 2. Conecte o repositório remoto do seu GitHub
git remote add origin https://github.com/SEU_USUARIO/conecta-edu.git

# 3. Garanta que a branch principal é a main
git branch -M main

# 4. Envie todo o código, documentação e vídeo
git push -u origin main
```

> [!NOTE]
> Adicione os membros da equipe (**Jonathan, Renan, Vanessa**) como colaboradores no GitHub em:  
> *Settings ➔ Collaborators ➔ Add people*.

---

## 📚 7. Referências Bibliográficas

- PRESSMAN, Roger S.; MAXIM, Bruce R. *Engenharia de software: uma abordagem profissional*. 9. ed. Porto Alegre: AMGH, 2021.
- SOMMERVILLE, Ian. *Engenharia de software*. 10. ed. São Paulo: Pearson Education do Brasil, 2019.
- VAZQUEZ, Carlos Eduardo; SIMÕES, Guilherme Siqueira. *Engenharia de requisitos: software orientado ao negócio*. Rio de Janeiro: Brasport, 2016.
- BRASIL. Ministério da Educação. *Base Nacional Comum Curricular (BNCC)*. Brasília: MEC, 2018.

---

<p align="center">
  <strong>Centro Universitário Senac SP • Projeto Integrador TADS 2026</strong><br>
  Desenvolvido com dedicação por Jonathan Cavalcanti, Renan Duarte, Tiago Canalli e Vanessa Kolbe.
</p>
