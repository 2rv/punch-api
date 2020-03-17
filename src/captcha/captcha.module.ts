import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaptchaService } from './captcha.service';
import { CaptchaController } from './captcha.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CaptchaController],
  providers: [CaptchaService],
  exports: [CaptchaService],
})
export class CaptchaModule {}
