import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {AuthController} from './auth.controller'
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/strategy';
import { AdminRoleGuard } from './guards/admin-role.guard';



@Module({
   imports:[
    JwtModule.register({})
],
    controllers: [AuthController],
    providers: [AuthService,JwtStrategy, AdminRoleGuard,]

})
export class AuthModule {}
