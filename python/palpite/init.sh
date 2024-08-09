#!/bin/sh

/bin/bash /app/scraping/scrape_palpite.sh &
/usr/local/bin/python /app/cleaning/clean_palpite.py &
cron -f
