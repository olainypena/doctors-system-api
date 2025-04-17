import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import {
  ApiResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';

interface IApiErrorOptions {
  status: HttpStatus;
  message: string | Array<string>;
  entity?: Type<any> | Type<any>[];
  error?: boolean;
}

const StatusCodeDescription = {
  [HttpStatus.CONTINUE]: 'Continue',
  [HttpStatus.SWITCHING_PROTOCOLS]: 'Switching Protocols',
  [HttpStatus.PROCESSING]: 'Processing',
  [HttpStatus.OK]: 'Ok',
  [HttpStatus.CREATED]: 'Created',
  [HttpStatus.BAD_REQUEST]: 'Bad Request',
  [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
  [HttpStatus.FORBIDDEN]: 'Forbidden',
  [HttpStatus.NOT_FOUND]: 'Not Found',
  [HttpStatus.NOT_ACCEPTABLE]: 'Not Acceptable',
  [HttpStatus.CONFLICT]: 'Conflict',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
  [HttpStatus.NOT_IMPLEMENTED]: 'Not Implemented',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'Service Unavailable',
  [HttpStatus.GATEWAY_TIMEOUT]: 'Gateway Timeout',
};

export const ApiAnyResponse = (options: IApiErrorOptions) => {
  const response: ApiResponseOptions = {
    status: options.status,
    description: StatusCodeDescription[options.status],
    schema: options?.entity
      ? {
          allOf: [
            {
              type: 'object',
              properties: {
                statusCode: { type: 'number', example: options.status },
                message: { type: 'string', example: options.message },
              },
            },
            options.entity instanceof Array
              ? {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        ...{
                          page: { type: 'number', example: 1 },
                          pageSize: { type: 'number', example: 10 },
                          totalPages: { type: 'number', example: 1 },
                          totalCount: { type: 'number', example: 1 },
                        },
                        items: {
                          type: 'array',
                          items: {
                            $ref: getSchemaPath(options.entity[0]),
                          },
                        },
                      },
                    },
                  },
                }
              : {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      $ref: getSchemaPath(options.entity),
                    },
                  },
                },
          ],
        }
      : {
          example: {
            statusCode: options.status,
            message: options.message,
            ...(options.error && {
              error: StatusCodeDescription[options.status],
            }),
          },
        },
  };

  return applyDecorators(ApiResponse(response));
};
