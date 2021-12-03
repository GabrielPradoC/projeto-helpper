import { DeepPartial, DeleteResult, Repository } from 'typeorm';
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
     * @param task
     *
     * @returns Tarefa adicionado
     */
    public insert(task: DeepPartial<Task>): Promise<Task> {
        const taskRepository: Repository<Task> = this.getConnection().getTreeRepository(Task);
        return taskRepository.save(taskRepository.create(task));
    }

    /**
     * getTasksByParentId
     *
     * Retorna as tarefas que contenham a id informada
     *
     * @param parentId string
     *
     * @returns Array contendo as tarefas
     */
    public getTasksByParentId(parentId: string): Promise<Task[]> {
        return this.getConnection().getRepository(Task).createQueryBuilder('task').where('task.parentId = :id', { id: parentId }).getMany();
    }

    /**
     * update
     *
     * Altera uma tarefa
     *
     * @param task
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
     * @param id
     * @returns
     */
    public delete(id: string): Promise<DeleteResult> {
        return this.getConnection().getRepository(Task).delete(id);
    }
}
