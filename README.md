# ConectaEdu 🎓🌐
### Plataforma de Aprendizado Dinâmico e Interdisciplinar
> **Projeto Integrador: Desenvolvimento de Sistemas Orientado a Dispositivos Móveis e Baseados na Web**  
> **2ª Etapa: Implantação da Prova de Conceito (PoC)**  
> **Centro Universitário Senac – Tecnologia em Análise e Desenvolvimento de Sistemas (TADS / TSI)**  
> **Ano Letivo: 2026**

---

## 👥 Equipe de Desenvolvimento
| Nome do Integrante | Papel no Projeto | E-mail / Contato |
| :--- | :--- | :--- |
| **Jonathan da Silva Cavalcanti** | Engenharia de Software & Backend | Aluno Senac TADS |
| **Renan Duarte Coelho** | Modelagem de Banco de Dados & Infra | Aluno Senac TADS |
| **Tiago Alves dos Santos Canalli** | Arquitetura Full-Stack & UI/UX | Aluno Senac TADS |
| **Vanessa Kolbe da Silva** | Qualidade de Software, Testes & Documentação | Aluna Senac TADS |

**Professor Orientador:** Prof. Msc. Anderson Clayton Garcia Lopes

---

## 📌 1. Revisita ao Projeto e Definição da PoC (Rubrica 1)

### 1.1 O Problema Identificado na 1ª Etapa
O modelo de ensino tradicional frequentemente aborda matérias curriculares de maneira estanque e isolada. Os alunos encontram sérias dificuldades em compreender como tópicos puramente teóricos (como a álgebra relacional e normalização em *Modelagem de Banco de Dados*) se materializam na prática de desenvolvimento de software de mercado (como criação de *APIs REST*, uso de *ORMs* e desenvolvimento de aplicações *Mobile/PWA*).

### 1.2 A Prova de Conceito (PoC)
Para a 2ª etapa, isolamos a **Jornada da Persona Lucas Mendes (Estudante de ADS)** descrita no documento de ideação:
- **Cenário:** Lucas estuda Banco de Dados Relacional e precisa entender a conexão com APIs Web.
- **Solução Implementada na PoC:**
  1. **Descoberta:** Lucas busca *"Modelagem de Banco de Dados Relacional"*.
  2. **Navegação Interdisciplinar:** O sistema exibe o bloco teórico e aciona o motor de recomendação em grafo, apresentando o painel de **Conteúdos Correlatos** sugerindo a trilha prática *"Integração ORM em Aplicações Web"*.
  3. **Interação com a Prática:** Lucas analisa o exemplo de conversão de tabelas SQL para *Prisma/Schema* em rotas *Express*, atualizando o status do tópico (*A Fazer* ➔ *Em Andamento* ➔ *Concluído*).
  4. **Fidelização:** O progresso da trilha é recalculado em tempo real, Lucas favorita a trilha e compartilha o link direto com os membros do seu grupo de estudos.
  5. **Bônus Curadoria:** Painel da **Prof.ª Dra. Carla Silveira** para cadastro de novas pontes interdisciplinares entre tópicos curriculares.

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
- **Frontend:** HTML5 Semântico, CSS3 Moderno (Mobile-First, tema Senac corporativo), JavaScript ES6+ assíncrono (`fetch` API), PWA Ready (`manifest.json` e Service Worker para cache).
- **Backend:** Arquitetura RESTful modular com suporte duplo:
  - `server.js`: Implementado em **Node.js** com framework **Express**.
  - `server.rb`: Runner nativo alternativo em **Ruby/WEBrick** (Zero dependências externas, executa instantaneamente com 1 comando).
- **Banco de Dados:** **SQLite3** com chaves primárias, estrangeiras e constraints relacionais (`database.sqlite`).

---

## 📁 3. Organização Estruturada de Pastas

