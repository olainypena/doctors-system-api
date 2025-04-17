import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class ForgetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @Length(1, 100)
  @Transform(({ value }) => value.toLocaleLowerCase())
  @ApiProperty({
    type: String,
    maxLength: 100,
    example: 'jdoe@domain.com',
  })
  email: string;
}
