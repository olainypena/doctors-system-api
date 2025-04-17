import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @Length(8)
  @ApiProperty({
    type: String,
    minLength: 8,
    example: 'Y0urP@a$$w0rd',
  })
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  @ApiProperty({
    type: String,
    maxLength: 8,
    example: 'Y0urNewP@a$$w0rd',
  })
  newPassword: string;
}
