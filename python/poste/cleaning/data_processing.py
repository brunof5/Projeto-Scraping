from bs4 import BeautifulSoup

def process_poste_data(input_file):
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

            eventos = ['PPT', 'PTM', 'PT', 'PTV', 'FED', 'COR']
            results = {
                'data': [],
                'tipo': 'poste',
                'eventos': []
            }

            for row in rows:
                columns = row.find_all('td')
                value = [col.get_text(strip=True) for col in columns]
                results['data'].append(value)

            for i, row_data in enumerate(results['data']):
                for index, evento in enumerate(eventos):
                    if row_data[index + 1] != '0000-0':
                        if evento not in results['eventos']:
                            results['eventos'].append(evento)

            # Printar os resultados
            for i, row_data in enumerate(results['data']):
                print(f"Linha {i+1}: {row_data}")


            return results
        else:
            return "Nenhuma tabela encontrada imediatamente após o <p> com a classe 'text-poste'."

    else:
        return "Nenhum elemento <p> com a classe 'text-poste' encontrado."
    