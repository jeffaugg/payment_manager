import Transaction from '#models/transaction'
import { PurchasePayload } from '#services/purchase_service'

export abstract class PurchaseServiceContract {
  /**
   * Processa a compra com os dados fornecidos.
   * @param payload Dados da compra.
   * @returns Um objeto com sucesso, a transação criada (se aplicável) e/ou mensagem de erro.
   */
  abstract processPurchase(
    payload: PurchasePayload
  ): Promise<{ success: boolean; transaction?: Transaction; message?: string; error?: string }>

  /**
   * Processa o reembolso de uma transação pelo seu ID.
   * @param transactionId ID da transação.
   * @returns Um objeto indicando se o reembolso foi bem-sucedido e/ou uma mensagem.
   */
  abstract refundPurchase(transactionId: number): Promise<{ success: boolean; message?: string }>
}
