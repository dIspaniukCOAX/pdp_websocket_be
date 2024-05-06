import { PaymentMethodResult } from '@stripe/stripe-js';

export interface PaymentRequestBody {
    userId: number;
    amount: number;
    paymentMethod: PaymentMethodResult;
}