import ProductNotFoundException from '#exceptions/product_not_found_exception'
import Product from '#models/product'
import Transaction from '#models/transaction'
import TransactionProduct from '#models/transaction_product'
import { inject } from '@adonisjs/core'
import { ClientServiceContract } from './interface/client_service_contract.js'
import PaymentServiceContract from './interface/payment_service_contract.js'
import TransactionNotFoundException from '#exceptions/transaction_not_found_exception'
import { PurchaseServiceContract } from './interface/punchase_service_contracts.js'

export type PurchaseItem = {
  productId: number
  quantity: number
}

export type PurchasePayload = {
  items: PurchaseItem[]
  payment: {
    name: string
    email: string
    cardNumber: string
    cvv: string
  }
}
@inject()
export default class PurchaseService implements PurchaseServiceContract {
  constructor(
    protected clientService: ClientServiceContract,
    protected paymentService: PaymentServiceContract
  ) {}

  /**
   * Valida os produtos informados.
   * Lança ProductNotFoundException se algum produto não existir.
   */
  private async validateProducts(items: PurchaseItem[]): Promise<Product[]> {
    const productIds = items.map((item) => item.productId)
    const products = await Product.query().whereIn('id', productIds)
    if (products.length !== productIds.length) {
      const foundIds = products.map((p) => p.id)
      const missing = productIds.filter((id) => !foundIds.includes(id))
      throw new ProductNotFoundException(missing)
    }
    return products
  }

  /**
   * Processa a compra:
   * - Valida os produtos.
   * - Busca ou cria o cliente e retorna o ID.
   * - Calcula o valor total.
   * - Processa o pagamento.
   * - Registra a transação e os itens na tabela transaction_products.
   */
  public async processPurchase(payload: PurchasePayload) {
    // Valida os produtos e obtém os dados completos dos produtos
    const products = await this.validateProducts(payload.items)

    const clientId = await this.clientService.getOrCreateClient({
      name: payload.payment.name,
      email: payload.payment.email,
    })

    const totalAmount = payload.items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)
      return sum + (product ? product.amount * item.quantity : 0)
    }, 0)

    const paymentResult = await this.paymentService.processPayment({
      amount: totalAmount,
      name: payload.payment.name,
      email: payload.payment.email,
      cardNumber: payload.payment.cardNumber,
      cvv: payload.payment.cvv,
    })

    if (!paymentResult.success) {
      return { success: false, message: paymentResult.message }
    }

    // Inicia uma transação para registrar a compra
    try {
      // Cria a transação geral
      const transaction = await Transaction.create({
        clientId: clientId,
        gatewayId: paymentResult.gatewayRecordId,
        external_id: paymentResult.externalId,
        status: 'paid',
        amount: totalAmount,
        card_last_numbers: payload.payment.cardNumber.slice(-4),
      })

      // Cria os registros de cada item na tabela transaction_products
      for (const item of payload.items) {
        await TransactionProduct.create({
          transactionId: transaction.id,
          productId: item.productId,
          quantity: item.quantity,
        })
      }

      return { success: true, transaction }
    } catch (error) {
      return {
        success: false,
        message: 'An error occurred while processing the transaction.',
        error: error.message,
      }
    }
  }

  /**
   * Processa o reembolso de uma transação:
   * - Chama o PaymentService para processar o reembolso.
   * - Se bem-sucedido, atualiza o status da transação para "refunded".
   */
  public async refundPurchase(
    transactionId: number
  ): Promise<{ success: boolean; message?: string }> {
    const transaction = await Transaction.find(transactionId)

    if (!transaction) {
      throw new TransactionNotFoundException(transactionId)
    }

    const refundResult = await this.paymentService.refundPayment(transaction.id.toString())
    if (!refundResult.success) {
      return { success: false, message: refundResult.message }
    }

    transaction.status = 'refunded'
    await transaction.save()
    return { success: true, message: 'Transação reembolsada com sucesso.' }
  }
}
