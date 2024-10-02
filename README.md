# Sistema de Notificação e Análise de Dados

![Static Badge](https://img.shields.io/badge/GCC129-UFLA-green)
![Static Badge](https://img.shields.io/badge/Sistemas_Distribu%C3%ADdos-Projeto_Pr%C3%A1tico-blue)
![Static Badge](https://img.shields.io/badge/2024%2F1-gray)

![Static Badge](https://img.shields.io/badge/version-v0.3.2-blue)

![Static Badge](https://img.shields.io/badge/HTML5-red)
![Static Badge](https://img.shields.io/badge/CSS3-blue)
![Static Badge](https://img.shields.io/badge/JavaScript-yellow)

![Static Badge](https://img.shields.io/badge/Docker-blue)
![Static Badge](https://img.shields.io/badge/Python_Module-3.12%20slim-blue)
![Static Badge](https://img.shields.io/badge/Node_Module-node%20latest-blue)

## 1. Requisitos do Sistema

### a. Scrape usando Bash para download

scrape_palpite.sh, scrape_poste.sh e scrape_sonho.sh

### b. Data cleaning usando Python

clean_palpite.py, clean_poste.py e clean_sonho.py

Os códigos listados acima possuem o arquivo data_processing.py individualmente.

### c. Enviar dataset para servidor Node

* Palpite:
  * crontab a cada 6 horas
  * Executa scrape_palpite.sh e notify_palpite.py
* Poste:
  * crontab às 9:36, 11:36, 14:36, 16:36, 19:36 e 21:36 diariamente
  * Executa scrape_poste.sh e notify_poste.py
* Sonho:
  * crontab às 08:00 diariamente
  * Executa scrape_sonho.sh e notify_sonho.py

O dataset é um dicionário.

### d. Exibir gráficos no servidor Node

Acessível por meio do arquivo poste.html

palpite.html e sonho.html não possuem gráficos, somente apresentam os dados aos usuários.

### e. Enviar notificação para cliente para evento cadastrado

O cliente pode realizar um cadastro pelo arquivo cadastro.html

Somente a via de notificação por e-mail foi implementada, utilizando o nodemailer.

### f. Bônus: Uso de IA

O projeto não utiliza IA.

## 2. Containers Docker

### A. Módulo Python

Há 3 containers python que realizam funcionalidades diferentes, porém possuem praticamente o mesmo Dockerfile.

Foi utilizado um container para cada funcionalidade python para imitar uma distribuição de microserviços.

Cada container roda uma API Flask que permite iniciar o microserviço em uma porta específica.

* Portas:
  * Palpite: 4002
  * Poste: 4001
  * Sonho: 4003

Os containers python se comunicam com o container node pela rede brigde estabelecida dentro do docker-compose.yml

### B. Módulo Node.js Server

Este container executa na porta 4000.

É onde o usuário fará o cadastro de notificação e observação dos dados.

Não foi implementado um banco de dados, portanto os dados cadastrados do usuário e os dados das funcionalidades não são salvos.

O container possui uma variável global que armazena os dados das funcionalidades atuais, porém ela é somente uma "representação" de um banco de dados, ou seja, não tem papel realmente importante no código.

A resposta dos dados das funcionalidades é feito sob demanda do usuário. Portanto, se porventura haver uma implementação furuta de banco de dados, tenha em mente que deve ser armazenado os datasets respeitando os **crontabs**, logo a consulta mudaria para o banco de dados ao invés de sob demanda do usuário.

## 3. Como Executar o Projeto

Basta estar na pasta principal do projeto e escrever no terminal:

```
docker compose up --build
```

O projeto será executado, porém não será 100% funcional, pois necessita de que EMAIL_USER e EMAIL_PASS sejam valores válidos no arquivo Dockerfile do Módulo Node.js Server.

Você pode utilizar seu próprio e-mail e senha, se desejar.
