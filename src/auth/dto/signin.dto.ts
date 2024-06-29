
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
 @ApiProperty({ example: 'dushimegabriel@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'D221016855@g' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
