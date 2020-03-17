import * as NodeCache from 'node-cache';
import { createCaptcha } from '../utils/captcha';
import { randomUUID } from 'src/utils/hash';
import { InternalServerErrorException } from '@nestjs/common';

const CaptchaCache = new NodeCache({
  stdTTL: 300,
  checkperiod: 300,
  deleteOnExpire: true,
});

export class Captcha {
  id: string;
  data: string;
  value: string;

  constructor() {
    this.id = randomUUID();
  }

  async generate() {
    const { data, text } = await createCaptcha();

    this.data = data;
    this.value = text;
  }

  async save() {
    const saved = await CaptchaCache.set(this.id, { value: this.value });
    if (!saved) {
      throw new InternalServerErrorException();
    }
  }

  static async getOne({ id }): Promise<Captcha> {
    return CaptchaCache.get(id);
  }
}
