from flask import Flask, jsonify
from data_processing import process_poste_data

app = Flask(__name__)

# Nome do arquivo HTML com os dados da tabela
input_file = '/app/poste.html'
    
@app.route('/', methods=['GET'])
def get_poste_data():
    data = process_poste_data(input_file)
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4001)