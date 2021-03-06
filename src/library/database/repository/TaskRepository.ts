import { DeepPartial, DeleteResult, Repository } from 'typeorm';
import { TFilteredTask } from 'models';
import { BaseRepository } from './BaseRepository';
import { Task } from '../entity/Task';
/**
 * TaskRepository
 *
 * Repositório para tabela de Tarefas
 */
export class TaskRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = Task;
    }

    /**
     * insert
     *
     * Adiciona uma nova tarefa
     *
     * @param task - Tarefa
     *
     * @returns Tarefa adicionada
     */
    public insert(task: DeepPartial<Task>): Promise<Task> {
        const taskRepository: Repository<Task> = this.getConnection().getRepository(Task);
        return taskRepository.save(taskRepository.create(task));
    }

    /**
     * getByParentId
     *
     * Retorna as tarefas que contenham a id informada
     *
     * @param parentId - string
     *
     * @returns Array contendo as tarefas
     */
    public getByParentId(parentId: string): Promise<TFilteredTask[]> {
        return this.getConnection()
            .getRepository(Task)
            .find({ where: { parentId }, select: ['id', 'description'] });
    }

    /**
     * update
     *
     * Altera uma tarefa
     *
     * @param task - Tarefa
     *
     * @returns Tarefa alterada
     */
    public update(task: Task): Promise<Task> {
        return this.getConnection().getRepository(Task).save(task);
    }

    /**
     * delete
     *
     * Remove uma tarefa pelo ID
     *
     * @param id - Id da tarefa
     *
     * @returns Resultado da remoção
     */
    public delete(id: string): Promise<DeleteResult> {
        return this.getConnection().getRepository(Task).delete(id);
    }

    /**
     * findByDescription
     *
     * Busca uma tarefa pela descrição e id do parente
     *
     * @param parentId - Id do parente
     *
     * @param description - Descrição da tarefa
     *
     * @returns Tarefa buscada
     */
    public findByDescription(parentId: string, description: string): Promise<Task | undefined> {
        return this.getConnection().getRepository(Task).findOne({ parentId, description });
    }
}
