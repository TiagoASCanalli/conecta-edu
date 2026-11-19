/**
 * ConectaEdu - Controlador do Frontend
 * Implementação da Jornada da Persona Lucas Mendes (PoC 2ª Etapa)
 * Senac SP - TADS 2026
 */

const USER_ID = 'usr_lucas';
const DEFAULT_TRACK_ID = 'trilha_fullstack_orm';

let allTopics = [];
let currentTopic = null;
let currentTrack = null;
let userProgress = {}; // topicId -> status ('a_fazer', 'em_andamento', 'concluido')
let activeDiscipline = '';
let searchDebounce = null;

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();
  await loadUserProgress();
  await loadTrack(DEFAULT_TRACK_ID);
  await fetchTopics();
  
  // Inicia selecionando o tópico da jornada do Lucas: "Modelagem de Banco de Dados Relacional"
  selectTopic('top_bd_relacional');
});

// Configuração dos ouvintes de eventos
function setupEventListeners() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        fetchTopics(e.target.value.trim());
      }, 250);
    });
  }

  // Filtros de disciplina
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeDiscipline = btn.dataset.disc;
      fetchTopics(searchInput.value.trim());
    });
  });
}

// Carrega o progresso existente do usuário
async function loadUserProgress() {
  try {
    const res = await fetch(`/api/progress/${USER_ID}`);
    if (res.ok) {
      const data = await res.json();
      userProgress = {};
      data.forEach(item => {
        userProgress[item.topico_id] = item.status;
      });
    }
  } catch (err) {
    console.error('Erro ao carregar progresso:', err);
  }
}

