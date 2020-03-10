import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
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
  async signUp(): Promise<User> {
    const user = this.create();
    await user.hashKey();

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

    const user = await this.findOne({ where: [{ login }, { key }] });
    if (user === undefined) {
      throw new NotFoundException(Translate(Errors.COULDNT_FOUND_USER));
    } else {
      let isCorrect = false;

      if (key) {
        const keyCorrect = await user.validateKey(key);
        isCorrect = keyCorrect || isCorrect;
      }

      // if (login) {
      //   const passwordCorrect = await user.validatePassword(password);
      //   isCorrect = passwordCorrect || isCorrect;
      // }

      if (!isCorrect) {
        throw new BadRequestException(Translate(Errors.UNCORRECT_LOGIN_DATA));
      } else {
        return user;
      }
    }
  }
}
