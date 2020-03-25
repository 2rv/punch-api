import { IsNumber, IsNotEmpty } from 'class-validator';
import { LocalError } from '../../utils';
import { Errors } from '../enum/errors.enum';

export class CreatePaymentDto {
  @IsNotEmpty({
    context: LocalError(Errors.VALIDATION_REQUIRED),
  })
  @IsNumber()
  id: number;
}
