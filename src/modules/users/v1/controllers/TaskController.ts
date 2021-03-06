// Modules
import { Request, Response } from 'express';
import { DeepPartial } from 'typeorm';

// Library
import { BaseController, TaskRepository } from '../../../../library';

// Decorators
import { Controller, Delete, Get, Middlewares, Post, Put } from '../../../../decorators';

// Models
import { EnumEndpoints, TFilteredTask } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

// Entities
import { Task } from '../../../../library/database/entity';

// Validators
import { TaskValidator } from '../middlewares/TaskValidator';

@Controller(EnumEndpoints.TASKS_V1)
export class TaskController extends BaseController {
    /**
     * @swagger
     * /v1/user/tasks:
     *   post:
     *     summary: Cria uma task
     *     tags: [Tasks]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             example:
     *               description: some description
     *             required:
     *               - description
     *             properties:
     *               description:
     *                 type: string
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       $ref: '#/components/responses/baseCreate'
     */
    @Post()
    @Middlewares(TaskValidator.post())
    public async create(req: Request, res: Response): Promise<void> {
        const task: DeepPartial<Task> = {
            description: req.body.description,
            parentId: req.body.userRef.id
        };

        await new TaskRepository().insert(task);

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     * /v1/user/tasks:
     *   get:
     *     summary: Retorna uma lista de tasks de um usuário
     *     tags: [Tasks]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       $ref: '#/components/responses/taskGet'
     */
    @Get()
    @Middlewares(TaskValidator.get())
    public async get(req: Request, res: Response): Promise<void> {
        const taskRepository = new TaskRepository();
        const tasks: TFilteredTask[] = await taskRepository.getByParentId(req.body.userRef.id);
        RouteResponse.success(tasks, res);
    }

    /**
     * @swagger
     * /v1/user/tasks:
     *   put:
     *     summary: Altera a task com o id informado
     *     tags: [Tasks]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             example:
     *               id: 61b016a680817a00379f1e4c
     *               description: some description
     *             required:
     *               - id
     *               - description
     *             properties:
     *               id:
     *                 type: string
     *               description:
     *                 type: string
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Put()
    @Middlewares(TaskValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const task: Task = req.body.taskRef;

        task.description = req.body.description;

        await new TaskRepository().update(task);

        const filteredTask: TFilteredTask = {
            id: task.id,
            description: task.description
        };

        RouteResponse.success(filteredTask, res);
    }

    /**
     * @swagger
     * /v1/user/tasks/{taskId}:
     *   delete:
     *     summary: Apaga uma task definitivamente
     *     tags: [Tasks]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: taskId
     *         schema:
     *           type: string
     *         required: true
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       $ref: '#/components/responses/baseEmpty'
     */
    @Delete('/:id')
    @Middlewares(TaskValidator.delete())
    public async remove(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        await new TaskRepository().delete(id);

        RouteResponse.successEmpty(res);
    }
}
