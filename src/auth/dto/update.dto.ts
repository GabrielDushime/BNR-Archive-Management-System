
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDto {
    @ApiProperty({ example: 'John' })
    @IsString()
    @IsNotEmpty()
    firstName: string;
  
    @ApiProperty({ example: 'Doe' })
    @IsString()
    @IsNotEmpty()
    lastName: string;
  
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @ApiProperty({ example: 'user', default: 'user' })
    @IsString()
    @IsNotEmpty()
    Role: string ; 



  @ApiProperty({ example: ['Directorate-id1', 'Directorate-id2'] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty({ each: true })
  directorateIds: string[];

  
    constructor() {
    this.Role = 'user';
    }
    
}
