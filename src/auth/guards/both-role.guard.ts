import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BothRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractJwtToken(request.headers.authorization);

    if (!token) {
      throw new ForbiddenException('Unauthorized access');
    }

    const secret = this.configService.get<string>('JWT_SECRET');
    const decoded = this.jwtService.verify(token, { secret });

    if (decoded && decoded.Id && decoded.Role === 'admin' || decoded.Role === 'user'|| decoded.Role === 'super-admin' ) {
      request.user = decoded; 
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
