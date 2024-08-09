from flask import Flask, jsonify
from data_processing import process_palpite_data

app = Flask(__name__)

input_file = '/app/palpite.html'

@app.route('/', methods=['GET'])
def get_palpite_data():
    data = process_palpite_data(input_file)
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4002)
