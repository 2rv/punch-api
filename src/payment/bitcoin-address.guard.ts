import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  MethodNotAllowedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Translate } from 'src/utils';
import { Errors } from './enum/errors.enum';

@Injectable()
export class BitcoinPaymentAddressGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user) {
      return false;
    }

    const { bitcoinPaymentAddress } = user;

    if (!bitcoinPaymentAddress) {
      throw new MethodNotAllowedException(
        Translate(Errors.BITCOIN_PAYMENT_ADDRESS_IS_MISSING),
      );
    } else {
      return true;
    }
  }
}
