# Imagem da versão mais recente do Node.js
FROM node:latest

# Define o diretório de trabalho dentro do container
WORKDIR /server

# Copia os scripts para o container
COPY app.js /server
COPY package-lock.json /server
COPY package.json /server
COPY html /server/html

# Define as váriaveis de ambiente, nesse caso a porta e o usuário/senha do e-mail que enviará notificações
ENV PORT=4000
ENV EMAIL_USER='jogo-do-bicho-notificacoes@hotmail.com'
ENV EMAIL_PASS=secret

# Instala as dependências do Node.js
RUN npm install

# Expõe a porta que o servidor utilizará
EXPOSE $PORT

# Comando para iniciar o servidor Node.js
CMD ["node", "app.js"]
