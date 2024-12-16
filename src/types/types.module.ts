import { Module } from '@nestjs/common';
import { TypesService } from './types.service';
import { TypesController } from './types.controller';
import { JwtStrategy } from 'src/strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    JwtModule.register({})
],
  providers: [TypesService,JwtStrategy],
  controllers: [TypesController]
})
export class TypesModule {}
