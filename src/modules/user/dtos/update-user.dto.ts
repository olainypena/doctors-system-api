import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Length(1, 50)
  @Transform(({ value }) => value.toLocaleUpperCase())
  @ApiProperty({
    type: String,
    maxLength: 50,
    example: 'John',
  })
  firstName?: string;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  @Transform(({ value }) => value.toLocaleUpperCase())
  @ApiProperty({
    type: String,
    maxLength: 50,
    example: 'Doe',
  })
  lastName?: string;

  @IsString()
  @IsOptional()
  @Length(11, 11)
  @ApiProperty({
    type: String,
    minLength: 11,
    maxLength: 11,
    example: '40212345678',
  })
  citizenId?: string;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({
    type: Date,
    example: '1990-01-01',
  })
  birthDate?: string;

  @IsPhoneNumber('DO')
  @IsOptional()
  @Length(10, 10)
  @ApiProperty({
    type: String,
    minLength: 10,
    maxLength: 10,
    example: '8099904040',
  })
  phone?: string;

  @IsEmail()
  @IsOptional()
  @Length(1, 100)
  @Transform(({ value }) => value.toLocaleUpperCase())
  @ApiProperty({
    type: String,
    maxLength: 100,
    example: 'jdoe@domain.com',
  })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'https://domain.com/profile.jpg',
  })
  profilePicture?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    example: 1,
  })
  roleId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    example: 1,
  })
  doctorTypeId?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: Boolean,
  })
  isActive?: boolean;
}
