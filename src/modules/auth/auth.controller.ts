import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import {
  GenerateOTPDto,
  SignInDto,
  SignUpDto,
  ValidateOTPDto,
} from '@/modules/auth/dtos';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ForgetPasswordDto } from '@/modules/user/dtos';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    description: 'Create a new user for login',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created',
    schema: {
      example: {
        statusCode: HttpStatus.CREATED,
        message: 'User created',
        data: {
          statusCode: HttpStatus.CREATED,
          message: 'User created',
          data: {
            token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqZG9lQGRvbWFpbi5jb20iLCJpYXQiOjE2ODg1MTg1NzEsImV4cCI6MTY4ODYwNDk3MX0.V_DaYikMn6c0ALlX5_JCi5fsBKSwasdWWCZ84PEHGDQ',
            user: {
              id: 3,
              firstName: 'John',
              lastName: 'Doe',
              citizenId: '40212345678',
              birthDate: null,
              phone: '8099904040',
              email: 'jdoe@domain.com',
              profilePicture: null,
              createdAt: '2023-07-24T00:08:04.473Z',
              updatedAt: null,
              isActive: true,
              role: {
                id: 3,
                description: 'Patient',
                createdAt: '2023-07-23T20:49:02.225Z',
                updatedAt: null,
                isActive: true,
              },
              doctorType: null,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
    schema: {
      example: {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'User already exists',
        error: 'Forbidden',
      },
    },
  })
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'User sign in successfully',
        data: {
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqZG9lQGRvbWFpbi5jb20iLCJpYXQiOjE2ODg1MTg1NzEsImV4cCI6MTY4ODYwNDk3MX0.V_DaYikMn6c0ALlX5_JCi5fsBKSwasdWWCZ84PEHGDQ',
          user: {
            id: 3,
            firstName: 'John',
            lastName: 'Doe',
            citizenId: '40212345678',
            birthDate: null,
            phone: '8099904040',
            email: 'jdoe@domain.com',
            profilePicture: null,
            createdAt: '2023-07-24T00:08:04.473Z',
            updatedAt: null,
            isActive: true,
            role: {
              id: 3,
              description: 'Patient',
              createdAt: '2023-07-23T20:49:02.225Z',
              updatedAt: null,
              isActive: true,
            },
            doctorType: null,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
    schema: {
      example: {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Invalid credentials',
        error: 'Forbidden',
      },
    },
  })
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Patch('forget-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Update user with a temporal password',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'User updated with a temporal password',
        data: {
          id: 3,
          firstName: 'John',
          lastName: 'Doe',
          citizenId: '40212345678',
          birthDate: null,
          phone: '8099904040',
          email: 'jdoe@domain.com',
          profilePicture: null,
          createdAt: '2023-07-24T00:08:04.473Z',
          updatedAt: null,
          isActive: true,
          role: {
            id: 3,
            description: 'Patient',
            createdAt: '2023-07-23T20:49:02.225Z',
            updatedAt: null,
            isActive: true,
          },
          doctorType: null,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['email must be an email'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Cannot find user with email jdoe@em.com',
        error: 'Not Found',
      },
    },
  })
  forgetPassword(@Body() dto: ForgetPasswordDto) {
    return this.authService.forgetPassword(dto);
  }

  @Post('otp/generate')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'OTP generated successfully, check email to get code',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_ACCEPTABLE,
    description: 'Not Acceptable',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'OTP attempts exceeded, contact client services',
      },
    },
  })
  generateOTP(@Body() dto: GenerateOTPDto) {
    return this.authService.generateOTP(dto);
  }

  @Post('otp/validate')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'OTP validated successfully',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_ACCEPTABLE,
    description: 'Not Acceptable',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Invalid OTP',
      },
    },
  })
  validateOTP(@Body() dto: ValidateOTPDto) {
    return this.authService.validateOTP(dto);
  }
}
