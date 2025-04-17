import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiProduces } from '@nestjs/swagger';

/*
 * @ApiFileResponse() decorator
 * @ApiFileResponse('image/png') decorator
 * @ApiFileResponse('image/png', 'image/jpeg') decorator
 * @ApiFileResponse('application/pdf') decorator
 */
export const ApiFileResponse = (...mimeTypes: string[]) =>
  applyDecorators(
    ApiOkResponse({
      schema: {
        type: 'string',
        format: 'binary',
      },
    }),
    ApiProduces(...mimeTypes),
  );
