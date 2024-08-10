#!/bin/bash

# URL da página com os palpites, somente pegaremos o palpite de grupo
URL="https://www.ojogodobicho.com/palpite.htm"

# Nome e diretório do arquivo onde o conteúdo será salvo
OUTPUT_FILE="/app/palpite.html"

# Baixar a página
wget -O "$OUTPUT_FILE" "$URL"