// Busca tópicos da API
async function fetchTopics(query = '') {
  try {
    let url = `/api/topics?userId=${USER_ID}`;
    if (query) url += `&q=${encodeURIComponent(query)}`;
    if (activeDiscipline) url += `&discipline=${encodeURIComponent(activeDiscipline)}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Falha ao buscar tópicos');
    allTopics = await res.json();

    renderTopicList();
  } catch (err) {
    console.error(err);
    document.getElementById('topicListContainer').innerHTML = `
      <div style="color: #ef4444; font-size: 0.82rem; padding: 1rem; text-align: center;">
        Erro ao carregar tópicos. Verifique o servidor.
      </div>
    `;
  }
}

// Renderiza a lista de tópicos na coluna esquerda
function renderTopicList() {
  const container = document.getElementById('topicListContainer');
  const countEl = document.getElementById('topicCount');
  
  if (countEl) countEl.innerText = `${allTopics.length} tópico${allTopics.length !== 1 ? 's' : ''}`;

  if (allTopics.length === 0) {
    container.innerHTML = `
      <div style="padding: 1.5rem 1rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
        Nenhum tópico encontrado para os filtros selecionados.
      </div>
    `;
    return;
  }

  container.innerHTML = allTopics.map(t => {
    const status = userProgress[t.id] || 'a_fazer';
    const statusLabel = {
      'a_fazer': 'A Fazer',
      'em_andamento': 'Em Andamento',
      'concluido': '✓ Concluído'
    }[status] || 'A Fazer';

    const isActive = currentTopic && currentTopic.id === t.id ? 'active' : '';

    return `
      <div class="topic-item ${isActive}" onclick="selectTopic('${t.id}')">
        <div class="topic-item-header">
          <span class="topic-item-title">${escapeHtml(t.titulo)}</span>
          <span class="badge-status badge-${status}">${statusLabel}</span>
        </div>
        <div class="topic-item-disc">
          <span>${escapeHtml(t.disciplina_codigo)} • ${escapeHtml(t.disciplina_nome)}</span>
        </div>
      </div>
    `;
  }).join('');
}

// Seleciona um tópico e carrega detalhes e correlações interdisciplinares
async function selectTopic(topicId) {
  try {
    // 1. Detalhe do tópico
    const res = await fetch(`/api/topics/${topicId}`);
    if (!res.ok) throw new Error('Tópico não encontrado');
    currentTopic = await res.json();

    // 2. Atualizar UI da Coluna 2
    document.getElementById('detailTitle').innerText = currentTopic.titulo;
    document.getElementById('detailDiscBadge').innerText = currentTopic.disciplina_codigo;
    document.getElementById('detailDiscBadge').style.background = currentTopic.cor_tema || 'var(--primary)';
    document.getElementById('detailTime').innerText = `⏱️ ${currentTopic.tempo_estimado_minutos || 30} min estimados`;
    document.getElementById('detailTheory').innerText = currentTopic.resumo_teorico;
    document.getElementById('detailMarket').innerText = currentTopic.aplicacao_pratica;
    
    const codeEl = document.getElementById('detailCode');
    if (codeEl) {
      codeEl.innerHTML = `<code>${escapeHtml(currentTopic.codigo_exemplo || '// Nenhum código cadastrado')}</code>`;
    }

    // 3. Status atual do botão
    const currentStatus = userProgress[currentTopic.id] || 'a_fazer';
    updateStatusButtonsUI(currentStatus);

    // 4. Buscar e renderizar conteúdos correlatos (Coluna 3)
    await loadRelatedTopics(topicId);

    // 5. Destacar na lista
    renderTopicList();

    // Scroll suave em mobile se necessário
    if (window.innerWidth < 992) {
      document.getElementById('detailCard').scrollIntoView({ behavior: 'smooth' });
    }

  } catch (err) {
    console.error('Erro ao selecionar tópico:', err);
    showToast('Erro ao carregar detalhes do tópico', 'error');
  }
}

// Atualiza o visual dos botões de status
function updateStatusButtonsUI(status) {
  const btnTodo = document.getElementById('btnStatusTodo');
  const btnDoing = document.getElementById('btnStatusDoing');
  const btnDone = document.getElementById('btnStatusDone');
  const syncText = document.getElementById('statusSyncText');

  [btnTodo, btnDoing, btnDone].forEach(b => b.classList.remove('active'));

  if (status === 'em_andamento') {
    btnDoing.classList.add('active');
  } else if (status === 'concluido') {
    btnDone.classList.add('active');
  } else {
    btnTodo.classList.add('active');
  }

  if (syncText) syncText.innerText = 'Sincronizado com o Banco';
}

// Atualiza o status do tópico no Backend
async function updateTopicStatus(newStatus) {
  if (!currentTopic) return;

  const syncText = document.getElementById('statusSyncText');
  if (syncText) syncText.innerText = 'Salvando...';

  try {
    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: USER_ID,
        topicId: currentTopic.id,
        status: newStatus
      })
    });

    if (!res.ok) throw new Error('Falha ao atualizar status');

    userProgress[currentTopic.id] = newStatus;
    updateStatusButtonsUI(newStatus);
    renderTopicList();
    await loadTrack(DEFAULT_TRACK_ID); // recalcular progresso da trilha

    const label = {
      'a_fazer': 'marcado como "A Fazer"',
      'em_andamento': 'marcado como "Em Andamento" 🚀',
      'concluido': 'concluído com sucesso! 🎉'
    }[newStatus];

    showToast(`Tópico ${label}`);
  } catch (err) {
    console.error('Erro ao salvar status:', err);
    showToast('Erro ao atualizar progresso no servidor', 'error');
    if (syncText) syncText.innerText = 'Falha ao sincronizar';
  }
}

// Busca os conteúdos correlatos interdisciplinares (O Diferencial da PoC)
async function loadRelatedTopics(topicId) {
  const container = document.getElementById('relatedContainer');
  container.innerHTML = '<div style="font-size: 0.8rem; color: var(--text-muted); text-align: center; padding: 0.5rem;">Buscando conexões no grafo...</div>';

  try {
    const res = await fetch(`/api/topics/${topicId}/related`);
    if (!res.ok) throw new Error('Falha ao buscar correlações');
    const data = await res.json();

    if (!data.correlatos || data.correlatos.length === 0) {
      container.innerHTML = `
        <div style="font-size: 0.8rem; color: var(--text-muted); padding: 0.5rem; text-align: center;">
          Nenhum conteúdo correlato mapeado para este tópico ainda.
        </div>
      `;
      return;
    }

    container.innerHTML = data.correlatos.map(c => {
      const isOutgoing = c.direcao === 'destino';
      const arrowIcon = isOutgoing ? '➡️ Conecta com:' : '⬅️ Origem conectada:';

      return `
        <div class="related-card">
          <div style="font-size: 0.68rem; font-weight: 700; color: var(--senac-orange); margin-bottom: 0.2rem;">
            ${arrowIcon} ${escapeHtml(c.relacao_tipo)}
          </div>
          <div class="related-target-title">${escapeHtml(c.topico_relacionado_titulo)}</div>
          <div class="related-target-disc">${escapeHtml(c.disciplina_codigo)} • ${escapeHtml(c.disciplina_nome)}</div>
          
          <div class="bridge-explanation">
            <strong>Ponte Interdisciplinar:</strong> ${escapeHtml(c.explicacao_ponte)}
          </div>

          <button class="btn-explore-bridge" onclick="selectTopic('${c.topico_relacionado_id}')">
            <span>Explorar Conexão Prática</span>
            <span>➔</span>
          </button>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error(err);
    container.innerHTML = `
      <div style="font-size: 0.8rem; color: #ef4444; padding: 0.5rem; text-align: center;">
        Erro ao carregar conexões.
      </div>
    `;
  }
}

