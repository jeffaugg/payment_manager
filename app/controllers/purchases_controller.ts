import Transaction from '#models/transaction'
import { PurchaseServiceContract } from '#services/interface/punchase_service_contracts'
import { purchaseValidator } from '#validators/create_purchase'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
@inject()
export default class PurchaseController {
  constructor(protected purchaseService: PurchaseServiceContract) {}

  public async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(purchaseValidator)
      const result = await this.purchaseService.processPurchase(payload)
      if (!result.success) {
        return response.badRequest({
          message: 'Falha ao processar o pagamento',
          error: result.message,
        })
      }
      return response.ok({ message: 'Compra processada com sucesso!', data: result.transaction })
    } catch (error: any) {
      if (error.status === 404) {
        return response.status(404).json({ message: error.message })
      }
      return response
        .status(500)
        .json({ message: 'Erro ao processar a compra.', error: error.message })
    }
  }

  /**
   * Lista todas as compras (transações) registradas com paginação.
   * Preload: Carrega informações do cliente, gateway e itens da transação (com produto).
   */
  public async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const purchases = await Transaction.query()
      .preload('client')
      .preload('gateway')
      .preload('transactionProducts', (query) => {
        query.preload('product')
      })
      .paginate(page, limit)
    return response.ok({ purchases })
  }

  /**
   * Exibe os detalhes de uma compra específica.
   * Inclui informações do cliente, gateway e os itens comprados.
   */
  public async show({ params, response }: HttpContext) {
    const purchase = await Transaction.query()
      .where('id', params.id)
      .preload('client')
      .preload('gateway')
      .preload('transactionProducts', (query) => {
        query.preload('product')
      })
      .firstOrFail()
    return response.ok({ purchase })
  }

  public async refund({ params, auth, response }: HttpContext) {
    if (auth.user?.role !== 'FINANCE' && auth.user?.role !== 'ADMIN') {
      return response.unauthorized({
        message: 'Apenas o departamento financeiro ou administradores podem realizar reembolsos.',
      })
    }

    const transactionId = params.id
    try {
      const result = await this.purchaseService.refundPurchase(transactionId)
      if (result.success) {
        return response.ok({ message: 'Reembolso realizado com sucesso!', data: result })
      } else {
        return response.badRequest({
          message: 'Falha ao processar o reembolso',
          error: result.message,
        })
      }
    } catch (error: any) {
      return response
        .status(error.status)
        .json({ message: 'Erro ao processar o reembolso.', error: error.message })
    }
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     PurchaseItem:
 *       type: object
 *       properties:
 *         productId:
 *           type: number
 *           example: 1
 *         quantity:
 *           type: number
 *           example: 2
 *     PaymentData:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Comprador Exemplo"
 *         email:
 *           type: string
 *           example: "comprador@example.com"
 *         cardNumber:
 *           type: string
 *           example: "5569000000006063"
 *         cvv:
 *           type: string
 *           example: "010"
 *     PurchasePayload:
 *       type: object
 *       properties:
 *         client:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "Cliente Exemplo"
 *             email:
 *               type: string
 *               example: "cliente@example.com"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PurchaseItem'
 *         payment:
 *           $ref: '#/components/schemas/PaymentData'
 *
 * /purchase:
 *   post:
 *     summary: Processa uma compra de múltiplos produtos (Nível 3)
 *     tags:
 *       - Compras
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PurchasePayload'
 *     responses:
 *       200:
 *         description: Compra processada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Compra processada com sucesso!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     clientId:
 *                       type: number
 *                     status:
 *                       type: string
 *                     amount:
 *                       type: number
 *       400:
 *         description: Falha ao processar o pagamento.
 *       404:
 *         description: Produto não encontrado.
 *   get:
 *     summary: Lista todas as compras (transações) com paginação.
 *     tags:
 *       - Compras
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
 *     responses:
 *       200:
 *         description: Lista paginada de compras.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 purchases:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Transaction'
 *                     meta:
 *                       type: object
 *                     links:
 *                       type: object
 *
 * /purchase/{id}:
 *   get:
 *     summary: Exibe os detalhes de uma compra específica
 *     tags:
 *       - Compras
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID da compra.
 *     responses:
 *       200:
 *         description: Detalhes da compra.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 purchase:
 *                   $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Compra não encontrada.
 *
 * /purchase/{id}/refund:
 *   post:
 *     summary: Realiza o reembolso de uma compra
 *     tags:
 *       - Compras
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID da compra a ser reembolsada.
 *     responses:
 *       200:
 *         description: Reembolso realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reembolso realizado com sucesso!"
 *       400:
 *         description: Falha ao processar o reembolso.
 *       401:
 *         description: Acesso não autorizado.
 */
