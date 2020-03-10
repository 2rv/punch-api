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
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, {
    context: LocalError(Errors.VALIDATION_LOGIN),
  })
  login: string;

  @IsNotEmpty({
    context: LocalError(Errors.VALIDATION_REQUIRED),
  })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @Matches(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, {
    context: LocalError(Errors.VALIDATION_NAME),
  })
  name: string;

  @IsNotEmpty({
    context: LocalError(Errors.VALIDATION_REQUIRED),
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,20}$/, {
    context: LocalError(Errors.VALIDATION_PASSWORD),
  })
  password: string;

  @IsNotEmpty({
    context: LocalError(Errors.VALIDATION_REQUIRED),
  })
  @IsString()
  @Matches(
    /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/,
    {
      context: LocalError(Errors.VALIDATION_EMAIL),
    },
  )
  email: string;

  @IsNotEmpty({
    context: LocalError(Errors.VALIDATION_REQUIRED),
  })
  @IsString()
  @MaxLength(300, {
    context: LocalError(Errors.VALIDATION_CONTACTS),
  })
  contacts: string;
}
