// Libraries
import { RequestHandler } from 'express';
import { Meta, Schema } from 'express-validator';

// Entities
import { Task } from '../../../../library/database/entity';

// Repositories
import { TaskRepository } from '../../../../library/database/repository/TaskRepository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

/**
 * TaskValidator
 *
 * classe de validadores para o endpoint de tasks
 */
export class TaskValidator extends BaseValidator {
    /**
     * model
     *
     * Schema para validação no controller de tasks
     */
    private static model: Schema = {
        id: {
            ...BaseValidator.validators.id(new TaskRepository()),
            errorMessage: 'Tarefa não encontrada'
        },
        description: {
            in: 'body',
            isString: true,
            isLength: {
                options: {
                    min: 4
                }
            }
        },
        parentId: {
            errorMessage: 'Tarefa não pertence ao usuário',
            custom: {
                options: (_: string, { req }: Meta) => {
                    const { taskRef, userRef } = req.body;
                    return taskRef.parentId.toString() === userRef.id.toString() ? Promise.resolve() : Promise.reject();
                }
            }
        },
        duplicate: {
            errorMessage: 'Já existe uma tarefa com essa descrição',
            custom: {
                options: async (_: string, { req }: Meta) => {
                    const { userRef, description } = req.body;
                    const taskRepository = new TaskRepository();
                    const task: Task | undefined = await taskRepository.findByDescription(userRef.id, description);
                    return task?.description !== description ? Promise.resolve() : Promise.reject();
                }
            }
        }
    };

    /**
     * put
     *
     * @returns Lista de validadores
     */
    public static put(): RequestHandler[] {
        return TaskValidator.validationList({
            token: BaseValidator.validators.token,
            id: TaskValidator.model.id,
            parentId: TaskValidator.model.parentId,
            description: TaskValidator.model.description,
            duplicate: TaskValidator.model.duplicate
        });
    }

    /**
     * post
     *
     * @returns Lista de validadores
     */
    public static post(): RequestHandler[] {
        return TaskValidator.validationList({
            token: BaseValidator.validators.token,
            description: TaskValidator.model.description,
            duplicate: TaskValidator.model.duplicate
        });
    }

    /**
     * delete
     *
     * @returns Lista de validadores
     */
    public static delete(): RequestHandler[] {
        return TaskValidator.validationList({
            token: BaseValidator.validators.token,
            id: TaskValidator.model.id,
            parentId: TaskValidator.model.parentId
        });
    }

    /**
     * get
     *
     * @returns Lista de validadores
     */
    public static get(): RequestHandler[] {
        return TaskValidator.validationList({
            token: BaseValidator.validators.token
        });
    }
}
