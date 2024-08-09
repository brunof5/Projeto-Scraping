#!/bin/bash

# URL da página com a <ul> de classe 'button-group'
URL="https://www.ojogodobicho.com/sonhosindice.htm"

# Nome do arquivo onde o conteúdo será salvo
OUTPUT_FILE="/app/sonho.html"

# Baixar a página
wget -O "$OUTPUT_FILE" "$URL"
