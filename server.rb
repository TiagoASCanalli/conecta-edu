#!/usr/bin/env ruby
# encoding: UTF-8
# ==============================================================================
# ConectaEdu - Servidor Web & API RESTful Nativo (Zero Dependências Adicionais)
# Projeto Integrador - Senac SP - TADS 2026
# Equipe: Jonathan da Silva Cavalcanti, Renan Duarte Coelho,
#         Tiago Alves dos Santos Canalli, Vanessa Kolbe da Silva
# Orientador: Prof. Msc Anderson Clayton Garcia Lopes
# ==============================================================================

require 'webrick'
require 'sqlite3'
require 'json'
require 'uri'
require 'fileutils'

PORT = (ENV['PORT'] || 3000).to_i
DB_PATH = File.expand_path('database.sqlite', __dir__)
PUBLIC_DIR = File.expand_path('public', __dir__)
DOCS_DIR = File.expand_path('docs', __dir__)

MIME_TYPES = {
  '.html' => 'text/html; charset=utf-8',
  '.css'  => 'text/css; charset=utf-8',
  '.js'   => 'application/javascript; charset=utf-8',
  '.json' => 'application/json; charset=utf-8',
  '.svg'  => 'image/svg+xml',
  '.ico'  => 'image/x-icon',
  '.png'  => 'image/png',
  '.jpg'  => 'image/jpeg',
  '.jpeg' => 'image/jpeg',
  '.webm' => 'video/webm',
  '.mp4'  => 'video/mp4'
}.freeze

# Verificação e Inicialização do Banco se necessário
unless File.exist?(DB_PATH)
  puts "🔄 Banco database.sqlite não encontrado. Executando schema e seed..."
  db = SQLite3::Database.new(DB_PATH)
  db.execute_batch(File.read(File.expand_path('database/schema.sql', __dir__)))
  db.execute_batch(File.read(File.expand_path('database/seed.sql', __dir__)))
  db.close
  puts "✅ Banco inicializado com sucesso!"
end

server = WEBrick::HTTPServer.new(
  Port: PORT,
  Logger: WEBrick::Log.new($stderr, WEBrick::Log::INFO),
  AccessLog: []
)

trap('INT') { server.shutdown }
trap('TERM') { server.shutdown }