```
conecta-edu/
├── .gitignore                     # Arquivos ignorados pelo controle de versão
├── README.md                      # Documentação completa do projeto
├── package.json                   # Dependências e scripts de execução
├── server.js                      # Servidor Backend em Node.js (Express)
├── server.rb                      # Servidor Backend Nativo (Zero dependências)
├── database.sqlite                # Base de dados relacional SQLite populada
├── database/
│   ├── schema.sql                 # DDL de criação das tabelas relacionais
│   ├── seed.sql                   # Carga de dados inicial das disciplinas e tópicos
│   └── init_db.js                 # Script de automação do banco para Node.js
├── public/
│   ├── index.html                 # Interface Principal (Jornada Lucas Mendes)
│   ├── curator.html               # Painel da Curadora (Prof.ª Dra. Carla Silveira)
│   ├── manifest.json              # Configuração PWA para celulares e tablets
│   ├── sw.js                      # Service Worker para cache e navegação offline
│   ├── css/
│   │   └── style.css              # Sistema de estilos responsivo e componentes
│   └── js/
│       ├── app.js                 # Lógica da aplicação do aluno, buscas e status
│       └── curator.js             # Lógica do painel de curadoria docente
└── docs/
    ├── justificativa_poc.md       # Fundamentação técnica e pedagógica detalhada
    └── roteiro_video_1min.md      # Roteiro segundo a segundo para o vídeo de 1 minuto
```

---

## 🚀 4. Instruções de Execução Passo a Passo (Rubrica 6)

### Opção A: Execução Imediata Nativa (Recomendada - Zero Instalações)
No macOS ou Linux com Ruby nativo, execute na pasta do projeto:
```bash
ruby server.rb
```
O servidor inicializará automaticamente o banco de dados (se necessário) e estará acessível em:
👉 **`http://localhost:3000`**

---

### Opção B: Execução via Node.js / npm
Caso prefira executar via ambiente Node.js:
1. Instale as dependências:
   ```bash
   npm install
   ```
2. (Opcional) Inicialize o banco de dados:
   ```bash
   npm run init-db
   ```
3. Inicie o servidor:
   ```bash
   npm start
   ```
4. Acesse no navegador:
   👉 **`http://localhost:3000`**

---

## 🔌 5. Especificação dos Endpoints da API REST (Rubrica 4)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/disciplines` | Lista todas as disciplinas curriculares cadastradas |
| `GET` | `/api/topics?q=&discipline=` | Busca e filtra tópicos de conhecimento por texto ou matéria |
| `GET` | `/api/topics/:id` | Retorna o detalhe do tópico (teoria, mercado e código fonte) |
| `GET` | `/api/topics/:id/related` | Retorna o grafo de conteúdos correlatos interdisciplinares |
| `GET` | `/api/tracks` | Lista as trilhas de aprendizado e o percentual de conclusão |
| `GET` | `/api/tracks/:id` | Retorna os detalhes e tópicos sequenciais de uma trilha |
| `GET` | `/api/progress/:userId` | Consulta o progresso do aluno em todos os tópicos |
| `POST` | `/api/progress` | Atualiza o status do tópico (`a_fazer`, `em_andamento`, `concluido`) |
| `POST` | `/api/favorites/toggle` | Alterna a inclusão de uma trilha nos favoritos do aluno |
| `POST` | `/api/connections` | Cadastra uma nova ponte interdisciplinar (Painel do Curador) |

---

## 🎥 6. Vídeo de Demonstração (Rubrica 5)
- **Duração Máxima:** 1 minuto (60 segundos).
- **Roteiro Detalhado:** Consulte o arquivo [`docs/roteiro_video_1min.md`](docs/roteiro_video_1min.md) com as falas e ações exatas minuto a minuto.
- **Link do Vídeo Demonstrativo:** `[Adicionar link não-listado do YouTube ou link do arquivo MP4 aqui]`

---

## 📚 7. Referências Bibliográficas (Conforme 1ª Etapa)
- PRESSMAN, Roger S.; MAXIM, Bruce R. *Engenharia de software: uma abordagem profissional*. 9. ed. Porto Alegre: AMGH, 2021.
- SOMMERVILLE, Ian. *Engenharia de software*. 10. ed. São Paulo: Pearson Education do Brasil, 2019.
- VAZQUEZ, Carlos Eduardo; SIMÕES, Guilherme Siqueira. *Engenharia de requisitos: software orientado ao negócio*. Rio de Janeiro: Brasport, 2016.
- BRASIL. Ministério da Educação. *Base Nacional Comum Curricular*. Brasília: MEC, 2018.
