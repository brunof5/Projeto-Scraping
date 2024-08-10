from bs4 import BeautifulSoup
import random
import requests
import json

def clean_text(text):
    # Remove os caracteres CR e LF; substitui múltiplos espaços por um único espaço.
    # Ajusta formatação específica para evitar espaços antes dos dois pontos, assim melhorar o processamento.
    text = text.replace('\r', ' ').replace('\n', ' ')
    text = ' '.join(text.split()).strip()
    return text.replace(': ', ':')

def fetch_random_valid_url(links):
    # Obtém uma URL válida aleatória a partir de uma lista de links (abecedário). Remove a URL de indice indesejada.
    url = 'http://www.ojogodobicho.com/'
    valid_urls = [requests.compat.urljoin(url, link.get('href')) for link in links]
    valid_urls = [u for u in valid_urls if u != 'http://www.ojogodobicho.com/sonhosindice.htm']
    return random.choice(valid_urls) if valid_urls else None

def extract_data_from_li(li):
    # Extrai e limpa dados de um elemento <li>.
    data = {}

    # Extrai e limpa o título
    title_div = li.find('div', class_='title')
    if title_div:
        h5 = title_div.find('h5')
        if h5:
            title_text = clean_text(h5.get_text(strip=True))
            if title_text != "Não encontrou o sonho?":
                data['title'] = title_text

    # Extrai e limpa o conteúdo
    content_div = li.find('div', class_='content')
    if content_div:
        paragraphs = content_div.find_all('p')
        if len(paragraphs) == 3:
            data['description_title'] = clean_text(paragraphs[0].get_text(strip=True))
            data['description'] = clean_text(paragraphs[1].get_text(strip=True))
            
            # Processa o terceiro parágrafo para pares chave-valor
            info_text = clean_text(paragraphs[2].get_text(separator=' ', strip=True))
            for part in info_text.split(' '):
                if ':' in part:
                    key, value = map(str.strip, part.split(':', 1))
                    data[key] = value
    
    return data

def choose_valid_list_item(list_items):
    # Escolhe um item <li> válido da lista fornecida.
    valid_items = [
        li for li in list_items 
        if li.find('div', class_='title') and 'Não encontrou o sonho?' not in clean_text(li.find('h5').get_text(strip=True))
    ]
    return random.choice(valid_items) if valid_items else None

# Processa os dados do arquivo HTML fornecido para extrair informações relevantes.
def process_sonho_data(input_file):
    with open(input_file, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')

        # Encontra a lista de botões e extrai links
        ul_tag = soup.find('ul', class_='button-group')
        if not ul_tag:
            return {
                'success': 'false',
                'message': "Nenhuma <ul> com a classe 'button-group' encontrada."
            }
        
        links = ul_tag.find_all('a')
        if not links:
            return {
                'success': 'false',
                'message': "Nenhum <a> encontrado na <ul> com a classe 'button-group'."
            }
        
        # Busca uma URL válida e faz uma requisição HTTP
        full_url = fetch_random_valid_url(links)
        if not full_url:
            return {
                'success': 'false',
                'message': "URL inválida encontrada e nenhuma URL válida disponível."
            }

        response = requests.get(full_url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Encontra as listas de 'accordion' e seleciona um item <li> válido
        all_accordion_lists = soup.find_all('ul', class_='accordion')
        if not all_accordion_lists:
            return {
                'success': 'false',
                'message': "Nenhuma <ul> com a classe 'accordion' encontrada no href sorteado."
            }

        all_list_items = [li for ul in all_accordion_lists for li in ul.find_all('li')]
        valid_list_item = choose_valid_list_item(all_list_items)
        if not valid_list_item:
            return {
                'success': 'false',
                'message': "Nenhuma <li> válida encontrada nas <ul> com classe 'accordion'."
            }

        # Extrai os dados do item <li> selecionado e retorna o resultado
        data = extract_data_from_li(valid_list_item)
        print(f"Dados do <li> sorteado: {json.dumps(data, ensure_ascii=False, indent=4)}")

        return {
            'success': 'true',
            'data': data,
            'tipo': 'sonho'
        }
    