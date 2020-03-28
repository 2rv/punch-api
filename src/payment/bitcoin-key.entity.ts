import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
} from 'typeorm';
import * as bitcoin from 'bitcoinjs-lib';

@Entity()
@Unique(['key'])
export class BitcoinKey extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  async generateKey(): Promise<string> {
    const keyPair = bitcoin.ECPair.makeRandom();

    this.key = keyPair.toWIF();

    const { address } = bitcoin.payments.p2pkh({
      pubkey: keyPair.publicKey,
    });

    return address;
  }
}
