import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  @Transform(({ value }) => value.toLocaleUpperCase())
  @ApiProperty({
    type: String,
    maxLength: 50,
    example: 'John',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  @Transform(({ value }) => value.toLocaleUpperCase())
  @ApiProperty({
    type: String,
    maxLength: 50,
    example: 'Doe',
  })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  @ApiProperty({
    type: String,
    minLength: 11,
    maxLength: 11,
    example: '40212345678',
  })
  citizenId?: string;

  @IsPhoneNumber('DO')
  @IsNotEmpty()
  @Length(10, 10)
  @ApiProperty({
    type: String,
    minLength: 10,
    maxLength: 10,
    example: '8099904040',
  })
  phone: string;

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
