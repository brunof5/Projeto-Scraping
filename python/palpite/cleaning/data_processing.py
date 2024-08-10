from bs4 import BeautifulSoup

def process_palpite_data(input_file):
    # Abre e lê o arquivo HTML, usando BeautifulSoup para fazer o parsing do conteúdo
    with open(input_file, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')

    # Encontra o elemento <p> com o texto exato 'Palpite grupo'
    p_tag = soup.find('p', string='Palpite grupo')

    # Verifica se o <p> foi encontrado
    if not p_tag:
        return {
            'success': 'false',
            'message': "Nenhum <p> com o texto 'Palpite grupo' encontrado."
        }
    
    # Encontra o próximo elemento <ul> com a classe 'inline-list' que segue o <p>
    ul_tag = p_tag.find_next_sibling('ul', class_='inline-list')

    # Verifica se o <ul> foi encontrado
    if not ul_tag:
        return {
            'success': 'false',
            'message': "Nenhuma <ul> com a classe 'inline-list' encontrada."
        }

    # Extrai o texto de todos os elementos <li> dentro do <ul>
    list_items = ul_tag.find_all('li')
    data = [item.get_text(strip=True) for item in list_items]

    # Imprime cada item com seu índice
    for i, item in enumerate(data):
        print(f"Item {i+1}: {item}")

    # Retorna os dados processados e o status de sucesso
    return {
        'success': 'true',
        'data': data,
        'tipo': 'palpite'
    }
