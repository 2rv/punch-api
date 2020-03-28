import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { Translate } from '../utils';
import { Errors } from './enum/errors.enum';
import { User } from 'src/auth/user.entity';
import { BitcoinKeyRepository } from './bitcoin-key.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BitcoinPayment } from './bitcoin-payment.entity';
import { BitcoinPaymentRepository } from './bitcoin-payment.repository';
import { resolve } from 'dns';

const PAYMENT_UPDATE_INTERVAL = 600000; // 10m
const PAYMENT_MINUTES_LIMIT = 60; // 60m
@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(BitcoinKeyRepository)
    private bitcoinKeyRepository: BitcoinKeyRepository,
    @InjectRepository(BitcoinPaymentRepository)
    private bitcoinPaymentRepository: BitcoinPaymentRepository,
  ) {}

  async generateBitcoinAddress(user: User): Promise<{ address }> {
    if (user.bitcoinPaymentAddress === null) {
      const address = await this.bitcoinKeyRepository.createKeyAndAddress();
      user.bitcoinPaymentAddress = address;
      await user.save();
      return { address };
    } else {
      return { address: user.bitcoinPaymentAddress };
    }
  }

  async checkBitcoinAddressPayments(user: User): Promise<void> {
    const { id, bitcoinPaymentAddress } = user;

    const transactionList = await BitcoinPayment.getTransactionListByAddress(
      bitcoinPaymentAddress,
    );

    if (transactionList.length !== 0) {
      const lastPayment: BitcoinPayment = await this.bitcoinPaymentRepository.getLastPaymentByUserId(
        id,
      );

      const newTransactionList = transactionList.filter(({ time }) => {
        if (!lastPayment) {
          return true;
        }

        return time > lastPayment.transactionCreateDate;
      });

      if (newTransactionList.length !== 0) {
        await this.createNewPayments(newTransactionList, user);
      }
    }
  }

  async createNewPayments(transactionList, user: User) {
    const paymentList: BitcoinPayment[] = await Promise.all(
      transactionList.map(async ({ hash, time, result }) => {
        const payment = new BitcoinPayment();
        payment.address = user.bitcoinPaymentAddress;
        payment.transaction = hash;
        payment.user = user;
        payment.transactionCreateDate = time;
        await payment.calcAmount(result);
        return payment;
      }),
    );

    await this.bitcoinPaymentRepository.save(paymentList);
    await this.setBitcoinPaymentUpdateInterval(paymentList);
  }

  async setBitcoinPaymentUpdateInterval(paymentList: BitcoinPayment[]) {
    const startedDate = new Date();
    startedDate.setMinutes(startedDate.getMinutes() + PAYMENT_MINUTES_LIMIT);

    await new Promise(async resolve1 => {
      await paymentList.forEach(async (Payment: BitcoinPayment) => {
        await new Promise(async resolve2 => {
          const timer = setInterval(async () => {
            const currentDate = new Date();
            if (currentDate.getTime() >= startedDate.getTime()) {
              clearInterval(timer);
            }
            const payment = await this.updateBitcoinPaymentData(
              Payment,
              Payment.user,
            );
            if (payment.confirm) {
              clearInterval(timer);
            }
          }, PAYMENT_UPDATE_INTERVAL);
          resolve2();
        });
      });
      resolve1();
    });
  }

  async updateBitcoinPaymentData(
    payment: BitcoinPayment,
    user: User,
  ): Promise<BitcoinPayment> {
    if (!payment.confirm) {
      await payment.updateTransactionStatus();
      if (payment.confirm) {
        await user.updateBalance(payment.amount);
        await payment.save();
      }
    }

    return payment;
  }

  async checkAndUpdateBitcoinPaymentData(
    transaction,
    user: User,
  ): Promise<BitcoinPayment> {
    const payment = await this.bitcoinPaymentRepository.findOne({
      where: {
        address: user.bitcoinPaymentAddress,
        user,
        transaction,
      },
      cache: 60000, // 1 min
    });

    if (!payment) {
      throw new NotFoundException(
        Translate(Errors.BITCOIN_PAYMENT_WITH_THIS_TRANSACTION_HASH_NOT_FOUND),
      );
    }

    return this.updateBitcoinPaymentData(payment, user);
  }

  async checkAndUpdateBitcoinPaymentListData(user: User): Promise<void> {
    const paymentList = await this.bitcoinPaymentRepository.find({
      where: {
        address: user.bitcoinPaymentAddress,
        user,
        confirm: false,
      },
      cache: 60000, // 1 min
    });

    if (paymentList.length !== 0) {
      await new Promise(async res => {
        paymentList.forEach(async Payment => {
          await this.updateBitcoinPaymentData(Payment, user);
        });
        res();
      });
    }
  }

  async getBitcoinPaymetList(user: User): Promise<BitcoinPayment[]> {
    const paymentList = await this.bitcoinPaymentRepository.find({
      where: {
        user,
      },
    });

    if (paymentList.length === 0) {
      throw new NotFoundException(
        Translate(Errors.BITCOIN_PAYMENT_LIST_IS_EMPTY),
      );
    }

    return paymentList;
  }
}
