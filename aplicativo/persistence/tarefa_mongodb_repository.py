from typing import TypedDict

from bson.objectid import ObjectId
from pymongo import MongoClient

from ..presentation.viewmodels import Tarefa


class TarefaMongo(TypedDict):
    _id: ObjectId
    descricao: str
    responsavel: str | None
    nivel: int
    situacao: str | None
    prioridade: int

class TarefaMongoDBRepository():

    def __init__(self):
        # Connect to MongoDB
        # uri = 'mongodb://localhost:27017'
        uri = 'mongodb://localhost:27017'
        client = MongoClient(uri)
        db = client['tarefasapp']
        self.tarefas = db['tarefas']
        

    def todos(self, skip=0, take=0):
        tarefas = self.tarefa.find().skip(skip).limit(take)
        return list(map(Tarefa.fromDict, Tarefa))

    def salvar(self, tarefa):
        _id = self.tarefas.insert_one(tarefa.toDict()).inserted_id
        tarefa.id = str(_id)
        return tarefa

    def obter_um(self, tarefa_id):
        filtro = {"_id": ObjectId(tarefa_id)}
        tarefa_encontrado = self.tarefas.find_one(filtro)
        return Tarefa.fromDict(tarefa_encontrado) if tarefa_encontrado else None

    def remover(self, tarefa_id):
        filtro = {"_id": ObjectId(tarefa_id)}
        self.tarefas.delete_one(filtro)

    def atualizar(self, tarefa_id, tarefa):
        filtro = {"_id": ObjectId(tarefa_id)}
        self.tarefas.update_one(filtro, {'$set': tarefa.toDict()})
        tarefa.id = tarefa_id
        return tarefa
    
    def cancelar(self, tarefa_id):
        filtro = {"_id": ObjectId(tarefa_id)}
        self.tarefas.update_one(filtro, {'$set': {"situacao": "Cancelada"}})