// Carrega os dados da Trilha de Aprendizado e seu percentual de conclusão
async function loadTrack(trackId) {
  try {
    const res = await fetch(`/api/tracks/${trackId}?userId=${USER_ID}`);
    if (!res.ok) return;
    currentTrack = await res.json();

    document.getElementById('trackTitle').innerText = currentTrack.titulo;
    document.getElementById('trackDesc').innerText = currentTrack.descricao;

    // Calcular progresso na trilha
    const total = currentTrack.topicos ? currentTrack.topicos.length : 0;
    let completed = 0;
    if (currentTrack.topicos) {
      currentTrack.topicos.forEach(t => {
        if (userProgress[t.id] === 'concluido') {
          completed++;
        }
      });
    }

    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    const barEl = document.getElementById('trackProgressBar');
    const textEl = document.getElementById('trackProgressText');
    const percentEl = document.getElementById('trackProgressPercent');

    if (barEl) barEl.style.width = `${percent}%`;
    if (textEl) textEl.innerText = `${completed} de ${total} tópicos concluídos`;
    if (percentEl) percentEl.innerText = `${percent}%`;

  } catch (err) {
    console.error('Erro ao carregar trilha:', err);
  }
}

// Alterna favoritar a trilha
async function toggleFavorite() {
  const btn = document.getElementById('btnFav');
  try {
    const res = await fetch('/api/favorites/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: USER_ID, trackId: DEFAULT_TRACK_ID })
    });
    const data = await res.json();
    if (data.favoritado) {
      btn.innerText = '⭐';
      showToast('Trilha salva nos seus favoritos! 🌟');
    } else {
      btn.innerText = '☆';
      showToast('Trilha removida dos favoritos.');
    }
  } catch (err) {
    console.error(err);
  }
}

// Busca rápida ao clicar nas tags de sugestão
function quickSearch(term) {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.value = term;
    fetchTopics(term);
  }
}

// Copiar código de exemplo
function copyCode() {
  if (!currentTopic || !currentTopic.codigo_exemplo) return;
  navigator.clipboard.writeText(currentTopic.codigo_exemplo).then(() => {
    const btn = document.getElementById('copyCodeBtn');
    btn.innerText = '✓ Copiado!';
    setTimeout(() => { btn.innerText = '📋 Copiar'; }, 2000);
    showToast('Código copiado para a área de transferência!');
  });
}

// Modal de Compartilhamento da Trilha (Passo 6 da Jornada do Lucas)
function openShareModal() {
  const modal = document.getElementById('shareModal');
  const input = document.getElementById('shareLinkInput');
  const successMsg = document.getElementById('copySuccessMsg');
  
  if (input) {
    input.value = `${window.location.origin}/?track=${DEFAULT_TRACK_ID}&ref=lucas_mendes`;
  }
  if (successMsg) successMsg.style.display = 'none';
  if (modal) modal.classList.add('active');
}

function closeShareModal() {
  const modal = document.getElementById('shareModal');
  if (modal) modal.classList.remove('active');
}

function copyShareLink() {
  const input = document.getElementById('shareLinkInput');
  const successMsg = document.getElementById('copySuccessMsg');
  if (input) {
    navigator.clipboard.writeText(input.value).then(() => {
      if (successMsg) successMsg.style.display = 'block';
      showToast('Link da trilha copiado! Pronto para compartilhar no grupo.');
    });
  }
}

// Notificações Toast amigáveis
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'error') {
    toast.style.borderLeftColor = '#ef4444';
  }
  toast.innerText = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Escape de HTML para segurança
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
