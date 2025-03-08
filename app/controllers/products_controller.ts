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


