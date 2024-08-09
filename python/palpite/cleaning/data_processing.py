from bs4 import BeautifulSoup

def process_palpite_data(input_file):
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

            results = {}
            results['data'] = data
            results['tipo'] = 'palpite'

            return results
        else:
            return "Nenhuma <ul> com a classe 'inline-list' encontrada."
    else:
        return "Nenhum <p> com o texto 'Palpite grupo' encontrado."
    