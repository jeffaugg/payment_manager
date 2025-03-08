import type { HttpContext } from '@adonisjs/core/http'
import UsersService from "#services/user_service"
import { createUserValidator } from '#validators/create_user'

export default class UsersController {
    private usersService = new UsersService()

    /**
     * Criação de um novo usuário.
     * Apenas usuários com role ADMIN podem criar novos usuários.
     */
    public async store({ request, auth, response }: HttpContext) {
      if (auth.user?.role !== 'ADMIN') {
        return response.unauthorized({ message: 'Apenas administradores podem criar usuários.' })
      }
  
      const payload = await request.validateUsing(createUserValidator)
  
      const user = await this.usersService.createUser(payload)
      return response.created({ user, message: 'Usuário criado com sucesso!' })
    }
  
    /**
     * Lista todos os usuários.
     */
    public async index({ response }: HttpContext) {
      const users = await this.usersService.listUsers()
      return response.ok({ users })
    }
  
    /**
     * Exibe os detalhes de um usuário específico.
     */
    public async show({ params, response }: HttpContext) {
      const user = await this.usersService.getUser(params.id)
      return response.ok({ user })
    }
  
    /**
     * Atualiza os dados de um usuário.
     * Apenas administradores podem atualizar usuários.
     */
    public async update({ params, request, auth, response }: HttpContext) {
      if (auth.user?.role !== 'ADMIN') {
        return response.unauthorized({ message: 'Apenas administradores podem atualizar usuários.' })
      }
  
      const payload = request.only(['fullName', 'email', 'role'])
      const user = await this.usersService.updateUser(params.id, payload)
      return response.ok({ user, message: 'Usuário atualizado com sucesso.' })
    }
  
    /**
     * Remove um usuário.
     * Apenas administradores podem excluir usuários.
     */
    public async destroy({ params, auth, response }: HttpContext) {
      if (auth.user?.role !== 'ADMIN') {
        return response.unauthorized({ message: 'Apenas administradores podem remover usuários.' })
      }
      await this.usersService.deleteUser(params.id)
      return response.ok({ message: 'Usuário removido com sucesso.' })
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         fullName:
 *           type: string
 *           example: "João da Silva"
 *         email:
 *           type: string
 *           example: "joao.silva@example.com"
 *         role:
 *           type: string
 *           enum: [ADMIN, MANAGER, FINANCE, USER]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 * /user:
 *   post:
 *     summary: Cria um novo usuário
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "João da Silva"
 *               email:
 *                 type: string
 *                 example: "joao.silva@example.com"
 *               password:
 *                 type: string
 *                 example: "senhaSegura123"
 *               role:
 *                 type: string
 *                 enum: [ADMIN, MANAGER, FINANCE, USER]
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "Usuário criado com sucesso!"
 *       401:
 *         description: Acesso não autorizado.
 *
 *   get:
 *     summary: Lista todos os usuários
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *
 * /user/{id}:
 *   get:
 *     summary: Exibe os detalhes de um usuário específico
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do usuário.
 *     responses:
 *       200:
 *         description: Detalhes do usuário.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado.
 *   put:
 *     summary: Atualiza os dados de um usuário
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "João Atualizado"
 *               email:
 *                 type: string
 *                 example: "joao.atualizado@example.com"
 *               role:
 *                 type: string
 *                 enum: [ADMIN, MANAGER, FINANCE, USER]
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "Usuário atualizado com sucesso."
 *       401:
 *         description: Acesso não autorizado.
 *   delete:
 *     summary: Remove um usuário
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do usuário.
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário removido com sucesso."
 *       401:
 *         description: Acesso não autorizado.
 */