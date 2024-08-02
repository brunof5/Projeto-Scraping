# Imagem da versão 3.11-slim do Python
FROM python:3.11-slim

# Atualizar pacotes e instalar ferramentas necessárias
RUN apt-get update && apt-get install -y nano cron wget \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instale as dependências do Python
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Copie os scripts para o container
COPY scraping /app/scraping
COPY cleaning /app/cleaning

# Configure o crontab
COPY crontab /etc/cron.d/crontab

# Defina as permissões para os scripts de cron
RUN chmod 0644 /etc/cron.d/crontab \
    && crontab /etc/cron.d/crontab

# Crie um diretório para logs
RUN mkdir -p /var/log/cron

# Configuração para não executar cron, apenas abrir um terminal
CMD cron -f

# Como buildar e executar:
# docker build -t <nome desejado> .
# docker run --rm -it <nome>
# Observação: --rm serve para matar o container assim que ele parar,
# portanto use essa opção até antes de concluir o trabalho
