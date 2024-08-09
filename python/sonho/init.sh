#!/bin/sh

/bin/bash /app/scraping/scrape_sonho.sh &
/usr/local/bin/python /app/cleaning/clean_sonho.py &
cron -f
