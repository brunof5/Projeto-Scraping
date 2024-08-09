# Imagem de uma versão slim do python
FROM python:3.12-slim

# Atualizar pacotes e instalar ferramentas necessárias
RUN apt-get update && apt-get install -y bash nano wget cron tzdata \
    && rm -rf /var/lib/apt/lists/*

# Configurar o fuso horário
ENV TZ=America/Sao_Paulo

# Atualizar o fuso horário do container
RUN ln -fs /usr/share/zoneinfo/$TZ /etc/localtime \
    && dpkg-reconfigure --frontend noninteractive tzdata

# Instale as dependências do Python
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Copie os scripts para o container
COPY scraping /app/scraping
COPY cleaning /app/cleaning

# Adicione o arquivo crontab ao container
COPY crontab /etc/cron.d/log_cron

COPY init.sh /app/

# Dê permissão para os scripts e para o arquivo crontab
RUN chmod +x /app/scraping/scrape_palpite.sh \
    && chmod 0644 /etc/cron.d/log_cron

# Aplique as permissões e registre o cron no sistema
RUN crontab /etc/cron.d/log_cron

# Crie um diretório para logs
RUN mkdir -p /var/log \
    && chown root:root /var/log \
    && chmod 0755 /var/log

CMD ["/bin/bash", "/app/init.sh"]
