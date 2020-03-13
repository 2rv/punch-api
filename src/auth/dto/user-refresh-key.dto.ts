import { IsString, IsNotEmpty } from 'class-validator';
import { LocalError } from '../../utils';
import { Errors } from '../enum/errors.enum';

export class UserRefreshKeyDto {
  @IsNotEmpty({
    context: LocalError(Errors.VALIDATION_REQUIRED),
  })
  @IsString()
  key: string;
}
