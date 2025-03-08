import Client from '#models/client'
import type { HttpContext } from '@adonisjs/core/http'

export default class ClientsController {
  /**
   * Lista todos os clientes.
   */
  public async index({ response }: HttpContext) {
    const clients = await Client.all()
    return response.ok({ clients })
  }

  /**
   * Exibe os detalhes de um cliente e todas as suas compras.
   * Utiliza o relacionamento 'transactions' para carregar as compras e, dentro de cada transação, carrega os itens e o gateway.
   */
  public async show({ params, response }: HttpContext) {
    const client = await Client.findOrFail(params.id)
    await client.load('transactions', (query) => {
      query.preload('transactionProducts', (qp) => {
        qp.preload('product')
      }).preload('gateway')
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
 *     summary: Lista todos os clientes
 *     tags:
 *       - Clientes
 *     responses:
 *       200:
 *         description: Lista de clientes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clients:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Client'
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
 *                   $ref: '#/components/schemas/Client'
 *       404:
 *         description: Cliente não encontrado.
 */