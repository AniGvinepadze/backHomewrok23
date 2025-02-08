import { IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    example: 'posts title',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'posts content',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
