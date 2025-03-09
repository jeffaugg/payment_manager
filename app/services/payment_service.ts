import Gateway from '#models/gateway'
import Gateway1Service from '../strategy/Gateway1Service.js'
import Gateway2Service from '../strategy/Gateway2Service.js'
import {
  PaymentData,
  PaymentGateway,
  PaymentResult,
} from '../strategy/interface/IPaymentGateways.js'
import PaymentServiceContract from './interface/payment_service_contract.js'

type ProcessPaymentResult = PaymentResult & {
  gatewayRecordId: number
}

type RefundPaymentResult = {
  success: boolean
  message?: string
  gatewayRecordId: number
}

export default class PaymentService implements PaymentServiceContract {
  /**
   * Retorna uma instância do gateway com base no nome.
   * Você pode estender esse mapeamento conforme necessário.
   */
  private getGatewayInstance(name: string): PaymentGateway {
    const mapping: { [key: string]: any } = {
      Gateway1: new Gateway1Service(),
      Gateway2: new Gateway2Service(),
    }
    return mapping[name]
  }

  /**
   * Busca os gateways ativos no banco de dados, ordenados por prioridade,
   * e tenta processar o pagamento em cada um deles até obter sucesso.
   * @param data Dados do pagamento.
   * @returns O resultado do pagamento.
   */
  public async processPayment(data: PaymentData): Promise<ProcessPaymentResult> {
    // Busca gateways ativos ordenados por prioridade
    const gateways = await Gateway.query().where('is_active', true).orderBy('priority', 'asc')

    for (const gatewayRecord of gateways) {
      const gatewayInstance = this.getGatewayInstance(gatewayRecord.name)
      if (!gatewayInstance) {
        continue
      }
      const result = await gatewayInstance.processPayment(data)
      if (result.success) {
        return { ...result, gatewayRecordId: gatewayRecord.id }
      }
    }
    return {
      success: false,
      message: 'Todos os gateways falharam ao processar o pagamento.',
      gatewayRecordId: 0,
    }
  }

  public async refundPayment(transactionId: string): Promise<RefundPaymentResult> {
    const gateways = await Gateway.query().where('is_active', true).orderBy('priority', 'asc')
    for (const gatewayRecord of gateways) {
      const gatewayInstance = this.getGatewayInstance(gatewayRecord.name)
      if (!gatewayInstance) {
        continue
      }
      const result = await gatewayInstance.refundPayment(transactionId)
      if (result.success) {
        return { ...result, gatewayRecordId: gatewayRecord.id }
      }
    }
    return {
      success: false,
      message: 'Todos os gateways falharam ao processar o reembolso.',
      gatewayRecordId: 0,
    }
  }
}
