import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController, UserController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/strategy';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [AuthService, JwtStrategy, AdminRoleGuard],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
