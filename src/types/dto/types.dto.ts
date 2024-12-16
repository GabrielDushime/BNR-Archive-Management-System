import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class TypesDto{
  @ApiProperty({ example: 'Type1' })
  @IsString()
  @IsNotEmpty()
  typeName: string;

 }


  
