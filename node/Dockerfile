# Imagem da versão mais recente do Node.js
FROM node:latest

# Instalar Git
RUN apt-get update && apt-get install -y git

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Define uma váriavel de ambiente, nesse caso a porta
# Fazendo isso podemos ler o valor da porta no nosso arquivo app.js utilizando process.env.PORT
ENV PORT=4000

# Clonar o repositório do servidor
RUN git clone https://github.com/brunof5/Projeto-Scraping.git .

# Mudar para o diretório src onde está o package.json
WORKDIR /app/src

# Instalar dependências do Node.js
RUN npm install

# Expor a porta que o servidor utilizará
EXPOSE $PORT

# Comando para iniciar o servidor Node.js
CMD ["node", "app.js"]
