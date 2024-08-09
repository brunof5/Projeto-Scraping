document.addEventListener('DOMContentLoaded', function() {
    const emailCheckbox = document.getElementById('emailCheckbox')
    const smsCheckbox = document.getElementById('sms')
    const telegramCheckbox = document.getElementById('telegram')
    const inputArea = document.getElementById('input-area')

    emailCheckbox.addEventListener('change', handleEmail)
    smsCheckbox.addEventListener('change', handlePhone)
    telegramCheckbox.addEventListener('change', handlePhone)

    function handleEmail() {
        const emailDiv = document.getElementById('email-div')
        if(emailCheckbox.checked) {
            if(!emailDiv) {
                createEmailDiv()
            }
        } else {
            if(emailDiv) {
                emailDiv.remove()
            }
        }
    }

    function handlePhone() {
        const phoneDiv = document.getElementById('phone-div')
        if(smsCheckbox.checked || telegramCheckbox.checked) {
            if(!phoneDiv) {
                createPhoneDiv()
            }
        } else {
            if(phoneDiv && !smsCheckbox.checked && !telegramCheckbox.checked) {
                phoneDiv.remove()
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

    function createPhoneDiv() {
        const phoneDiv = document.createElement('div')
        phoneDiv.id = 'phone-div'
        inputArea.appendChild(phoneDiv)

        const phoneLabel = document.createElement('label')
        phoneLabel.htmlFor = 'phone'
        phoneLabel.className = 'label-custom-width'
        phoneLabel.innerText = 'Telefone:'
        phoneDiv.appendChild(phoneLabel)

        const phoneInput = document.createElement('input')
        phoneInput.type = 'tel'
        phoneInput.id = 'phone'
        phoneInput.name = 'phone'
        phoneInput.placeholder = '(xx) 9xxxx-xxxx'
        phoneInput.pattern = '\\(\\d{2}\\)\\s9\\d{4}-\\d{4}'
        phoneInput.oninvalid = function(e) {
            e.target.setCustomValidity('Siga o padrão (xx) 9xxxx-xxxx')
        }
        phoneInput.oninput = function(e) {
            e.target.setCustomValidity('')
        }
        phoneDiv.appendChild(phoneInput)
    }
        
    /* Código que formata o input do número de telefone a medida que o usuário digita
    * Modificado e retirado de: https://codepen.io/taimoorsattar/pen/vYRJExq
    */
    document.addEventListener('input', function (e) {
        if(e.target && e.target.id === 'phone') {
            let cursorPos = e.target.selectionStart
            let formatInput = autoFormatPhoneNumber(e.target)
            e.target.value = String(formatInput)
            let isBackspace = (e?.data==null) ? true: false
            let nextCusPos = nextDigit(formatInput, cursorPos, isBackspace)
            
            phone.setSelectionRange(nextCusPos+1, nextCusPos+1)
        }
    })

    function nextDigit(input, cursorpos, isBackspace) {
        if(isBackspace) {
            for (let i = cursorpos-1; i > 0; i--) {
                if(/\d/.test(input[i])) {
                    return i
                }
        }
        } else {
            for (let i = cursorpos-1; i < input.length; i++) {
                if(/\d/.test(input[i])) {
                    return i
                }
            }
        }
        
        return cursorpos
    }

    function autoFormatPhoneNumber(ref) {
        try {
            let phoneNumberString = ref.value
            var cleaned = ("" + phoneNumberString).replace(/\D/g, "")
            var match = cleaned.match(/^(\d{0,2})?(\d{0,5})?(\d{0,4})?/)
            return [match[1] ? "(": "",
                    match[1], 
                    match[2] ? ") ": "",
                    match[2],
                    match[3] ? "-": "",
                    match[3]].join("")
            
        } catch(err) {
            return ""
        }
    }

    document.getElementById('event-form').addEventListener('submit', function(event) {
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
            if(data.success === 'true') {
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