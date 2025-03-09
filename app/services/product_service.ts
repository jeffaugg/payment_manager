import Product from '#models/product'
import ProductServiceContract from './interface/product_service_contract.js'

export default class ProductService implements ProductServiceContract {
  /**
   * Cria um novo produto.
   * @param payload Dados validados do produto.
   * @returns O produto criado.
   */
  public async createProduct(payload: { name: string; amount: number }): Promise<Product> {
    const product = await Product.create(payload)
    return product
  }

  /**
   * Lista todos os produtos com paginação e filtros opcionais.
   * @param options Objeto contendo paginação e filtros.
   * @returns Um objeto paginado contendo os produtos.
   */
  public async listProducts(options: {
    page?: number
    limit?: number
    name?: string
    amount?: number
  }): Promise<any> {
    const { page = 1, limit = 10, name, amount } = options
    const query = Product.query()

    if (name) {
      query.where('name', 'like', `%${name}%`)
    }

    if (amount) {
      query.where('amount', amount)
    }

    return await query.paginate(page, limit)
  }

  /**
   * Obtém um produto pelo id.
   * @param id Identificador do produto.
   * @returns O produto encontrado ou lança uma exceção.
   */
  public async getProduct(id: number): Promise<Product> {
    return await Product.findOrFail(id)
  }

  /**
   * Atualiza um produto.
   * @param id Identificador do produto.
   * @param payload Dados a serem atualizados.
   * @returns O produto atualizado.
   */
  public async updateProduct(
    id: number,
    payload: Partial<{ name: string; amount: number }>
  ): Promise<Product> {
    const product = await Product.findOrFail(id)
    product.merge(payload)
    await product.save()
    return product
  }

  /**
   * Remove um produto.
   * @param id Identificador do produto a ser removido.
   */
  public async deleteProduct(id: number): Promise<void> {
    const product = await Product.findOrFail(id)
    await product.delete()
  }
}
