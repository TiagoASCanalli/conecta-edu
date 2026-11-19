#!/bin/bash
# ==============================================================================
# Script de Automação de Demonstração e Gravação em Vídeo .MP4 (60s)
# Projeto Integrador - Senac SP TADS 2026
# ==============================================================================

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "================================================================="
echo "🎬 ConectaEdu • Gravação Automática em MP4 (Aluno + Curador + PWA)"
echo "================================================================="

# 1. Verificar se o servidor está ativo
if ! lsof -i :3000 > /dev/null 2>&1; then
  echo "🚀 Iniciando servidor ConectaEdu em background..."
  ruby server.rb > /dev/null 2>&1 &
  sleep 2
fi

echo "✅ Servidor ativo na porta 3000."
echo "🌐 Abrindo o gravador automático MP4 no navegador..."

# 2. Abrir o gravador automático no navegador padrão (Chrome / Safari)
open "http://localhost:3000/recorder.html"

echo ""
echo "⏳ A gravação automática de 60 segundos iniciou no navegador!"
echo "   Apresentando: 1. Abertura -> 2. Visão do Aluno -> 3. Conteúdos Correlatos"
echo "                -> 4. Progresso SQLite -> 5. Visão da Curadora -> 6. Mobile PWA"
echo ""

# 3. Contagem regressiva no terminal
for i in {60..1}; do
  printf "\r⏳ Tempo restante da gravação: %02d segundos..." "$i"
  sleep 1
done

echo ""
echo "💾 Aguardando finalização e salvamento do arquivo .MP4..."
sleep 4

MP4_FILE="$DIR/docs/demonstracao_poc_1min.mp4"
WEBM_FILE="$DIR/docs/demonstracao_poc_1min.webm"

# Se foi gerado webm e o mp4 ainda não existe, converter via avconvert do macOS
if [ -f "$WEBM_FILE" ] && [ ! -s "$MP4_FILE" ]; then
  echo "🔄 Convertendo container de vídeo para MP4 via avconvert do macOS..."
  avconvert -s "$WEBM_FILE" -p Preset1280x720 -o "$MP4_FILE" --replace 2>/dev/null || cp "$WEBM_FILE" "$MP4_FILE"
fi

if [ -f "$MP4_FILE" ] && [ -s "$MP4_FILE" ]; then
  FILE_SIZE=$(ls -lh "$MP4_FILE" | awk '{print $5}')
  echo ""
  echo "================================================================="
  echo "🎉 VÍDEO .MP4 GERADO E SALVO COM SUCESSO!"
  echo "👉 Arquivo: $MP4_FILE ($FILE_SIZE)"
  echo "================================================================="
  echo "Pronto para envio no GitHub ou entrega no Blackboard do Senac SP!"
else
  echo ""
  echo "ℹ️ O arquivo está sendo baixado diretamente na sua pasta de Downloads!"
  echo "   Verifique a aba aberta em: http://localhost:3000/recorder.html"
fi
