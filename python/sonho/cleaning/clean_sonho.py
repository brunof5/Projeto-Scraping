from flask import Flask, jsonify
from data_processing import process_sonho_data

app = Flask(__name__)

input_file = '/app/sonho.html'

@app.route('/', methods=['GET'])
def get_sonho_data():
    data = process_sonho_data(input_file)
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4003)
    