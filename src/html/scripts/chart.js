document.addEventListener('DOMContentLoaded', () => {
    const pathName = window.location.pathname
    const dataType = pathName.split('/').pop()

    if (dataType === 'poste') {
        fetch('/api/poste')
        .then(response => response.json())
        .then(data => {
            createCheckboxs(data)

            document.getElementById('checkbox-selection').addEventListener('change', (event) => {
                handleCheckboxChange(event, data)
            })
        })
            
    } else if (dataType === 'palpite') {
        fetch('/api/palpite')
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                document.getElementById('palpite').textContent = data.slice(0, 5).join('\t')
            }
        })

    } else if (dataType === 'sonho') {
        fetch('/api/sonho')
        .then(response => response.json())
        .then(data => {
            if (Object.keys(data).length > 0) {
                document.getElementById('title').textContent = data['title']
                document.getElementById('description-title').textContent = data['description-title']
                document.getElementById('description').textContent = data['description']
                document.getElementById('palpite').innerHTML = `<strong>Bicho: ${data['Bicho']}</strong> - G: ${data['G']} - D: ${data['D']} - C: ${data['C']} - M: ${data['M']}`
            }
        })
    }
})

function createCheckboxs(data) {
    const divCheckboxs = document.createElement('div')
    divCheckboxs.className = 'flex-checkbox'
    divCheckboxs.id = 'checkbox-selection'
    document.getElementById('container').appendChild(divCheckboxs)

    const sorteio = ['PPT', 'PTM', 'PT', 'PTV', 'FED', 'COR']

    sorteio.forEach((label, index) => {
        // Cria checkbox para cada sorteio
        const checkboxContainer = document.createElement('div')
        checkboxContainer.className = 'checkbox-container'

        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.id = `position${index}`
        checkbox.name = `position${index}`

        const labelElement = document.createElement('label')
        labelElement.htmlFor = checkbox.id
        labelElement.textContent = label

        // Verifica se a posição contém apenas '0000-0', desativa o checkbox se sim
        if (data) {
            const allZeros = data.every(row => row[index + 1] === '0000-0')
            if (allZeros) {
                checkbox.classList.add('disabled')
                labelElement.className = 'disabled'
                checkbox.disabled = true
            }
        } else {
            checkbox.classList.add('disabled')
            labelElement.className = 'disabled'
            checkbox.disabled = true
        }

        checkboxContainer.appendChild(checkbox)
        checkboxContainer.appendChild(labelElement)
        divCheckboxs.appendChild(checkboxContainer)
    })
}

// Função que faz o 'uncheck' do botões e deixa 'check' o único que foi clicado
function handleCheckboxChange(event, data) {
    if (event.target.type === 'checkbox') {
        document.querySelectorAll('#checkbox-selection input[type="checkbox"]').forEach(checkbox => {
            if (checkbox !== event.target) {
                checkbox.checked = false
            }
        })

        createChart(data)
    }
}

function createChart(data) {
    const oldCanvas = document.getElementById('chart-canvas')
    if (oldCanvas) {
        oldCanvas.remove()
    }

    const canvas = document.createElement('canvas')
    canvas.id = 'chart-canvas'
    const parent = document.getElementById('container')
    const sibling = document.getElementById('checkbox-selection')
    parent.insertBefore(canvas, sibling)
    const ctx = canvas.getContext('2d')

    const selectedCheckbox = document.querySelector('#checkbox-selection input[type="checkbox"]:checked')

    if (selectedCheckbox) {
        const index = parseInt(selectedCheckbox.id.replace('position', ''))

        // Filtra dados selecionados, ignora '0000-0'
        const selectedData = data.map(row => row[index + 1]).filter(value => value !== '0000-0')

        // Renderiza o gráfico com os dados selecionados
        renderDoughnutChart(ctx, selectedData)
    }
}

function renderDoughnutChart(ctx, data) {
    const animais = ['Avestruz', 'Águia', 'Burro', 'Borboleta', 'Cachorro', 'Cabra', 'Carneiro', 'Camelo', 'Cobra', 'Coelho', 'Cavalo', 'Elefante', 'Galo', 'Gato', 'Jacaré', 'Leão', 'Macaco', 'Porco', 'Pavão', 'Peru', 'Touro', 'Tigre', 'Urso', 'Veado', 'Vaca']

    const labels = []
    const datasets = [{
        data: [],
        backgroundColor: []
    }]

    // Para garantir cores únicas
    const colorMap = {}

    data.forEach(item => {
        const codigo = item.split('-')
        const value = parseInt(codigo[0])
        const grupo = animais[codigo[1] - 1]
        const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`   // Gera cor aleatória

        if (!colorMap[value]) {
            colorMap[value] = color
        }

        labels.push(grupo)
        datasets[0].data.push(value)
        datasets[0].backgroundColor.push(colorMap[value])
    })

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return `Valor: ${tooltipItem.label} - ${tooltipItem.raw}`
                        }
                    }
                },
                datalabels: {
                    display: true,
                    anchor: 'end',
                    align: 'end',
                    formatter: (value, context) => context.dataIndex + 1,   // Rótulo sobre o setor
                    color: '#000',
                    font: {
                        weight: 'bold'
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    })
}
