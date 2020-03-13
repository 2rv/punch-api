import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const { user = null } = request;

    if (user === null) {
      return false;
    }

    const { role = null } = request.user;

    if (role === null) {
      return false;
    }

    const index = roles.indexOf(role);

    return index !== -1;
  }
}
