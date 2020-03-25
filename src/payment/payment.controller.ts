import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentOrderDto } from './dto/payment-order';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('/')
  async generatePaymentOrder(
    @Body(ValidationPipe) createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentOrderDto> {
    return this.paymentService.generatePaymentOrder(createPaymentDto);
  }
}