def json_response(res, data, status = 200)
  res.status = status
  res['Content-Type'] = 'application/json; charset=utf-8'
  res['Access-Control-Allow-Origin'] = '*'
  res['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
  res['Access-Control-Allow-Headers'] = 'Content-Type'
  res.body = JSON.generate(data)
end

def get_db
  db = SQLite3::Database.new(DB_PATH)
  db.results_as_hash = true
  db
end

# Roteador da API
server.mount_proc '/api' do |req, res|
  if req.request_method == 'OPTIONS'
    res.status = 200
    res['Access-Control-Allow-Origin'] = '*'
    res['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    res['Access-Control-Allow-Headers'] = 'Content-Type'
    next
  end

  path = req.path.sub(%r{^/api/?}, '')
  db = get_db

  begin
    case req.request_method
    when 'GET'
      if path == 'disciplines'
        rows = db.execute("SELECT * FROM disciplinas ORDER BY periodo, nome")
        json_response(res, rows)

      elsif path == 'topics'
        q = req.query['q']
        discipline = req.query['discipline']
        sql = %{
          SELECT t.*, d.nome AS disciplina_nome, d.codigo AS disciplina_codigo, d.cor_tema
          FROM topicos t
          JOIN disciplinas d ON t.disciplina_id = d.id
          WHERE 1=1
        }
        params = []
        if q && !q.strip.empty?
          sql += " AND (t.titulo LIKE ? OR t.resumo_teorico LIKE ? OR t.tags LIKE ?)"
          term = "%#{q.strip}%"
          params.concat([term, term, term])
        end
        if discipline && !discipline.strip.empty?
          sql += " AND t.disciplina_id = ?"
          params << discipline.strip
        end
        sql += " ORDER BY t.titulo ASC"
        rows = db.execute(sql, params)
        json_response(res, rows)

      elsif path =~ %r{^topics/([^/]+)/related$}
        id = $1
        outgoing = db.execute(%{
          SELECT 
            c.id AS conexao_id, c.relacao_tipo, c.explicacao_ponte, c.exemplo_integracao,
            'destino' AS direcao,
            t.id AS topico_relacionado_id, t.titulo AS topico_relacionado_titulo,
            t.resumo_teorico, t.aplicacao_pratica,
            d.nome AS disciplina_nome, d.codigo AS disciplina_codigo, d.cor_tema
          FROM conexoes_interdisciplinares c
          JOIN topicos t ON c.topico_destino_id = t.id
          JOIN disciplinas d ON t.disciplina_id = d.id
          WHERE c.topico_origem_id = ?
        }, [id])

        incoming = db.execute(%{
          SELECT 
            c.id AS conexao_id, c.relacao_tipo, c.explicacao_ponte, c.exemplo_integracao,
            'origem' AS direcao,
            t.id AS topico_relacionado_id, t.titulo AS topico_relacionado_titulo,
            t.resumo_teorico, t.aplicacao_pratica,
            d.nome AS disciplina_nome, d.codigo AS disciplina_codigo, d.cor_tema
          FROM conexoes_interdisciplinares c
          JOIN topicos t ON c.topico_origem_id = t.id
          JOIN disciplinas d ON t.disciplina_id = d.id
          WHERE c.topico_destino_id = ?
        }, [id])

        json_response(res, { topico_id: id, correlatos: outgoing + incoming })

      elsif path =~ %r{^topics/([^/]+)$}
        id = $1
        row = db.get_first_row(%{
          SELECT t.*, d.nome AS disciplina_nome, d.codigo AS disciplina_codigo, d.cor_tema
          FROM topicos t
          JOIN disciplinas d ON t.disciplina_id = d.id
          WHERE t.id = ?
        }, [id])
        if row
          json_response(res, row)
        else
          json_response(res, { error: 'Tópico não encontrado' }, 404)
        end

      elsif path == 'tracks'
        user_id = req.query['userId'] || 'usr_lucas'
        rows = db.execute(%{
          SELECT tr.*, 
            COUNT(tt.topico_id) AS total_topicos,
            CASE WHEN fav.id IS NOT NULL THEN 1 ELSE 0 END AS favoritado
          FROM trilhas tr
          LEFT JOIN trilha_topicos tt ON tr.id = tt.trilha_id
          LEFT JOIN favoritos fav ON tr.id = fav.trilha_id AND fav.usuario_id = ?
          GROUP BY tr.id
        }, [user_id])

        rows.each do |row|
          count_row = db.get_first_row(%{
            SELECT COUNT(p.id) as count
            FROM trilha_topicos tt
            JOIN progresso_aluno p ON tt.topico_id = p.topico_id
            WHERE tt.trilha_id = ? AND p.usuario_id = ? AND p.status = 'concluido'
          }, [row['id'], user_id])
          done = count_row ? count_row['count'] : 0
          row['topicos_concluidos'] = done
          total = row['total_topicos'].to_i
          row['progresso_percentual'] = total > 0 ? ((done.to_f / total) * 100).round : 0
        end

        json_response(res, rows)

      elsif path =~ %r{^tracks/([^/]+)$}
        id = $1
        user_id = req.query['userId'] || 'usr_lucas'
        trilha = db.get_first_row("SELECT * FROM trilhas WHERE id = ?", [id])
        if trilha
          topicos = db.execute(%{
            SELECT 
              t.*, tt.ordem,
              d.nome AS disciplina_nome, d.codigo AS disciplina_codigo, d.cor_tema,
              COALESCE(p.status, 'a_fazer') AS status_progresso
            FROM trilha_topicos tt
            JOIN topicos t ON tt.topico_id = t.id
            JOIN disciplinas d ON t.disciplina_id = d.id
            LEFT JOIN progresso_aluno p ON t.id = p.topico_id AND p.usuario_id = ?
            WHERE tt.trilha_id = ?
            ORDER BY tt.ordem ASC
          }, [user_id, id])
          trilha['topicos'] = topicos
          json_response(res, trilha)
        else
          json_response(res, { error: 'Trilha não encontrada' }, 404)
        end

      elsif path =~ %r{^progress/([^/]+)$}
        user_id = $1
        rows = db.execute(%{
          SELECT p.*, t.titulo AS topico_titulo
          FROM progresso_aluno p
          JOIN topicos t ON p.topico_id = t.id
          WHERE p.usuario_id = ?
        }, [user_id])
        json_response(res, rows)

      else
        json_response(res, { error: 'Rota não encontrada' }, 404)
      end

    when 'POST'
      if path == 'save-video'
        FileUtils.mkdir_p(DOCS_DIR)
        webm_path = File.join(DOCS_DIR, 'demonstracao_poc_1min.webm')
        mp4_path = File.join(DOCS_DIR, 'demonstracao_poc_1min.mp4')

        bytes = req.body || ''
        File.binwrite(webm_path, bytes)
        File.binwrite(mp4_path, bytes) rescue nil

        puts "================================================================="
        puts "✅ VÍDEO DA POC SALVO COM SUCESSO!"
        puts "👉 Arquivo: #{webm_path} (#{bytes.bytesize} bytes)"
        puts "================================================================="

        json_response(res, {
          success: true,
          message: 'Vídeo gravado e salvo com sucesso na pasta docs!',
          file: 'docs/demonstracao_poc_1min.webm',
          size_bytes: bytes.bytesize
        }, 201)
        next
      end

      body = {}
      if req.body && !req.body.strip.empty?
        begin
          body = JSON.parse(req.body)
        rescue => _
          body = {}
        end
      end

      if path == 'progress'
        user_id = body['userId'] || 'usr_lucas'
        topic_id = body['topicId']
        status = body['status']

        unless topic_id && ['a_fazer', 'em_andamento', 'concluido'].include?(status)
          json_response(res, { error: 'topicId e status válidos são obrigatórios' }, 400)
          next
        end

        existing = db.get_first_row("SELECT id FROM progresso_aluno WHERE usuario_id = ? AND topico_id = ?", [user_id, topic_id])
        if existing
          db.execute("UPDATE progresso_aluno SET status = ?, atualizado_em = CURRENT_TIMESTAMP WHERE id = ?", [status, existing['id']])
        else
          db.execute("INSERT INTO progresso_aluno (usuario_id, topico_id, status) VALUES (?, ?, ?)", [user_id, topic_id, status])
        end

        json_response(res, { success: true, userId: user_id, topicId: topic_id, status: status })

      elsif path == 'favorites/toggle'
        user_id = body['userId'] || 'usr_lucas'
        track_id = body['trackId']

        unless track_id
          json_response(res, { error: 'trackId é obrigatório' }, 400)
          next
        end

        existing = db.get_first_row("SELECT id FROM favoritos WHERE usuario_id = ? AND trilha_id = ?", [user_id, track_id])
        if existing
          db.execute("DELETE FROM favoritos WHERE id = ?", [existing['id']])
          json_response(res, { favoritado: false, message: 'Trilha removida dos favoritos' })
        else
          db.execute("INSERT INTO favoritos (usuario_id, trilha_id) VALUES (?, ?)", [user_id, track_id])
          json_response(res, { favoritado: true, message: 'Trilha favoritada com sucesso!' })
        end

      elsif path == 'connections'
        origin_id = body['originId']
        dest_id = body['destinationId']
        rel_type = body['relationType']
        explanation = body['explanation']
        example = body['example']

        unless origin_id && dest_id && rel_type && explanation
          json_response(res, { error: 'Campos obrigatórios ausentes' }, 400)
          next
        end

        id = "cx_#{Time.now.to_i}"
        db.execute(%{
          INSERT INTO conexoes_interdisciplinares 
          (id, topico_origem_id, topico_destino_id, relacao_tipo, explicacao_ponte, exemplo_integracao)
          VALUES (?, ?, ?, ?, ?, ?)
        }, [id, origin_id, dest_id, rel_type, explanation, example])

        json_response(res, { success: true, id: id }, 201)

      else
        json_response(res, { error: 'Rota POST não encontrada' }, 404)
      end
    end
  rescue => e
    json_response(res, { error: e.message, backtrace: e.backtrace.first(3) }, 500)
  ensure
    db.close rescue nil
  end
end

# Servidor de Arquivos Estáticos com Leitura em Memória
server.mount_proc '/' do |req, res|
  next if req.path.start_with?('/api')

  clean_path = req.path.split('?').first
  rel_path = (clean_path == '/' || clean_path == '') ? 'index.html' : clean_path.sub(%r{^/}, '')
  
  # Se for requisição para documentos na pasta docs
  if rel_path.start_with?('docs/')
    file_path = File.expand_path(rel_path, __dir__)
  else
    file_path = File.expand_path(rel_path, PUBLIC_DIR)
  end

  if File.file?(file_path)
    ext = File.extname(file_path).downcase
    res.status = 200
    res['Content-Type'] = MIME_TYPES[ext] || 'application/octet-stream'
    res['Cache-Control'] = 'no-cache'
    res.body = File.binread(file_path)
  else
    res.status = 404
    res['Content-Type'] = 'text/html; charset=utf-8'
    res.body = "<h1>404 Não Encontrado</h1><p>Recurso não encontrado: #{req.path}</p>"
  end
end

puts "================================================================="
puts "🚀 ConectaEdu - Servidor Nativo Iniciado na porta #{PORT}"
puts "👉 Acesse no navegador: http://localhost:#{PORT}"
puts "👉 Gravador Automático: http://localhost:#{PORT}/recorder.html"
puts "================================================================="

server.start
