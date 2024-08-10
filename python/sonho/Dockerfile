# Imagem de uma versão slim do python (a mais atual durante a realização do trabalho)
FROM python:3.12-slim

# Atualiza os pacotes e instala as ferramentas necessárias
RUN apt-get update && apt-get install -y bash nano wget cron tzdata \
    && rm -rf /var/lib/apt/lists/*

# Configura o fuso horário
ENV TZ=America/Sao_Paulo

# Atualiza o fuso horário do container
RUN ln -fs /usr/share/zoneinfo/$TZ /etc/localtime \
    && dpkg-reconfigure --frontend noninteractive tzdata

# Instala as dependências do Python
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Copia os scripts para o container
COPY scraping /app/scraping
COPY cleaning /app/cleaning

# Adiciona o arquivo crontab ao container
COPY crontab /etc/cron.d/log_cron

COPY init.sh /app/

# Dá permissão para os scripts e para o arquivo crontab
RUN chmod +x /app/scraping/scrape_sonho.sh \
    && chmod 0644 /etc/cron.d/log_cron

# Aplica as permissões e registra o cron no sistema
RUN crontab /etc/cron.d/log_cron

# Cria um diretório para logs
RUN mkdir -p /var/log \
    && chown root:root /var/log \
    && chmod 0755 /var/log

CMD ["/bin/bash", "/app/init.sh"]
