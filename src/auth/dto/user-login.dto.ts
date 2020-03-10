import { IsOptional, IsString } from 'class-validator';
import { LocalError } from '../../utils';
import { Errors } from '../enum/errors.enum';

export class UserLoginDto {
  @IsOptional({
    context: LocalError(Errors.VALIDATION_REQUIRED),
  })
  @IsString()
  login: string;

  @IsOptional({
    context: LocalError(Errors.VALIDATION_REQUIRED),
  })
  @IsString()
  password: string;

  @IsOptional({
    context: LocalError(Errors.VALIDATION_REQUIRED),
  })
  @IsString()
  key: string;
}
