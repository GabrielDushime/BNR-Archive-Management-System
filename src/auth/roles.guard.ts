import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = 'admin'; 
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];

    if (!authorization) {
      console.log('No authorization header');
      return false;
    }

    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer' || !token) {
      console.log('Invalid authorization format');
      return false;
    }

    const secret = this.configService.get('JWT_SECRET');

    try {
      const payload = this.jwtService.verify(token, { secret });
      console.log('Payload:', payload);
      return payload.Role === requiredRole;
    } catch (err) {
      console.log('Error verifying token:', err);
      return false;
    }
  }
}
