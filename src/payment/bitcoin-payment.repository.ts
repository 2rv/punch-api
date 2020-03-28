import { Repository, EntityRepository } from 'typeorm';
import { BitcoinPayment } from './bitcoin-payment.entity';

@EntityRepository(BitcoinPayment)
export class BitcoinPaymentRepository extends Repository<BitcoinPayment> {
  async getLastPaymentByUserId(id: number): Promise<BitcoinPayment> {
    const query = this.createQueryBuilder('bitcoin_payment');

    query.where('bitcoin_payment.userId = :id', {
      id,
    });
    query.select(['bitcoin_payment.transactionCreateDate']);
    query.orderBy('bitcoin_payment.transactionCreateDate', 'DESC');

    const payment = await query.getOne();

    return payment;
  }
}
