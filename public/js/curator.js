/**
 * ConectaEdu - Painel do Curador / Docente
 * Persona 2: Prof.ª Dra. Carla Silveira
 * Senac SP - TADS 2026
 */

document.addEventListener('DOMContentLoaded', async () => {
  await loadTopicOptions();
  await loadExistingConnections();
  setupFormHandler();
});

let topicsMap = {};

async function loadTopicOptions() {
  try {
    const res = await fetch('/api/topics');
    if (!res.ok) throw new Error('Erro ao listar tópicos');
    const topics = await res.json();

    const selectOrigin = document.getElementById('selectOrigin');
    const selectDest = document.getElementById('selectDest');

    topics.forEach(t => {
      topicsMap[t.id] = t;
      const opt1 = new Option(`${t.disciplina_codigo} - ${t.titulo}`, t.id);
      const opt2 = new Option(`${t.disciplina_codigo} - ${t.titulo}`, t.id);
      selectOrigin.add(opt1);
      selectDest.add(opt2);
    });

  } catch (err) {
    console.error('Erro ao carregar tópicos:', err);
    showToast('Erro ao carregar lista de tópicos', 'error');
  }
}

async function loadExistingConnections() {
  const tbody = document.getElementById('connectionsTableBody');
  tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Carregando conexões...</td></tr>';

  try {
    const res = await fetch('/api/topics');
    const topics = await res.json();
    
    let allConns = [];
    for (const t of topics) {
      const relRes = await fetch(`/api/topics/${t.id}/related`);
      if (relRes.ok) {
        const relData = await relRes.json();
        if (relData.correlatos) {
          relData.correlatos.forEach(c => {
            if (c.direcao === 'destino') {
              allConns.push({
                origem_titulo: t.titulo,
                origem_disc: t.disciplina_codigo,
                destino_titulo: c.topico_relacionado_titulo,
                destino_disc: c.disciplina_codigo,
                relacao_tipo: c.relacao_tipo,
                explicacao: c.explicacao_ponte
              });
            }
          });
        }
      }
    }

    if (allConns.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Nenhuma conexão cadastrada.</td></tr>';
      return;
    }

    tbody.innerHTML = allConns.map(c => `
      <tr>
        <td><strong>${escapeHtml(c.origem_disc)}</strong><br>${escapeHtml(c.origem_titulo)}</td>
        <td><strong>${escapeHtml(c.destino_disc)}</strong><br>${escapeHtml(c.destino_titulo)}</td>
        <td><span class="badge-status badge-em_andamento">${escapeHtml(c.relacao_tipo)}</span></td>
        <td>${escapeHtml(c.explicacao)}</td>
      </tr>
    `).join('');

  } catch (err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:red;">Erro ao listar conexões.</td></tr>';
  }
}

function setupFormHandler() {
  const form = document.getElementById('newConnectionForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const originId = document.getElementById('selectOrigin').value;
    const destId = document.getElementById('selectDest').value;
    const relationType = document.getElementById('relationType').value;
    const explanation = document.getElementById('explanation').value.trim();
    const example = document.getElementById('example').value.trim();

    if (originId === destId) {
      showToast('O tópico de origem não pode ser igual ao tópico de destino!', 'error');
      return;
    }

    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originId,
          destinationId: destId,
          relationType,
          explanation,
          example
        })
      });

      if (!res.ok) throw new Error('Falha ao salvar conexão');

      showToast('Ponte interdisciplinar salva com sucesso! 🚀');
      form.reset();
      await loadExistingConnections();

    } catch (err) {
      console.error(err);
      showToast('Erro ao cadastrar ponte no servidor', 'error');
    }
  });
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'error') toast.style.borderLeftColor = '#ef4444';
  toast.innerText = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
