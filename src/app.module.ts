import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';



dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    AuthModule,
    FilesModule,
    PrismaModule,
  ],
  

})

export class AppModule  {}

