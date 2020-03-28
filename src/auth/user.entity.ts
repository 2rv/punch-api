import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import {
  generateBcryptHash,
  generateKeyHash,
  generateKeySalt,
  generatePasswordSalt,
} from '../utils/hash';
import { UserRole } from './enum/user-role.enum';
import { BitcoinPayment } from 'src/payment/bitcoin-payment.entity';

@Entity()
@Unique(['login'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  login: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  key: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
    nullable: false,
  })
  role: keyof UserRole;

  @Column({ type: 'float', default: 0 })
  balance: number;

  @OneToMany(
    type => User,
    user => user.bitcoinPayment,
    { eager: false },
  )
  bitcoinPayment: BitcoinPayment;

  @Column({ nullable: true, default: null })
  bitcoinPaymentAddress: string;

  static async generateKeyHash(): Promise<string> {
    return generateKeyHash();
  }

  static async hashKey(key: string): Promise<string> {
    const salt = await generateKeySalt(key);
    return generateBcryptHash(key, salt);
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await generatePasswordSalt(password);
    return generateBcryptHash(password, salt);
  }

  async validateKeyHash(key: string): Promise<boolean> {
    return key === this.key;
  }

  async validatePassword(password: string): Promise<boolean> {
    return this.password === password;
  }

  async updateBalance(num: number): Promise<void> {
    this.balance += num;
    await this.save();
  }
}
