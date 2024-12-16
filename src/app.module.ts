import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { DirectoriesModule } from './directories/directorates.module';
import { DepartmentsModule } from './departments/departments.module';
import { DocumentsModule } from './documents/documents.module'; 
import { DivisionsModule } from './division/division.module';
import { TypesModule } from './types/types.module';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    DirectoriesModule,
    DepartmentsModule,
    DirectoriesModule,
    DivisionsModule,
    TypesModule,
    DocumentsModule, 
    
  ],
  
 
})
export class AppModule {}
