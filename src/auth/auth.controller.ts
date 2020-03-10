import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Req,
  UseGuards,
  Get,
  SetMetadata,
  HttpCode,
} from '@nestjs/common';
import { UserSignUpDto } from './dto/user-sign-up.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthService } from './auth.service';
import { LoginInfo } from './interface/login-info.interface';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator/get-user.decorator';
import { User } from './user.entity';
import { RolesGuard } from './roles.guard';
import { Roles } from './decorator/role.decorator';
import { UserRole } from './enum/user-role.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(200)
  @Post('/signup')
  async signUp(): Promise<LoginInfo> {
    return this.authService.signUp();
  }

  @HttpCode(200)
  @Post('/login')
  logIn(@Body(ValidationPipe) userLoginDto: UserLoginDto): Promise<LoginInfo> {
    return this.authService.login(userLoginDto);
  }

  @Get('/token')
  @UseGuards(AuthGuard())
  checkToken(@GetUser() user: User): void {}

  @Get('/admin')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  getAllUsers(): void {}
}
