import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: number[] | number[]) =>
  SetMetadata('roles', roles);
