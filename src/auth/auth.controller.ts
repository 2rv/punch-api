import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
  HttpCode,
  Patch,
} from '@nestjs/common';
import { UserSignUpDto } from './dto/user-sign-up.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthService } from './auth.service';
import { LoginInfoDto } from './dto/login-info.dto';
import { SignupInfoDto } from './dto/signup-info.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator/get-user.decorator';
import { User } from './user.entity';
import { RolesGuard } from './roles.guard';
import { Roles } from './decorator/role.decorator';
import { UserRole } from './enum/user-role.enum';
import { UserRefreshKeyDto } from './dto/user-refresh-key.dto';
import { KeyGuard } from './key.guard';
import { UserUpdateLoginDataDto } from './dto/user-update-login-data.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(200)
  @Post('/signup')
  async signUp(): Promise<SignupInfoDto> {
    return this.authService.signUp();
  }

  @HttpCode(200)
  @Post('/login')
  logIn(
    @Body(ValidationPipe) userLoginDto: UserLoginDto,
  ): Promise<LoginInfoDto> {
    return this.authService.login(userLoginDto);
  }

  @HttpCode(200)
  @Post('/refresh-key')
  @UseGuards(AuthGuard(), KeyGuard)
  refreshKey(@GetUser() user: User): Promise<UserRefreshKeyDto> {
    return this.authService.refreshKey(user);
  }

  @Patch('/login')
  @UseGuards(AuthGuard(), KeyGuard)
  updateLoginData(
    @Body(ValidationPipe) userUpdateLoginDataDto: UserUpdateLoginDataDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.authService.updateLoginData(user, userUpdateLoginDataDto);
  }

  @Get('/token')
  @UseGuards(AuthGuard())
  checkToken(@GetUser() user: User): void {}

  @Get('/admin')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  getAllUsers(): void {}
}
