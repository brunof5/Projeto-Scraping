import requests
from bs4 import BeautifulSoup
import random
import json
import unicodedata
import re

input_file = '../scraping/sonho.html'
url = 'http://localhost:3000/sonho'

def remove_accentuation(text):
    return ''.join(
        c for c in unicodedata.normalize('NFKD', text)
        if not unicodedata.combining(c)
    )

def clean_text(text):
    # Remove CR, LF, and other invisible characters
    text = text.replace('\r', ' ').replace('\n', ' ')
    text = re.sub(r'\s+', ' ', text).strip()  # Replace multiple spaces with a single space
    return text

def fetch_random_valid_url(links):
    valid_urls = [requests.compat.urljoin(url, link.get('href')) for link in links]
    valid_urls = [u for u in valid_urls if u != 'http://www.ojogodobicho.com/sonhosindice.htm']
    if valid_urls:
        return random.choice(valid_urls)
    return None

def extract_data_from_li(li):
    data = {}
    title_div = li.find('div', class_='title')
    content_div = li.find('div', class_='content')
    
    if title_div:
        h5 = title_div.find('h5')
        if h5:
            title_text = remove_accentuation(clean_text(h5.get_text(strip=True)))
            if title_text != "Não encontrou o sonho?":
                data['title'] = title_text
    
    if content_div:
        paragraphs = content_div.find_all('p')
        if len(paragraphs) >= 3:
            data['description_title'] = remove_accentuation(clean_text(paragraphs[0].get_text(strip=True)))
            data['description'] = remove_accentuation(clean_text(paragraphs[1].get_text(strip=True)))
            
            # Clean and process the third paragraph
            info_text = clean_text(paragraphs[2].get_text(separator=' ', strip=True))
            
            # Regular expression to find all key-value pairs
            pattern = re.compile(r'(\w+):\s*([^ -]+(?:\s*\d*)*)')
            info_dict = {match.group(1): match.group(2).strip() for match in pattern.finditer(info_text)}
            
            data.update(info_dict)
    
    return data

def choose_valid_list_item(list_items):
    valid_items = [li for li in list_items if 'Não encontrou o sonho?' not in remove_accentuation(clean_text(li.find('div', class_='title').find('h5').get_text(strip=True)))]
    if valid_items:
        return random.choice(valid_items)
    return None

with open(input_file, 'r', encoding='utf-8') as file:
    soup = BeautifulSoup(file, 'html.parser')

ul_tag = soup.find('ul', class_='button-group')
data = {}
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
                    
                    #print(f"Dados do <li> sorteado: {json.dumps(data, ensure_ascii=False, indent=4)}")
                    
                    response = requests.post(url, json=data)
                    print(response.status_code, response.reason)
                else:
                    print("Nenhuma <li> válida encontrada nas <ul> com classe 'accordion'.")
            else:
                print("Nenhuma <ul> com a classe 'accordion' encontrada no href sorteado.")
        else:
            print("URL inválida encontrada e nenhuma URL válida disponível.")
    else:
        print("Nenhum <a> encontrado na <ul> com a classe 'button-group'.")
else:
    print("Nenhuma <ul> com a classe 'button-group' encontrada.")
