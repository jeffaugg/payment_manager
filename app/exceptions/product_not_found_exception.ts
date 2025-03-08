import { Exception } from '@adonisjs/core/exceptions'

export default class ProductNotFoundException extends Exception {
  public status: number

  constructor(missingProductIds: number[]) {
    super(`Produto(s) não encontrado(s): ${missingProductIds.join(', ')}`)
    this.status = 404
  }
}