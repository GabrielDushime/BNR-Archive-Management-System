import { Module } from '@nestjs/common';
import { DivisionsService } from './division.service';
import { DivisionsController } from './division.controller';
import { JwtStrategy } from 'src/strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    JwtModule.register({})
],
  providers: [DivisionsService,JwtStrategy],
  controllers: [DivisionsController]
})
export class DivisionsModule {}
