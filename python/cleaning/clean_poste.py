import requests
from bs4 import BeautifulSoup
import json

# Nome do arquivo HTML com os dados da tabela
input_file = '../scraping/poste.html'
# URL que o dataset será enviado
url = 'http://localhost:3000/jogo'

# Ler o conteúdo do arquivo
with open(input_file, 'r', encoding='utf-8') as file:
    soup = BeautifulSoup(file, 'html.parser')

# Encontrar o <p> com a classe 'text-poste'
p_element = soup.find('p', class_='text-poste')

# Verificar se o <p> foi encontrado
if p_element:
    # Encontrar a tabela imediatamente seguinte
    table = p_element.find_next_sibling('table')

    if table:
        tbody = table.find('tbody')
        rows = tbody.find_all('tr')[:5]  # Pegue as 5 primeiras linhas

        results = []

        for row in rows:
            columns = row.find_all('td')
            data = [col.get_text(strip=True) for col in columns]
            results.append(data)

        # Printar os resultados
        #for i, row_data in enumerate(results):
        #    print(f"Linha {i+1}: {row_data}")

        response = requests.post(url, json={'data': data})
        print(response.status_code, response.reason)

    else:
        print("Nenhuma tabela encontrada imediatamente após o <p> com a classe 'text-poste'.")

else:
    print("Nenhum elemento <p> com a classe 'text-poste' encontrado.")
    