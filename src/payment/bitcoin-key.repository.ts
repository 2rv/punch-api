import { Repository, EntityRepository } from 'typeorm';
import { BitcoinKey } from './bitcoin-key.entity';

@EntityRepository(BitcoinKey)
export class BitcoinKeyRepository extends Repository<BitcoinKey> {
  async createKeyAndAddress(): Promise<string> {
    const bitcoinKey = new BitcoinKey();
    const address = await bitcoinKey.generateKey();
    await bitcoinKey.save();
    return address;
  }
}
