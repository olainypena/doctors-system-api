import { HttpStatus } from '@nestjs/common';

export interface IResponse<T = any> {
  statusCode: HttpStatus;
  message: string;
  data?: T;
}
