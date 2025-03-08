import axios from 'axios';
import { PaymentData, PaymentGateway, PaymentResult, RefundResult } from './interface/IPaymentGateways.js';

export default class Gateway1Service implements PaymentGateway {
  private baseUrl = 'http://localhost:3001';

  async processPayment(data: PaymentData): Promise<PaymentResult> {
    try {
      const loginResponse = await axios.post(`${this.baseUrl}/login`, {
        email: 'dev@betalent.tech',
        token: 'FEC9BB078BF338F464F96B48089EB498',
      });
      const token = loginResponse.data.token;
      
      const response = await axios.post(
        `${this.baseUrl}/transactions`,
        {
          amount: data.amount,
          name: data.name,
          email: data.email,
          cardNumber: data.cardNumber,
          cvv: data.cvv,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { success: true, externalId: response.data.id };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  }

  async refundPayment(transactionId: string): Promise<RefundResult> {
    try {
      await axios.post(`${this.baseUrl}/transactions/${transactionId}/charge_back`);
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  }
}
