import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInDto {
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
  @Length(8)
  @ApiProperty({
    type: String,
    minLength: 8,
    example: 'Y0urP@a$$w0rd',
  })
  password: string;
}
