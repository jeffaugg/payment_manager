import axios from 'axios';
import { PaymentData, PaymentGateway, PaymentResult, RefundResult } from './interface/IPaymentGateways.js';

export default class Gateway2Service implements PaymentGateway {
  private baseUrl = 'http://localhost:3002';

  async processPayment(data: PaymentData): Promise<PaymentResult> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/transacoes`,
        {
          valor: data.amount,
          nome: data.name,
          email: data.email,
          numeroCartao: data.cardNumber,
          cvv: data.cvv,
        },
        {
          headers: {
            'Gateway-Auth-Token': 'tk_f2198cc671b5289fa856',
            'Gateway-Auth-Secret': '3d15e8ed6131446ea7e3456728b1211f',
            'Content-Type': 'application/json',
          },
        }
      );
      return { success: true, externalId: response.data.id };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  }

  async refundPayment(transactionId: string): Promise<RefundResult> {
    try {
      await axios.post(
        `${this.baseUrl}/transacoes/reembolso`,
        { id: transactionId },
        {
          headers: {
            'Gateway-Auth-Token': 'tk_f2198cc671b5289fa856',
            'Gateway-Auth-Secret': '3d15e8ed6131446ea7e3456728b1211f',
            'Content-Type': 'application/json',
          },
        }
      );
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  }
}
