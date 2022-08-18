let form = document.querySelector('#form-modal')

let inputNome = document.querySelector('#input_nome')
let validNome = false 

let inputTelefone = document.querySelector('#input_telefone')
let validTelefone = false

let inputEmail = document.querySelector('#input_email')
let validEmail = false

let inputEndereco = document.querySelector('#input_endereco')
let validEndereco = false

let bodyTabela = document.querySelector('#tbCliente')


$("#btn-novo").click(function () {

    $("#janela-modal").modal()
});


form.addEventListener('submit', () => {

    validaInputs()
})

//validando inputs
function validaInputs() {

    //nome
    if (inputNome.value.length < 3) {
        inputInvalido(inputNome, '#msg-nome', 'CAMPO OBRIGATÓRIO! Preencha um nome válido!')
        validNome = false
    } else {
        inputValido(inputNome)
        validNome = true
    }

    //telefone
    if (inputTelefone.value.length < 11) {
        inputInvalido(inputTelefone, '#msg-tel', 'CAMPO OBRIGATÓRIO! Preencha um telefone válido!')
        validTelefone = false
    } else {
        inputValido(inputTelefone)
        validTelefone = true
    }

    //email
    if (inputEmail.value === "" || inputEmail.value.indexOf('@') === -1 || inputEmail.value.indexOf('.') === -1) {
        inputInvalido(inputEmail, '#msg-email', 'CAMPO OBRIGATÓRIO! Preencha um E-mail válido! ex. name@gmail.com')
        validEmail = false
    } else {
        inputValido(inputEmail)
        validEmail = true
    }

    //endereco
    if (inputEndereco.value === "") {
        inputInvalido(inputEndereco, '#msg-endereco', 'CAMPO OBRIGATÓRIO!')
        validEndereco = false
    } else {
        inputValido(inputEndereco)
        validEndereco = true
    }

    function inputInvalido(input, divMsg, msg) {
        input.classList.remove('form-control', 'is-valid')
        input.classList.add('form-control', 'is-invalid')

        const campoMsg = document.querySelector(divMsg)
        campoMsg.classList.add('invalid-feedback')

        campoMsg.innerHTML = msg
    }

    function inputValido(input) {
        input.classList.remove('form-control', 'is-invalid')
        input.classList.add('form-control', 'is-valid')
    }

    if (validNome && validTelefone && validEmail && validEndereco) {
        novoCliente(inputNome.value, inputTelefone.value, inputEmail.value, inputEndereco.value)

        closeModal()
    }
}

function novoCliente(nome, telefone, email, endereco) {
    cliente = {
        nome: nome,
        telefone: telefone,
        email: email,
        endereco: endereco
    }

    const index = inputNome.dataset.index

    if (index == 'new') {
        console.log(index)
        criaCliente(cliente)
    } else {
        atualizaCliente(index, cliente)
    }
}

const getLocalStorage = () => JSON.parse(localStorage.getItem("db_cliente")) || []

const setLocalStorage = (objCliente) => {
    localStorage.setItem("db_cliente", JSON.stringify(objCliente))
}

//CRUD - CREATE
const criaCliente = (cliente) => {
    let dbcliente = getLocalStorage()
    dbcliente.push(cliente)
    setLocalStorage(dbcliente)
}

//CRUD - READ
const lerCliente = () => { return getLocalStorage() }

//CRUD - UPDATE
const atualizaCliente = (index, cliente) => {
    const dbcliente = lerCliente()
    dbcliente[index] = cliente
    return setLocalStorage(dbcliente)
}

//CRUD-DELETE
const deletaCliente = (index) => {
    const dbcliente = lerCliente()
    dbcliente.splice(index, 1)
    return setLocalStorage(dbcliente)
}

//cria linhas da tabela
const criaRow = (cliente, index) => {
    const novaRow = document.createElement('tr')

    novaRow.innerHTML = ` 
    <td>${cliente.nome}</td>
    <td>${cliente.telefone}</td>
    <td>${cliente.email}</td> 
    <td>${cliente.endereco}</td>
    <td>                                                                    
      <button type="button" class="btn btn-success" id="alterar-${index}">Alterar</button>
      <button type="button" class="btn btn-danger" id="excluir-${index}">Excluir</button>
    </td>
    `
    document.querySelector('#tbCliente').appendChild(novaRow)
}

const limpaTabela = () => {
    const linhas = document.querySelectorAll('#tbCliente tr')
    linhas.forEach(linha => linha.parentNode.removeChild(linha))
}

const atualizaTabela = () => {
    let dbCliente = lerCliente()
    limpaTabela()
    dbCliente.forEach(criaRow)
}

const preencheModal = (cliente) => {
    inputNome.value = cliente.nome
    inputTelefone.value = cliente.telefone
    inputEmail.value = cliente.email
    inputEndereco.value = cliente.endereco
    inputNome.dataset.index = cliente.index
}

const alteraCliente = (index) => {
    const cliente = lerCliente()[index]
    cliente.index = index
    preencheModal(cliente)
    $("#janela-modal").modal()
}

const alterarExcluir = (e) => {
    if (e.target.type === 'button') {
        const [action, index] = e.target.id.split('-')
        if (action === 'alterar') {
            alteraCliente(index)
        } else {
            const cliente = lerCliente()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${cliente.nome} ?`)
            if (response) {
                deletaCliente(index)
                atualizaTabela()
            }
        }
    }
}
bodyTabela.addEventListener('click', alterarExcluir)
atualizaTabela()


























