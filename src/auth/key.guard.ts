import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Translate } from 'src/utils';
import { Errors } from './enum/errors.enum';
import { User } from './user.entity';

@Injectable()
export class KeyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { body, user } = request;

    if (!body || !user) {
      return false;
    }

    const { key } = body;

    if (!key) {
      return false;
    }

    const oldKeyHash = await User.hashKey(key);

    if (oldKeyHash !== user.key) {
      throw new BadRequestException(
        Translate(Errors.UNCORRECT_OLD_KEY_FOR_REFRESH),
      );
    } else {
      return true;
    }
  }
}
