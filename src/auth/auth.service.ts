import {
  Injectable,
  Scope,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { LoginInfoDto } from './dto/login-info.dto';
import { SignupInfoDto } from './dto/signup-info.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './user.entity';
import { generateKeyHash } from '../utils/hash';
import { Translate } from 'src/utils';
import { Errors } from './enum/errors.enum';
import { UserRefreshKeyDto } from './dto/user-refresh-key.dto';
import { UserUpdateLoginDataDto } from './dto/user-update-login-data.dto';
import { CaptchaService } from 'src/captcha/captcha.service';
import { UserSignUpDto } from './dto/user-sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private captchaService: CaptchaService,
  ) {}

  async signUp(userSignUpDto: UserSignUpDto): Promise<SignupInfoDto> {
    const { captchaId, captchaValue } = userSignUpDto;

    await this.captchaService.validateCaptcha(captchaId, captchaValue);

    const key = await User.generateKeyHash();

    await this.userRepository.signUp(key);

    const signupInfoDto: SignupInfoDto = { key };

    return signupInfoDto;
  }

  async login(userLoginDto: UserLoginDto): Promise<LoginInfoDto> {
    const userData = await this.userRepository.login(userLoginDto);
    const { id, role, balance, login } = userData;

    const payload: JwtPayload = {
      id,
      role,
      login,
      balance,
    };

    const accessToken = await this.createJwt(payload);

    const loginInfoDto: LoginInfoDto = { accessToken };

    return loginInfoDto;
  }

  async createJwt(payload: JwtPayload): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async refreshKey(user: User): Promise<UserRefreshKeyDto> {
    const newKey = await User.generateKeyHash();
    user.key = await User.hashKey(newKey);

    try {
      await user.save();
      return { key: newKey };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateLoginData(
    user: User,
    userUpdateLoginDataDto: UserUpdateLoginDataDto,
  ): Promise<void> {
    const { login, password } = userUpdateLoginDataDto;

    if (login) {
      user.login = login;
    }

    if (password) {
      user.password = await User.hashPassword(password);
    }

    try {
      await user.save();
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          Translate(Errors.USERNAME_WITH_THIS_LOGIN_ALREADY_EXISTS),
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
