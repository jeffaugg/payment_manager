import { Exception } from '@adonisjs/core/exceptions'

export default class TransactionNotFoundException extends Exception {
  public status: number

  constructor(unfoundTransactionIds: number) {
    super(`Transação não encontrado(s): ${unfoundTransactionIds}`)
    this.status = 404
  }
}
