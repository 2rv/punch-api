import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { Errors } from './enum/errors.enum';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Translate } from '../utils';
import { UserLoginDto } from './dto/user-login.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(key: string): Promise<User> {
    const user = this.create();
    user.key = await User.hashKey(key);

    try {
      await user.save();
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(Translate(Errors.USERNAME_ALREADY_EXISTS));
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async login(userLoginDto: UserLoginDto): Promise<User> {
    const { login, password, key } = userLoginDto;
    let keyHash = null;

    const query = this.createQueryBuilder('user');

    if (key) {
      keyHash = await User.hashKey(key);
      query.andWhere('user.key = :key', { key: keyHash });
    }

    if (login) {
      query.andWhere('user.login = :login', { login });
    }

    query.select([
      'user.id',
      'user.balance',
      'user.role',
      'user.password',
      'user.login',
      'user.key',
    ]);

    const user = await query.getOne();

    if (user === undefined) {
      throw new NotFoundException(Translate(Errors.COULDNT_FOUND_USER));
    } else {
      let isCorrect = false;

      if (key) {
        const keyCorrect = keyHash === user.key;
        isCorrect = keyCorrect || isCorrect;
      } else if (login && password) {
        const passwordHash = await User.hashPassword(password);
        const passwordCorrect = await user.validatePassword(passwordHash);
        isCorrect = passwordCorrect || isCorrect;
      }

      if (!isCorrect) {
        throw new BadRequestException(Translate(Errors.UNCORRECT_LOGIN_DATA));
      } else {
        delete user.password;
        delete user.key;
        return user;
      }
    }
  }
}
