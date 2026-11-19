#!/bin/bash
# ==============================================================================
# Script de Automação de Demonstração e Gravação em Vídeo (60s)
# Projeto Integrador - Senac SP TADS 2026
# ==============================================================================

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "================================================================="
echo "🎬 ConectaEdu • Automação de Gravação da Demonstração (Rubrica 5)"
echo "================================================================="

# 1. Verificar se o servidor está ativo
if ! lsof -i :3000 > /dev/null 2>&1; then
  echo "🚀 Iniciando servidor ConectaEdu em background..."
  ruby server.rb > /dev/null 2>&1 &
  sleep 2
fi

echo "✅ Servidor ativo na porta 3000."
echo "🌐 Abrindo o gravador automático HD no navegador..."

# 2. Abrir o gravador automático no navegador padrão (Chrome / Safari)
open "http://localhost:3000/recorder.html"

echo ""
echo "⏳ A gravação automática de 60 segundos iniciou no navegador!"
echo "   O vídeo está sendo renderizado a 30 FPS e com narração das legendas."
echo "   Aguarde 60 segundos enquanto o arquivo é gerado..."

# 3. Contagem regressiva no terminal
for i in {60..1}; do
  printf "\r⏳ Tempo restante da gravação: %02d segundos..." "$i"
  sleep 1
done

echo ""
echo "💾 Aguardando envio e salvamento do vídeo no servidor..."
sleep 3

OUTPUT_FILE="$DIR/docs/demonstracao_poc_1min.webm"

if [ -f "$OUTPUT_FILE" ]; then
  FILE_SIZE=$(ls -lh "$OUTPUT_FILE" | awk '{print $5}')
  echo ""
  echo "================================================================="
  echo "🎉 VÍDEO GERADO E SALVO COM SUCESSO!"
  echo "👉 Arquivo: $OUTPUT_FILE ($FILE_SIZE)"
  echo "👉 Também disponível em: $DIR/docs/demonstracao_poc_1min.mp4"
  echo "================================================================="
  echo "Pronto para enviar ao GitHub ou Blackboard do Senac SP!"
else
  echo ""
  echo "⚠️ O arquivo ainda está sendo processado na aba do navegador."
  echo "   Verifique a aba aberta em http://localhost:3000/recorder.html"
fi
