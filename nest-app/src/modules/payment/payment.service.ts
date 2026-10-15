import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  async createPaymentIntent(amount: number, currency: string = 'egp') {
    return {
      clientSecret: `pi_test_${Date.now()}_secret_${Math.random().toString(36).slice(2)}`,
      amount,
      currency,
    };
  }

  async confirmPayment(paymentIntentId: string) {
    return { status: 'succeeded', paymentIntentId };
  }

  async handleWebhook(body: any, signature: string) {
    console.log('Webhook received:', body);
    console.log('Signature:', signature);
    return { received: true };
  }
}