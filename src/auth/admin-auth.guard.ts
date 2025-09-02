// src/auth/admin-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client'; // assumes role is an enum in Prisma
import { Observable } from 'rxjs';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // Ensure user exists and has role ADMIN
    if (request.user && request.user.role === Role.ADMIN) {
      return true;
    }
    return false; // Forbidden
  }
}
