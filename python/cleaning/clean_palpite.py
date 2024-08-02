import requests
from bs4 import BeautifulSoup
import json

input_file = './palpite.html'
url = 'http://node-server:4000/palpite'

with open(input_file, 'r', encoding='utf-8') as file:
    soup = BeautifulSoup(file, 'html.parser')

p_tag = soup.find('p', string='Palpite grupo')
data = []
if p_tag:
    ul_tag = p_tag.find_next_sibling('ul', class_='inline-list')
    if ul_tag:
        list_items = ul_tag.find_all('li')
        data = [item.get_text(strip=True) for item in list_items]

        for i, item in enumerate(data):
            print(f"Item {i+1}: {item}")
        
        response = requests.post(url, json={'data': data})
        print(response.status_code, response.reason)
    else:
        print("Nenhuma <ul> com a classe 'inline-list' encontrada.")
else:
    print("Nenhum <p> com o texto 'Palpite grupo' encontrado.")
