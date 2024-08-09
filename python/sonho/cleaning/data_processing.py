from bs4 import BeautifulSoup
import random
import requests
import json

def clean_text(text):
    """Remove CR and LF; replaces multiple spaces with a single space."""
    text = text.replace('\r', ' ').replace('\n', ' ')
    ' '.join(text.split()).strip()
    return text.replace(': ', ':')

def fetch_random_valid_url(links):
    """Fetches a random valid URL from the given list of links."""
    url = 'http://www.ojogodobicho.com/'
    valid_urls = [requests.compat.urljoin(url, link.get('href')) for link in links]
    valid_urls = [u for u in valid_urls if u != 'http://www.ojogodobicho.com/sonhosindice.htm']
    return random.choice(valid_urls) if valid_urls else None

def extract_data_from_li(li):
    """Extracts and cleans data from a <li> element."""
    data = {}
    title_div = li.find('div', class_='title')
    content_div = li.find('div', class_='content')
    
    if title_div:
        h5 = title_div.find('h5')
        if h5:
            title_text = clean_text(h5.get_text(strip=True))
            if title_text != "Não encontrou o sonho?":
                data['title'] = title_text
    
    if content_div:
        paragraphs = content_div.find_all('p')
        if len(paragraphs) == 3:
            data['description_title'] = clean_text(paragraphs[0].get_text(strip=True))
            data['description'] = clean_text(paragraphs[1].get_text(strip=True))
            
            # Process the third paragraph for key-value pairs
            info_text = clean_text(paragraphs[2].get_text(separator=' ', strip=True))
            for part in info_text.split(' '):
                if ':' in part:
                    key, value = map(str.strip, part.split(':', 1))
                    data[key] = value
    
    return data

def choose_valid_list_item(list_items):
    """Chooses a valid <li> item from the given list."""
    valid_items = [li for li in list_items 
                   if li.find('div', class_='title') and 
                   'Não encontrou o sonho?' not in clean_text(li.find('h5').get_text(strip=True))]
    return random.choice(valid_items) if valid_items else None

def process_sonho_data(input_file):
    with open(input_file, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')

        ul_tag = soup.find('ul', class_='button-group')
        if ul_tag:
            links = ul_tag.find_all('a')
            if links:
                full_url = fetch_random_valid_url(links)
                if full_url:
                    response = requests.get(full_url)
                    soup = BeautifulSoup(response.content, 'html.parser')
                    
                    all_accordion_lists = soup.find_all('ul', class_='accordion')
                    if all_accordion_lists:
                        all_list_items = [li for ul in all_accordion_lists for li in ul.find_all('li')]
                        valid_list_item = choose_valid_list_item(all_list_items)
                        if valid_list_item:
                            data = extract_data_from_li(valid_list_item)
                            print(f"Dados do <li> sorteado: {json.dumps(data, ensure_ascii=False, indent=4)}")

                            results = {}
                            results['data'] = data
                            results['tipo'] = 'sonho'

                            return results
                        else:
                            return "Nenhuma <li> válida encontrada nas <ul> com classe 'accordion'."
                    else:
                        return "Nenhuma <ul> com a classe 'accordion' encontrada no href sorteado."
                else:
                    return "URL inválida encontrada e nenhuma URL válida disponível."
            else:
                return "Nenhum <a> encontrado na <ul> com a classe 'button-group'."
        else:
            return "Nenhuma <ul> com a classe 'button-group' encontrada."