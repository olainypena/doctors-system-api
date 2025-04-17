import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class ValidateOTPDto {
  @IsEmail()
  @IsNotEmpty()
  @Length(1, 100)
  @Transform(({ value }) => value.toLocaleUpperCase())
  @ApiProperty({
    type: String,
    maxLength: 100,
    example: 'jdoe@domain.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  @ApiProperty({
    type: String,
    minLength: 6,
    maxLength: 6,
    example: '123456',
  })
  otp: string;
}
