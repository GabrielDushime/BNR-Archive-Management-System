import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { JwtStrategy } from 'src/strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    JwtModule.register({})
],
  providers: [DepartmentsService,JwtStrategy],
  controllers: [DepartmentsController]
})
export class DepartmentsModule {}
