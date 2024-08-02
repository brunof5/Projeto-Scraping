#!/bin/bash

# URL da página com a tabela
URL="https://www.ojogodobicho.com/deu_no_poste.htm"

# Nome do arquivo onde o conteúdo será salvo
OUTPUT_FILE="poste.html"

# Baixar a página
wget -O "$OUTPUT_FILE" "$URL"
