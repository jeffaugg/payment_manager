import ProductService from '#services/product_service'
import { createProductValidator } from '#validators/create_produt'
import type { HttpContext } from '@adonisjs/core/http'



export default class ProductsController {
  private productService = new ProductService()

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
   * Lista todos os produtos.
   */
  public async index({ response }: HttpContext) {
    const products = await this.productService.listProducts()
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
 * /product:
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
 *     summary: Lista todos os produtos
 *     tags:
 *       - Produtos
 *     responses:
 *       200:
 *         description: Lista de produtos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *
 * /product/{id}:
 *   get:
 *     summary: Exibe os detalhes de um produto específico
 *     tags:
 *       - Produtos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do produto.
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
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do produto.
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
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do produto.
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