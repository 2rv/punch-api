import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { LocalError } from '../../utils';
import { Errors } from '../enum/errors.enum';

export class UserSignUpDto {
  @IsNotEmpty({
    context: LocalError(Errors.VALIDATION_REQUIRED),
  })
  @IsString()
  captchaId: string;

  @IsNotEmpty({
    context: LocalError(Errors.VALIDATION_REQUIRED),
  })
  @IsString()
  captchaValue: string;
}
