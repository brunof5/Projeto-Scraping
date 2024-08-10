document.addEventListener('DOMContentLoaded', function () {
    const emailCheckbox = document.getElementById('emailCheckbox')
    const inputArea = document.getElementById('input-area')

    emailCheckbox.addEventListener('change', handleEmail)

    function handleEmail() {
        const emailDiv = document.getElementById('email-div')
        if (emailCheckbox.checked) {
            if (!emailDiv) {
                createEmailDiv()
            }
        } else {
            if (emailDiv) {
                emailDiv.remove()
            }
        }
    }

    function createEmailDiv() {
        const emailDiv = document.createElement('div')
        emailDiv.id = 'email-div'
        inputArea.appendChild(emailDiv)

        const emailLabel = document.createElement('label')
        emailLabel.htmlFor = 'email'
        emailLabel.className = 'label-custom-width'
        emailLabel.innerText = 'E-mail:'
        emailDiv.appendChild(emailLabel)

        const emailInput = document.createElement('input')
        emailInput.type = 'email'
        emailInput.id = 'email'
        emailInput.name = 'email'
        emailInput.placeholder = 'Digite seu e-mail'
        emailDiv.appendChild(emailInput)
    }

    document.getElementById('event-form').addEventListener('submit', function (event) {
        event.preventDefault()

        var formData = new FormData(this)

        fetch('/notify', {
            method: 'POST',
            body: new URLSearchParams(formData).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success === 'true') {
                document.getElementById('exampleModalLabel').innerText = 'Cadastro Realizado com Sucesso'
                document.getElementById('descricaoModal').innerHTML = `<p>${data.message}</p>`
                document.getElementsByClassName('modal-header')[0].className = 'modal-header text-success'
                document.getElementById('btnVoltar').className = 'btn btn-success'

                var myModal = new bootstrap.Modal(document.getElementById('modalCadastroEvento'))
                myModal.show()
            } else {
                document.getElementById('exampleModalLabel').innerText = 'Erro no Cadastro'
                document.getElementById('descricaoModal').innerHTML = `<p>${data.message}</p>`
                document.getElementsByClassName('modal-header')[0].className = 'modal-header text-danger'
                document.getElementById('btnVoltar').className = 'btn btn-danger'

                var myModal = new bootstrap.Modal(document.getElementById('modalCadastroEvento'))
                myModal.show()

            }
        })
    })
})