#!/bin/sh

# Executa os códigos de scraping e limpeza em segundo plano
/bin/bash /app/scraping/scrape_palpite.sh &
/usr/local/bin/python /app/cleaning/clean_palpite.py &
# Executa o cron em primeiro plano
cron -f
