import { Controller, Post, Body, UseGuards, Headers } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AuthGuard)
  @Post('create-intent')
  async createIntent(@Body() body: { amount: number; currency?: string }) {
    return this.paymentService.createPaymentIntent(body.amount, body.currency);
  }

  @Post('webhook')
  async webhook(@Body() body: any, @Headers('stripe-signature') sig: string) {
    return this.paymentService.handleWebhook(body, sig);
  }

  @UseGuards(AuthGuard)
  @Post('confirm-intent')
  async confirmIntent(@Body() body: { paymentIntentId: string }) {
    return this.paymentService.confirmPayment(body.paymentIntentId);
  }
}