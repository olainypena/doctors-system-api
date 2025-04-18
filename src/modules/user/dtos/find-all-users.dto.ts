import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { PaginationDto } from '@/common/dtos';

export class FindAllUsersDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @Length(1, 50)
  @ApiProperty({
    type: String,
    maxLength: 50,
    example: 'John',
  })
  firstName?: string;

  @IsString()
  @IsOptional()
  @Length(1, 50)
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
  @Transform(({ value }) => value.toLocaleLowerCase())
  @ApiProperty({
    type: String,
    maxLength: 100,
    example: 'jdoe@domain.com',
  })
  email?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    type: Number,
    example: 1,
  })
  roleId?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
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
