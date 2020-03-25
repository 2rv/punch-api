import { Injectable } from '@nestjs/common';
import { Translate } from 'src/utils';
import { Errors } from './enum/errors.enum';
import { PaymentDataDto } from './dto/payment-data.dto';
import * as BitcoinGateway from 'bitcoin-receive-payments';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentOrderDto } from './dto/payment-order';

@Injectable()
export class PaymentService {
  async generatePaymentOrder(
    createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentOrderDto> {
    const { id } = createPaymentDto;

    const paymentOrder: PaymentOrderDto = {
      id,
      address: '1K2xWPtGsvg5Sa2X7URZ5VfU8xS62McbXz',
      // expiration: 14 * 60 * 1000,
      expiration: 30000,
    };

    return paymentOrder;
  }
}
