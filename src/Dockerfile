# Imagem da versão mais recente do Node.js
FROM node:latest

# Instalar Git
RUN apt-get update && apt-get install -y git

# Definir o diretório de trabalho dentro do container
WORKDIR /server

# Copie os scripts para o container
COPY app.js /server
COPY package-lock.json /server
COPY package.json /server
COPY html /server/html

# Define uma váriavel de ambiente, nesse caso a porta
# Fazendo isso podemos ler o valor da porta no nosso arquivo app.js utilizando process.env.PORT
ENV PORT=4000
ENV EMAIL_USER='jogo-do-bicho-notificacoes@hotmail.com'
ENV EMAIL_PASS=secret

# Instalar dependências do Node.js
RUN npm install

# Expor a porta que o servidor utilizará
EXPOSE $PORT

# Comando para iniciar o servidor Node.js
CMD ["node", "app.js"]
