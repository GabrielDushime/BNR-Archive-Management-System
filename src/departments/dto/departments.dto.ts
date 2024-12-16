import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class DepartmentsDto{
  @ApiProperty({ example: 'Governor & Board Affairs Office' })
  @IsString()
  @IsNotEmpty()
  departmentName: string;

 }


  
