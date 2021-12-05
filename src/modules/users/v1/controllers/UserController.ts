// Modules
import { Request, Response } from 'express';
import { DeepPartial } from 'typeorm';

// Library
import jwt from 'jsonwebtoken';
import { BaseController, User, UserRepository } from '../../../../library';

// Decorators
import { Controller, Get, Middlewares, Post, PublicRoute } from '../../../../decorators';

// Models
import { EnumEndpoints } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

// Validators
import { UserValidator } from '../middlewares/UserValidator';

@Controller(EnumEndpoints.USER_V1)
export class UserController extends BaseController {
    /**
     * @swagger
     * /v1/user/login:
     *   post:
     *     summary: Fazer login
     *     tags: [Users, Login]
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
     *               email: exemplo@email.com
     *               password: senha123
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                  type: string
     *     responses:
     *       $ref: '#/components/responses/baseLogin'
     */
    @Post('/login')
    @PublicRoute()
    @Middlewares(UserValidator.login())
    public async login(req: Request, res: Response): Promise<void> {
        const token: string = jwt.sign({ id: req.body.userRef.id }, process.env.SECRET as string, { expiresIn: '1d' });

        RouteResponse.success(token, res);
    }

    /**
     * @swagger
     * /v1/user/login/validate:
     *   get:
     *     summary: Valida o token do usuário
     *     tags: [Users, Protected routes]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Get('/login/validate')
    @PublicRoute()
    @Middlewares(UserValidator.validateToken())
    public async teste(req: Request, res: Response): Promise<void> {
        RouteResponse.success('', res);
    }

    /**
     * @swagger
     * /v1/user:
     *   post:
     *     summary: Criar um usuário
     *     tags: [Users,Test Routes]
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
     *               email: exemplo@email.com
     *               password: senha123
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                  type: string
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Post()
    @PublicRoute()
    @Middlewares(UserValidator.signUp())
    public async add(req: Request, res: Response): Promise<void> {
        const newUser: DeepPartial<User> = {
            email: req.body.email,
            password: req.body.password
        };

        await new UserRepository().insert(newUser);

        RouteResponse.successCreate(res);
    }
}
