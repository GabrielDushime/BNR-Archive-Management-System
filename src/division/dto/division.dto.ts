import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class DivisionsDto{
  @ApiProperty({ example: 'Division Name' })
  @IsString()
  @IsNotEmpty()
  divisionName: string;

 }


  
