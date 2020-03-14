import { IsOptional, IsString, Matches } from 'class-validator';
import { LocalError } from '../../utils';
import { Errors } from '../enum/errors.enum';

export class UserUpdateLoginDataDto {
  @IsOptional({
    context: LocalError(Errors.VALIDATION_REQUIRED),
  })
  @IsString()
  @Matches(/^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, {
    context: LocalError(Errors.VALIDATION_LOGIN),
  })
  login: string;

  @IsOptional({
    context: LocalError(Errors.VALIDATION_REQUIRED),
  })
  @IsString()
  @Matches(/^.{6,4098}$/, {
    context: LocalError(Errors.VALIDATION_PASSWORD),
  })
  password: string;
}
