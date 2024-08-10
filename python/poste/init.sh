#!/bin/sh

# Executa os códigos de scraping e limpeza em segundo plano
/bin/bash /app/scraping/scrape_poste.sh &
/usr/local/bin/python /app/cleaning/clean_poste.py &
# Executa o cron em primeiro plano
cron -f
