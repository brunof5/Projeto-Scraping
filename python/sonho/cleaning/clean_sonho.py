from flask import Flask, jsonify    # Cria uma API
from data_processing import process_sonho_data

app = Flask(__name__)

# Nome do arquivo HTML com os dados dos sonhos
input_file = '/app/sonho.html'

# Define uma rota GET para o endpoint raiz da aplicação, retorna um JSON dos dados processados
@app.route('/', methods=['GET'])
def get_sonho_data():
    data = process_sonho_data(input_file)
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4003)  # Inicia o servidor Flask, escutando em todas as interfaces (0.0.0.0) na porta 4003
    