import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentRequestBody } from '../types/payment.type';
import { UserService } from 'modules/user/services/user.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @Inject('SECRET_STRIPE_KEY') private readonly stripeApiKey: string,
    private userService: UserService,
  ) {
    this.stripe = new Stripe(this.stripeApiKey, {
      apiVersion: '2024-04-10',
      typescript: true
    });
  }

  public async createPayment({ amount, paymentMethod, userId }: PaymentRequestBody): Promise<any> {
    const payment = await this.stripe.paymentIntents.create({
      amount,
      currency: 'uah',
      payment_method: paymentMethod.paymentMethod.id
    })
    if (payment.object === "payment_intent") {
      await this.userService.updateBalanceUserById(userId, { balance: amount })
    }

    return payment;
  }

  public async rentBike({ amount, userId }: { amount: number, userId: number }): Promise<any> {
    await this.userService.updateBalanceUserById(userId, { balance: -amount })
  }
}
