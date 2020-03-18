import { IsOptional, IsString, Matches } from 'class-validator';
import { LocalError } from '../../utils';
import { Errors } from '../enum/errors.enum';

export class UserUpdateLoginDataDto {
  @IsOptional({
    context: LocalError(Errors.VALIDATION_REQUIRED),
  })
  @IsString()
  @Matches(/^[a-z0-9_-]{4,20}$/, {
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
