from fastapi import APIRouter, HTTPException, status

from app.persistence.tarefa_mongodb_repository import TarefaMongoDBRepository

from ..viewmodels import Tarefa

routes = APIRouter()
prefix = '/tarefas'

# Banco de Dados
# Tarefa_repository = TarefaInMemoryRepository()
tarefa_repository = TarefaMongoDBRepository()

@routes.get('/')
def todos_tarefa(skip: int | None = 0, take: int | None = 0):
    return tarefa_repository.todos(skip, take)


@routes.get('/{tarefa_id}')
def obter_tarefa(tarefa_id: int | str):
    tarefa = tarefa_repository.obter_um(tarefa_id)

    # fail fast
    if not tarefa:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Não há tarefa com id = {tarefa_id }')

    return tarefa


@routes.post('/criar', status_code=status.HTTP_201_CREATED)
def novo_tarefa(tarefa: Tarefa):
    return tarefa_repository.salvar(tarefa)


@routes.delete("/{tarefa_id}", status_code=status.HTTP_204_NO_CONTENT)
def remover_tarefa(tarefa_id: int | str):
    tarefa = tarefa_repository.obter_um(tarefa_id)

    if not tarefa:
        raise HTTPException(status.HTTP_404_NOT_FOUND,
                            detail="Tarefa não encontrado")

    tarefa_repository.remover(tarefa_id)


@routes.put('/{tarefa_id}')
def atualizar_tarefa(tarefa_id: int | str, tarefa: Tarefa):
    tarefa_encontrado = tarefa_repository.obter_um(tarefa_id)

    if not tarefa_encontrado:
        raise HTTPException(status.HTTP_404_NOT_FOUND,
                            detail="Tarefa não encontrado")

    return tarefa_repository.atualizar(tarefa_id, tarefa)

@routes.put('/{tarefa_id}/cancelar')
def cancelar_tarefa(tarefa_id: int | str):
    tarefa_encontrado = tarefa_repository.obter_um(tarefa_id)

    if not tarefa_encontrado:
        raise HTTPException(status.HTTP_404_NOT_FOUND,
                            detail="Tarefa não encontrado")

    return tarefa_repository.cancelar(tarefa_id)
