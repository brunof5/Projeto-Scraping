#!/bin/bash

# URL da página com a <ul> de classe 'accordion'
URL="https://www.ojogodobicho.com/palpite.htm"

# Nome do arquivo onde o conteúdo será salvo
OUTPUT_FILE="/app/palpite.html"

# Baixar a página
wget -O "$OUTPUT_FILE" "$URL"
