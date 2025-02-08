import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    example: 'ani gvinepadze',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    example: 'a@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'ani1234',
    required: true,
    minLength: 6,
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password: string;
}
