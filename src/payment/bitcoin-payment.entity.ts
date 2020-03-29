import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Api } from '../utils/request';

@Entity()
@Unique(['transaction'])
export class BitcoinPayment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column()
  transaction: string;

  @Column()
  transactionCreateDate: number;

  @Column({ default: false })
  confirm: boolean;

  @Column({ type: 'float', nullable: true })
  amount: number;

  @ManyToOne(
    type => User,
    user => user.bitcoinPayment,
    { eager: false },
  )
  user: User;

  @CreateDateColumn()
  createDate: string;

  async calcAmount(resultSatoshi: number): Promise<void> {
    const resultBtc = resultSatoshi / 100000000;
    const { data } = await Api.get(`https://blockchain.info/ticker`);
    const resultUsd = Math.ceil(data.USD.sell * resultBtc * 100) / 100;
    this.amount = resultUsd;
  }

  static async getTransactionListByAddress(address): Promise<[]> {
    try {
      const { data } = await Api.get(
        `https://blockchain.info/rawaddr/${address}`,
      );
      return data.txs;
    } catch (error) {
      console.log(error);
    }
  }

  async updateTransactionStatus(): Promise<void> {
    const { data } = await Api.get(
      `https://blockchain.info/rawtx/${this.transaction}`,
    );
    const { block_height = null } = data;
    this.confirm = !!block_height;
  }
}
