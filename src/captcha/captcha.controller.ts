import { Controller, Get, Post, Param, HttpCode } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { Captcha } from './captcha.entity';

@Controller('captcha')
export class CaptchaController {
  constructor(private captchaService: CaptchaService) {}

  @Get('/')
  async generateCaptcha(): Promise<Captcha> {
    return this.captchaService.generateCaptcha();
  }

  @HttpCode(200)
  @Post('/:id/:value')
  async validateCaptcha(
    @Param('id') id: string,
    @Param('value') value: string,
  ): Promise<void> {
    return this.captchaService.validateCaptcha(id, value);
  }
}
