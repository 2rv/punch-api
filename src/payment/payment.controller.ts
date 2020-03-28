import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Param,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { BitcoinPaymentAddressGuard } from './bitcoin-address.guard';
import { BitcoinPayment } from './bitcoin-payment.entity';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get('/address/bitcoin')
  @UseGuards(AuthGuard())
  async generateBitcoinAddress(
    @GetUser() user: User,
  ): Promise<{ address: string }> {
    return this.paymentService.generateBitcoinAddress(user);
  }

  @Get('/balance')
  @UseGuards(AuthGuard())
  async getUserBalance(@GetUser() user: User): Promise<{ balance: number }> {
    return { balance: user.balance };
  }

  @Get('/check/bitcoin')
  @UseGuards(AuthGuard(), BitcoinPaymentAddressGuard)
  async checkBitcoinAddressPayments(@GetUser() user: User): Promise<void> {
    return this.paymentService.checkBitcoinAddressPayments(user);
  }

  @Get('/status/bitcoin')
  @UseGuards(AuthGuard(), BitcoinPaymentAddressGuard)
  async checkBitcoinPaymentListStatus(@GetUser() user: User): Promise<void> {
    return this.paymentService.checkAndUpdateBitcoinPaymentListData(user);
  }

  @Get('/status/bitcoin/:id')
  @UseGuards(AuthGuard(), BitcoinPaymentAddressGuard)
  async checkBitcoinPaymentStatus(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<BitcoinPayment> {
    return this.paymentService.checkAndUpdateBitcoinPaymentData(id, user);
  }

  @Get('/history/bitcoin')
  @UseGuards(AuthGuard(), BitcoinPaymentAddressGuard)
  async getHistoryBitcoinPayment(
    @GetUser() user: User,
  ): Promise<BitcoinPayment[]> {
    return this.paymentService.getBitcoinPaymetList(user);
  }
}
