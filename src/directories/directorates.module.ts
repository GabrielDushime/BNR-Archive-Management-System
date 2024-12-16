import { Module } from '@nestjs/common';
import { DirectoratesService } from './directorates.service';
import { DirectoriesController } from './directorates.controller';
import { JwtStrategy } from 'src/strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[
    AuthModule,
    JwtModule.register({})
],
  providers: [DirectoratesService,JwtStrategy],
  controllers: [DirectoriesController]
})
export class DirectoriesModule {}
