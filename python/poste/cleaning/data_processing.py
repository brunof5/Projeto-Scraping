from bs4 import BeautifulSoup

def process_poste_data(input_file):
    # Abre e lê o arquivo HTML, usando BeautifulSoup para fazer o parsing do conteúdo
    with open(input_file, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')

    # Encontra o <p> com a classe 'text-poste'
    p_element = soup.find('p', class_='text-poste')

    # Verifica se o <p> foi encontrado
    if not p_element:
        return {
            'success': 'false',
            'message':  "Nenhum elemento <p> com a classe 'text-poste' encontrado."
        }
    
    # Encontra a tabela que é o próximo irmão do <p>
    table = p_element.find_next_sibling('table')

    # Verifica se a tabela foi encontrada
    if not table:
        return {
            'success': 'false',
            'message': "Nenhuma tabela encontrada imediatamente após o <p> com a classe 'text-poste'."
        }
    
    # Encontra o <tbody> dentro da tabela e pega as 5 primeiras linhas
    tbody = table.find('tbody')
    rows = tbody.find_all('tr')[:5]

    # Cria um dicionário para armazenar os resultados
    results = {
        'success': 'true',
        'data': [[col.get_text(strip=True) for col in row.find_all('td')] for row in rows],
        'tipo': 'poste'
    }

    # Printa os resultados
    for i, row_data in enumerate(results['data']):
        print(f"Linha {i+1}: {row_data}")

    return results
