#!/bin/bash

# URL da página com a tabela principal - deu no poste
URL="https://www.ojogodobicho.com/deu_no_poste.htm"

# Nome e diretório do arquivo onde o conteúdo será salvo
OUTPUT_FILE="/app/poste.html"

# Baixar a página
wget -O "$OUTPUT_FILE" "$URL"
