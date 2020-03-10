import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user = null } = request;

    if (user === null) {
      return true;
    }

    const { role = null } = request.user;

    if (role === null) {
      return true;
    }

    const index = roles.indexOf(role);

    return index !== -1;
  }
}
