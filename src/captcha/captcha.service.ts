import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Translate } from 'src/utils';
import { Errors } from './enum/errors.enum';
import { Captcha } from './captcha.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CaptchaService {
  constructor() {}

  async generateCaptcha(): Promise<Captcha> {
    const captcha = new Captcha();

    await captcha.generate();
    await captcha.save();

    delete captcha.value;
    return captcha;
  }

  async validateCaptcha(id: string, value: string): Promise<void> {
    const data = await Captcha.getOne({ id });

    if (!data) {
      throw new NotFoundException(
        Translate(Errors.CAPTCHA_WITH_THIS_ID_NOT_FOUND),
      );
    } else {
      const { value: captchaValue } = data;

      if (captchaValue !== value) {
        throw new BadRequestException(
          Translate(Errors.CAPTCHA_VALUE_IS_UNCORRECT),
        );
      }
    }
  }
}
