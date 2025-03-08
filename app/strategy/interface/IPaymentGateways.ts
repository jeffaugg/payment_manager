export type PaymentData = {
    amount: number;
    name: string;
    email: string;
    cardNumber: string;
    cvv: string;
  };
  
  export type PaymentResult = {
    success: boolean;
    externalId?: string;
    message?: string;
  };
  
  export type RefundResult = {
    success: boolean;
    message?: string;
  };
  
  export interface PaymentGateway {
    processPayment(data: PaymentData): Promise<PaymentResult>;
    refundPayment(transactionId: string): Promise<RefundResult>;
  }
  