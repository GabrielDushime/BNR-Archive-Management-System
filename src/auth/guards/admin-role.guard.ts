
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractJwtToken(request.headers.authorization); 

    if (!token) {
      throw new ForbiddenException('Unauthorized access');
    }

    const decoded = this.jwtService.decode(token) as { Role: string }; 

    if (decoded && decoded.Role === 'admin') {
      return true; 
    }

    throw new ForbiddenException('Forbidden resource');
  }

  private extractJwtToken(authorizationHeader: string): string | null {
    if (!authorizationHeader) {
      return null;
    }

    const parts = authorizationHeader.split(' ');

    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      return null;
    }

    return parts[1];
  }
}
