import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { JwtStrategy } from 'src/strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    JwtModule.register({})
],
  providers: [CategoriesService,JwtStrategy],
  controllers: [CategoriesController]
})
export class CategoriesModule {}
