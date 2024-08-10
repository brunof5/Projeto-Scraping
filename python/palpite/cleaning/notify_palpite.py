import requests # Permite fazer requisições HTTP
from data_processing import process_palpite_data

input_file = '/app/palpite.html'

def notify_palpite():
    data = process_palpite_data(input_file)

    # Envia uma requisição POST para o servidor com os dados processados no formato JSON
    response = requests.post('http://node-server:4000/send-notifications', json=data)

    if response.status_code == 200:
        print("Dados enviados com sucesso")
    else:
        print("Erro ao enviar os dados: ", response.status_code, response.text)

if __name__ == '__main__':
    notify_palpite()