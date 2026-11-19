# Kit de Geração de Vídeo / Áudio no Google NotebookLM 🎙️🤖
### Projeto Integrador Senac SP – TADS 2026 (2ª Etapa - PoC Funcional)

Este guia e fonte de dados foram especialmente preparados para você utilizar no **Google NotebookLM** ([notebooklm.google.com](https://notebooklm.google.com)) e gerar a apresentação em áudio/vídeo da Prova de Conceito (PoC) atendendo à **Rubrica 5 (Vídeo de no máximo 1 minuto)**.

---

## 📌 Passo a Passo no Google NotebookLM:

1. Acesse **[notebooklm.google.com](https://notebooklm.google.com)** com sua conta Google.
2. Clique em **"Novo Notebook"** (ou *New Notebook*) e nomeie como: `ConectaEdu - PoC Senac SP`.
3. Adicione uma nova fonte clicando em **"Adicionar Fonte" ➔ "Texto Copiado"** (ou faça upload deste arquivo `notebooklm_kit.md`).
4. Cole todo o bloco de conteúdo abaixo (Seção "FONTE DE DADOS PARA O NOTEBOOKLM").
5. No painel direito, em **Guia do Notebook (Studio)**:
   - Clique em **"Visão Geral em Áudio" (Audio Overview)** ou **"Gerar Conversa / Resumo"**.
   - No campo de instruções personalizadas (Customize), cole o **PROMPT RECOMENDADO** que está logo abaixo.
6. O NotebookLM gerará a locução/podcast profissional em português destacando a equipe, o Senac e a validação da PoC em 1 minuto!

---

## 🎯 PROMPT RECOMENDADO PARA COLAR NO NOTEBOOKLM:

```text
Atue como os apresentadores acadêmicos do Senac SP apresentando a Prova de Conceito (PoC) "ConectaEdu" para o Prof. Msc. Anderson Clayton Garcia Lopes.
A apresentação deve ter exatamente 1 minuto de duração, com tom profissional, empolgado e objetivo em português do Brasil.
Destaque os seguintes pontos essenciais:
1. Identificação da equipe de Análise e Desenvolvimento de Sistemas (Jonathan, Renan, Tiago e Vanessa).
2. O problema da fragmentação do ensino e o isolamento entre Banco de Dados e Programação Web.
3. A jornada do estudante Lucas Mendes buscando "Modelagem de Banco de Dados Relacional" e recebendo a recomendação dinâmica do conteúdo correlato "Integração ORM em Aplicações Web".
4. A transposição prática do SQL para o Prisma ORM e rotas Express, com controle de status (A Fazer, Em Andamento, Concluído) persistido no banco SQLite.
5. A conclusão com o compartilhamento da trilha e responsividade mobile PWA, atendendo integralmente as rubricas da 2ª etapa.
```

---

## 📄 FONTE DE DADOS PARA O NOTEBOOKLM (COPIE A PARTIR DAQUI):

```markdown
# PROVA DE CONCEITO FUNCIONAL: CONECTAEDU
# Centro Universitário Senac SP – Campus EAD
# Curso: Tecnologia em Análise e Desenvolvimento de Sistemas (TADS)
# Componente: Projeto Integrador: Desenvolvimento de Sistemas Orientado a Dispositivos Móveis e Baseados na Web
# Avaliador: Prof. Msc. Anderson Clayton Garcia Lopes
# Alunos Desenvolvedores:
- Jonathan da Silva Cavalcanti
- Renan Duarte Coelho
- Tiago Alves dos Santos Canalli
- Vanessa Kolbe da Silva

## 1. RESUMO EXECUTIVO DA POC
O ConectaEdu é uma plataforma web responsiva e PWA desenvolvida para solucionar a fragmentação no aprendizado acadêmico. Ela quebra os silos entre disciplinas teóricas e práticas por meio de um grafo de conhecimentos e motor de recomendação interdisciplinar.

## 2. A JORNADA SELECIONADA PARA A POC (PERSONA LUCAS MENDES)
- Perfil: Lucas Mendes, 21 anos, 3º período de Análise e Desenvolvimento de Sistemas, estagiário de suporte.
- Problema vivenciado: Lucas estuda "Modelagem de Banco de Dados Relacional" (tabelas, chaves estrangeiras, DDL, normalização) e não enxerga como isso se conecta com o desenvolvimento de APIs na disciplina de Programação Web.
- Passo a Passo no Sistema:
  1. Busca Curricular: Lucas pesquisa "Modelagem de Banco de Dados Relacional" na barra de busca inteligente.
  2. Recomendação Interdisciplinar: O sistema renderiza o conteúdo conceitual e imediatamente exibe o painel lateral de "Conteúdos Correlatos Interdisciplinares".
  3. Ponte Prática: O motor sugere o tópico "Integração ORM em Aplicações Web", demonstrando como as tabelas do SQL ANSI são convertidas em Models Prisma/TypeORM e endpoints Express.
  4. Gestão de Ritmo e Progresso: Lucas clica em "Explorar Conexão Prática", altera o status do tópico para "Em Andamento" e depois para "Concluído". A barra de progresso da trilha avança de 0% para 100% com persistência em banco relacional SQLite.
  5. Favoritos e Compartilhamento: Lucas clica no ícone de estrela para favoritar a trilha e clica no botão "Compartilhar", gerando o link direto para seu grupo de trabalho.

## 3. ARQUITETURA TÉCNICA FULL-STACK (100% FUNCIONAL)
- Frontend: HTML5 Semântico, CSS3 Moderno com Mobile-First, PWA Ready (manifest.json e Service Worker com cache offline).
- Backend: RESTful API desenvolvida com rotas modulares (/api/topics, /api/topics/:id/related, /api/tracks, /api/progress, /api/favorites).
- Banco de Dados: SQLite3 relacional normalizado (tabelas: disciplinas, topicos, trilhas, trilha_topicos, conexoes_interdisciplinares, progresso_aluno, favoritos).

## 4. ROTEIRO DE DEMONSTRAÇÃO SEGUNDO A SEGUNDO (MÁXIMO DE 1 MINUTO)
- 00:00 - 00:10: Abertura pela equipe do Senac TADS, contextualizando o objetivo do ConectaEdu.
- 00:10 - 00:22: Busca por "Modelagem de Banco de Dados Relacional" e apresentação da interface do aluno.
- 00:22 - 00:35: Apresentação do painel de "Conteúdos Correlatos" e clique na recomendação da trilha "Integração ORM em Aplicações Web".
- 00:35 - 00:48: Demonstração da alteração de status para "Concluído" com atualização automática da barra de progresso persistida no banco SQLite.
- 00:48 - 00:55: Salvamento da trilha nos favoritos e abertura do modal de compartilhamento.
- 00:55 - 01:00: Fechamento comprovando a responsividade mobile e a entrega dos códigos no GitHub.
```
