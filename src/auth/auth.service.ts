import {
  Injectable,
  Inject,
  forwardRef,
  Scope,
  HttpCode,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSignUpDto } from './dto/user-sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { LoginInfo } from './interface/login-info.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './user.entity';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  @HttpCode(200)
  async signUp(): Promise<LoginInfo> {
    const userData = await this.userRepository.signUp();

    const { login, id, role, balance, key } = userData;

    const payload: JwtPayload = {
      login,
      id,
      role,
      balance,
      key,
    };

    const accessToken = await this.createJwt(payload);

    const loginInfo: LoginInfo = { accessToken };

    return loginInfo;
  }

  async login(userLoginDto: UserLoginDto): Promise<LoginInfo> {
    const userData = await this.userRepository.login(userLoginDto);
    const { login, id, role, balance, key } = userData;

    const payload: JwtPayload = {
      login,
      id,
      role,
      balance,
      key,
    };

    const accessToken = await this.createJwt(payload);

    const loginInfo: LoginInfo = { accessToken };

    return loginInfo;
  }

  async createJwt(payload: JwtPayload): Promise<string> {
    return this.jwtService.sign(payload);
  }
}
