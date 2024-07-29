import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractJwtToken(request.headers.authorization);

    if (!token) {
      throw new ForbiddenException('Unauthorized access');
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const decoded = this.jwtService.verify(token, { secret });

      if (decoded && decoded.Id && decoded.Role === 'user') {
        request.user = decoded; 
        return true;
      }

      throw new ForbiddenException('Forbidden resource');
    } catch (error) {
      throw new ForbiddenException('Invalid or expired token');
    }
  }

  private extractJwtToken(authorizationHeader: string | undefined): string | null {
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
