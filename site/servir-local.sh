#!/bin/sh
# Secours hors ligne : sert le site construit (dist/) depuis cette machine, sans réseau.
# Usage : ./servir-local.sh      (Ctrl+C pour arrêter)
cd "$(dirname "$0")" || exit 1
if [ ! -f dist/index.html ]; then
  echo ""
  echo "  dist/ est vide : lance d'abord   npm run build   (il faut le réseau pour ça, une fois)."
  echo ""
  exit 1
fi
cd dist || exit 1

# Premier port libre à partir de 8765, pour ne pas dépendre de ce qui tourne déjà.
PORT=8765
while ! python3 -c "import socket,sys; s=socket.socket(); s.bind(('127.0.0.1', $PORT)); s.close()" 2>/dev/null; do
  PORT=$((PORT + 1))
done
URL="http://localhost:$PORT/index.html"

echo ""
echo "  ================================================"
echo "   Site du cours :  $URL"
echo "   Laisse cette fenêtre ouverte. Ctrl+C pour arrêter."
echo "  ================================================"
echo ""

# Ouvre le navigateur par défaut une fois le serveur parti (macOS : open ; Linux : xdg-open).
( sleep 1; open "$URL" 2>/dev/null || xdg-open "$URL" 2>/dev/null ) &

exec python3 -m http.server "$PORT" --bind 127.0.0.1
