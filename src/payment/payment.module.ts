import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BitcoinKeyRepository } from './bitcoin-key.repository';
import { BitcoinPaymentRepository } from './bitcoin-payment.repository';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([BitcoinKeyRepository, BitcoinPaymentRepository]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
