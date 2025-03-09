import Client from '#models/client'
import type { HttpContext } from '@adonisjs/core/http'

export default class ClientsController {
  /**
   * Lista todos os clientes com paginação e filtro por nome e email.
   *
   * Query Parameters:
   * - page: Número da página (default: 1)
   * - limit: Quantidade de registros por página (default: 10)
   * - name: Filtro por nome (parcial)
   * - email: Filtro por email (parcial)
   */
  public async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const name = request.input('name')
    const email = request.input('email')

    const query = Client.query()

    if (name) {
      query.where('name', 'like', `%${name}%`)
    }

    if (email) {
      query.where('email', 'like', `%${email}%`)
    }

    const clients = await query.paginate(page, limit)
    return response.ok({ clients })
  }

  /**
   * Exibe os detalhes de um cliente e todas as suas compras.
   * Utiliza o relacionamento 'transactions' para carregar as compras e, dentro de cada transação, carrega os itens e o gateway.
   */
  public async show({ params, response }: HttpContext) {
    const client = await Client.findOrFail(params.id)
    await client.load('transactions', (query) => {
      query
        .preload('transactionProducts', (qp) => {
          qp.preload('product')
        })
        .preload('gateway')
    })
    return response.ok({ client })
  }
}
/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         transactions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Transaction'
 *
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         clientId:
 *           type: number
 *         gatewayId:
 *           type: number
 *         external_id:
 *           type: string
 *         status:
 *           type: string
 *         amount:
 *           type: number
 *         card_last_numbers:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         transactionProducts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TransactionProduct'
 *
 *     TransactionProduct:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         transactionId:
 *           type: number
 *         productId:
 *           type: number
 *         quantity:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 * /clients:
 *   get:
 *     summary: Lista todos os clientes paginados
 *     tags:
 *       - Clientes
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *       - name: name
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: email
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de clientes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clients:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Client'
 *                     meta:
 *                       type: object
 *                     links:
 *                       type: object
 *
 * /clients/{id}:
 *   get:
 *     summary: Exibe os detalhes de um cliente e todas as suas compras.
 *     tags:
 *       - Clientes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do cliente.
 *     responses:
 *       200:
 *         description: Detalhes do cliente com suas transações.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 client:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Client'
 *                     meta:
 *                       type: object
 *                     links:
 *                       type: object
 *       404:
 *         description: Cliente não encontrado.
 */
