baseURL = 'http://127.0.0.1:8000/tarefas'

const lista_tarefas = document.querySelector('.lista-tarefas');

let tarefas = [];
let editing = false;
let tarefa_id;

function exibir_tarefa(tarefa) {
    //div tarefa
    const div_tarefa = document.createElement('div');
    div_tarefa.classList.add('tarefa');
    
    //descrição
    const descricao = document.createElement('h4');
    descricao.innerText = tarefa.descricao;
    div_tarefa.appendChild(descricao);

    //responsável
    if (tarefa.responsavel != ''){
        const responsavel = document.createElement('h5');
        responsavel.innerText = 'Responsável: ' + tarefa.responsavel;
        div_tarefa.appendChild(responsavel);
    }

    
    //div flex
    const div_flex = document.createElement('div');
    div_flex.classList.add('flex')
    div_tarefa.appendChild(div_flex)

    //Prioridade
    const prioridade = document.createElement('span');
    prioridade.innerText = 'Prioridade: ' + tarefa.prioridade;
    div_flex.appendChild(prioridade);

    //Nível
    const nivel = document.createElement('span');
    nivel.innerText = 'Nível: ' + tarefa.nivel;
    div_flex.appendChild(nivel);

    //Situação
    const situacao = document.createElement('span');
    situacao.innerText = 'Situação: ' + tarefa.situacao;
    div_flex.appendChild(situacao);


    //div btn
    const div_btn = document.createElement('div');
    div_btn.classList.add('btn')
    div_tarefa.appendChild(div_btn)

    //btn editar
    const btn_editar = document.createElement('button');
    btn_editar.innerText = 'Editar';
    div_btn.appendChild(btn_editar);

    //btn excluir
    const btn_excluir = document.createElement('button');
    btn_excluir.innerText = 'Excluir';
    div_btn.appendChild(btn_excluir);
    btn_excluir.onclick = async (event) => {
        // chamar API método DELETE passando o ID URL
        event.preventDefault()
        const confirmou = confirm('Deseja mesmo excluir a tarefa?')

        if (!confirmou) {
            return
        }

        const response = await fetch(baseURL+'/'+tarefa.id, {method: 'DELETE'})

        // se deu certo..
        if (response.ok){
            alert('Tarefa removida com sucesso!')
            carregar_tarefas()
        }
    }


    //btn cancelar
    const btn_cancelar = document.createElement('button');
    btn_cancelar.innerText = 'Cancelar';
    div_btn.appendChild(btn_cancelar);
    btn_cancelar.onclick = async (event) => {
        // chamar API método DELETE passando o ID URL
        event.preventDefault()
        const confirmou = confirm('Deseja mesmo cancelar a tarefa?')

        if (!confirmou) {
            return
        }

        const response = await fetch(baseURL+'/'+tarefa.id+'/cancelar', {method: 'PUT'})

        // se deu certo..
        if (response.ok){
            alert('Tarefa Cancelada!')
            carregar_tarefas()
        }
    }


    return div_tarefa
}

function resetar_formulario() {
    const form_tarefa = document.getElementById('form-tarefa')
    form_tarefa.reset()

    editing = false
}

function preencher_formulario(tarefa){
    const form_tarefa = document.getElementById('form-tarefa')

    const inputs = form_tarefa.children
    inputs[1].value = tarefa.descricao
    inputs[3].value = tarefa.responsavel
    inputs[5].value = tarefa.nivel
    inputs[7].value = tarefa.prioridade
}

function configurar_formulario(){
    const form_tarefa = document.getElementById('form-tarefa')

    form_tarefa.onsubmit = async function(event){

        event.preventDefault()

        const dados = form_tarefa.children
        const descricao = dados[1].value
        const responsavel = dados[3].value
        const nivel = Number(dados[5].value)
        const prioridade = Number(dados[7].value)

        const tarefa = {descricao: descricao, responsavel: responsavel, nivel: nivel, prioridade: prioridade}

        console.log('Submeteu!!!')
        // console.log(dados)
        // console.log('Filme: ', filme)
        let url = baseURL+'/criar'
        let method = 'POST'
        let mensagem_ok = 'Tarefa Adicionado com sucesso!'
        let mensagem_erro = 'Não foi possível adicionar'
        let response_status = 201

        if (editing){
            url = baseURL+'/'+tarefa_id
            method = 'PUT'
            mensagem_ok = 'Tarefa Atualizada com sucesso!'
            mensagem_erro = 'Não foi possível editar'
            response_status = 200
        }

        const opcoes = {
            method: method, 
            body: JSON.stringify(tarefa),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const response = await fetch(url, opcoes)

        if (response.status === response_status ){
            alert(mensagem_ok)
            carregar_tarefas()
            resetar_formulario()
        }else{
            alert(mensagem_erro)
        }

    }
}

function atualizar_tela(){
    lista_tarefas.innerHTML = [];

    for (let tarefa of tarefas){
        var mostrar_tarefas = exibir_tarefa(tarefa);
        
        lista_tarefas.appendChild(mostrar_tarefas);
    }
}

async function carregar_tarefas(){
    const response = await fetch(baseURL);

    const status = response.status;
    tarefas = await response.json();

    atualizar_tela();
}

function app(){
    configurar_formulario();
    carregar_tarefas();
}

app()
