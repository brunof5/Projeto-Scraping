#!/bin/bash

# URL da página com os sonhos
URL="https://www.ojogodobicho.com/sonhosindice.htm"

# Nome e diretório do arquivo onde o conteúdo será salvo
OUTPUT_FILE="/app/sonho.html"

# Baixar a página
wget -O "$OUTPUT_FILE" "$URL"
