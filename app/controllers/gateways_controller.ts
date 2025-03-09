import Gateway from '#models/gateway'
import { updateGatewayValidator } from '#validators/update_gateway'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Controlador responsável por gerenciar os gateways de pagamento.
 */
export default class GatewaysController {
  public async index({ response }: HttpContext) {
    const gateways = await Gateway.all()
    return response.ok({ gateways })
  }

  /**
   * Exibe os detalhes de um gateway específico.
   **/
  public async show({ params, response }: HttpContext) {
    const gateway = await Gateway.findOrFail(params.id)
    return response.ok({ gateway })
  }

  /**
   * Atualiza os dados de um gateway.
   **/
  public async update({ params, request, response }: HttpContext) {
    const gateway = await Gateway.findOrFail(params.id)
    const data = await request.validateUsing(updateGatewayValidator)
    gateway.merge(data)
    await gateway.save()
    return response.ok({ gateway, message: 'Gateway atualizado com sucesso.' })
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Gateway:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: "Gateway1"
 *         isActive:
 *           type: boolean
 *           example: true
 *         priority:
 *           type: number
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 * /gateways:
 *   get:
 *     summary: Lista todos os gateways
 *     tags:
 *       - Gateways
 *     responses:
 *       200:
 *         description: Lista de gateways.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gateways:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Gateway'
 *
 * /gateways/{id}:
 *   get:
 *     summary: Exibe os detalhes de um gateway específico
 *     tags:
 *       - Gateways
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do gateway.
 *     responses:
 *       200:
 *         description: Detalhes do gateway.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gateway:
 *                   $ref: '#/components/schemas/Gateway'
 *       404:
 *         description: Gateway não encontrado.
 *
 *   put:
 *     summary: Atualiza os dados de um gateway.
 *     tags:
 *       - Gateways
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do gateway.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               priority:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Gateway atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gateway:
 *                   $ref: '#/components/schemas/Gateway'
 *                 message:
 *                   type: string
 *                   example: "Gateway atualizado com sucesso."
 *       400:
 *         description: Dados inválidos.
 */
