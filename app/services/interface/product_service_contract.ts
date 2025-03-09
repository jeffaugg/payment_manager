import Product from '#models/product'

export default abstract class ProductServiceContract {
  /**
   * Cria um novo produto.
   * @param payload Dados validados do produto.
   * @returns O produto criado.
   */
  public abstract createProduct(payload: { name: string; amount: number }): Promise<Product>

  /**
   * Lista todos os produtos.
   * @returns Um array de produtos.
   */
  public abstract listProducts(): Promise<Product[]>

  /**
   * Obtém um produto pelo id.
   * @param id Identificador do produto.
   * @returns O produto encontrado ou lança uma exceção.
   */
  public abstract getProduct(id: number): Promise<Product>

  /**
   * Atualiza um produto.
   * @param id Identificador do produto.
   * @param payload Dados a serem atualizados.
   * @returns O produto atualizado.
   */
  public abstract updateProduct(
    id: number,
    payload: Partial<{ name: string; amount: number }>
  ): Promise<Product>

  /**
   * Remove um produto.
   * @param id Identificador do produto a ser removido.
   */
  public abstract deleteProduct(id: number): Promise<void>
}
