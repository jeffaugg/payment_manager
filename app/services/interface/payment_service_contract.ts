import { PaymentData, PaymentResult } from '../../strategy/interface/IPaymentGateways.js'

type ProcessPaymentResult = PaymentResult & {
  gatewayRecordId: number
}

type RefundPaymentResult = {
  success: boolean
  message?: string
  gatewayRecordId: number
}

export default abstract class PaymentServiceContract {
  public abstract processPayment(data: PaymentData): Promise<ProcessPaymentResult>

  /**
   * Processa o reembolso de um pagamento.
   * @param transactionId ID da transação a ser reembolsada.
   * @returns O resultado do reembolso.
   */
  public abstract refundPayment(transactionId: string): Promise<RefundPaymentResult>
}
