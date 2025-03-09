import ProductServiceContract from '#services/interface/product_service_contract'
import { createProductValidator } from '#validators/create_produt'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ProductsController {
  constructor(protected productService: ProductServiceContract) {}

  /**
   * Cria um novo produto.
   */
  public async store({ request, response }: HttpContext) {
    // Valida os dados da requisição
    const payload = await request.validateUsing(createProductValidator)
    const product = await this.productService.createProduct(payload)
    return response.created({ product, message: 'Produto criado com sucesso!' })
  }

  /**
   * Lista todos os produtos com paginação e filtros opcionais.
   */
  public async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const name = request.input('name')
    const amount = request.input('amount')
    const products = await this.productService.listProducts({ page, limit, name, amount })
    return response.ok({ products })
  }

  /**
   * Exibe os detalhes de um produto específico.
   */
  public async show({ params, response }: HttpContext) {
    const product = await this.productService.getProduct(params.id)
    return response.ok({ product })
  }

  /**
   * Atualiza os dados de um produto.
   */
  public async update({ params, request, response }: HttpContext) {
    const payload = request.only(['name', 'amount'])
    const product = await this.productService.updateProduct(params.id, payload)
    return response.ok({ product, message: 'Produto atualizado com sucesso.' })
  }

  /**
   * Remove um produto.
   */
  public async destroy({ params, response }: HttpContext) {
    await this.productService.deleteProduct(params.id)
    return response.ok({ message: 'Produto removido com sucesso.' })
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: "Produto Exemplo"
 *         amount:
 *           type: number
 *           example: 1500
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 * /products:
 *   post:
 *     summary: Cria um novo produto
 *     tags:
 *       - Produtos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Produto Exemplo"
 *               amount:
 *                 type: number
 *                 example: 1500
 *     responses:
 *       201:
 *         description: Produto criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *                 message:
 *                   type: string
 *                   example: "Produto criado com sucesso!"
 *   get:
 *     summary: Lista todos os produtos com paginação e filtros opcionais.
 *     tags:
 *       - Produtos
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
 *       - name: amount
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Lista paginada de produtos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     meta:
 *                       type: object
 *                     links:
 *                       type: object
 *
 * /products/{id}:
 *   get:
 *     summary: Exibe os detalhes de um produto específico
 *     tags:
 *       - Produtos
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Detalhes do produto.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado.
 *   put:
 *     summary: Atualiza os dados de um produto
 *     tags:
 *       - Produtos
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Produto Atualizado"
 *               amount:
 *                 type: number
 *                 example: 2000
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *                 message:
 *                   type: string
 *                   example: "Produto atualizado com sucesso."
 *   delete:
 *     summary: Remove um produto
 *     tags:
 *       - Produtos
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Produto removido com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Produto removido com sucesso."
 */
