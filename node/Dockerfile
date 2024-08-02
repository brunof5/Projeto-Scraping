# Imagem da versão mais recente do Node.js
FROM node:latest

# Instalar Git
RUN apt-get update && apt-get install -y git

# Definir o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Define uma váriavel de ambiente, nesse caso a porta
# Fazendo isso podemos ler o valor da porta no nosso arquivo app.js utilizando process.env.PORT
ENV PORT=4000

# Clonar o repositório do servidor
RUN git clone <definir git> .

# Instalar dependências do Node.js
RUN npm install

# Expor a porta que o servidor utilizará
EXPOSE $PORT

# Comando para iniciar o servidor Node.js
CMD ["node", "app.js"]

# Como buildar e executar:
# docker build -t <nome desejado> .
# docker run --rm -it -p 8000:3152 <nome>
# -p [porta externa, máquina host]:[porta interna, container]
