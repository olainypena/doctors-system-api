import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { apiReference } from '@scalar/nestjs-api-reference';
import * as swaggerStats from 'swagger-stats';
import * as basicAuth from 'express-basic-auth';

interface SwaggerOptions {
  app: INestApplication;
  uriDocs: string;
  uriStats: string;
  uriReference: string;
  title: string;
  description: string;
  version: string;
  username: string;
  password: string;
  module?: any[];
}

/**
 * Setup swagger in the application bootstrap
 * @param swaggerOptions {SwaggerOptions}
 */
const createSwaggerDocument = (swaggerOptions: SwaggerOptions) => {
  const config = new DocumentBuilder()
    .setTitle(swaggerOptions.title)
    .setDescription(swaggerOptions.description)
    .setVersion(swaggerOptions.version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(swaggerOptions.app, config, {
    include: swaggerOptions.module,
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  // Swagger-stats setup
  swaggerOptions.app.use(
    swaggerStats.getMiddleware({
      name: `${swaggerOptions.title}-stats`,
      version: swaggerOptions.version,
      uriPath: swaggerOptions.uriStats,
      swaggerSpec: document,
      authentication: true,
      sessionMaxAge: 15778800, // 6 months
      onAuthenticate: (_, username, password) =>
        username === swaggerOptions.username &&
        password === swaggerOptions.password,
    }),
  );

  if (process.env.NODE_ENV !== 'prod') {
    if (process.env.NODE_ENV === 'uat') {
      swaggerOptions.app.use(
        [
          `/${swaggerOptions.uriReference}`,
          `/${swaggerOptions.uriDocs}`,
          `/${swaggerOptions.uriDocs}-json`,
        ],
        basicAuth({
          challenge: true,
          users: { [swaggerOptions.username]: swaggerOptions.password },
        }),
      );
    }

    // Scalar Reference setup
    swaggerOptions.app.use(
      swaggerOptions.uriReference,
      apiReference({ theme: 'purple', spec: { content: document } }),
    );

    // Swagger UI setup
    SwaggerModule.setup(swaggerOptions.uriDocs, swaggerOptions.app, document, {
      swaggerOptions: {
        defaultModelsExpandDepth: -1, // Hide schema list
      },
    });
  }
};

export const configureSwaggerMiddleware = (app: INestApplication) => {
  createSwaggerDocument({
    app,
    uriDocs: `${AppModule.globalPrefix}/docs`,
    uriStats: `/${AppModule.globalPrefix}/stats`,
    uriReference: `/${AppModule.globalPrefix}/reference`,
    title: AppModule.packageName,
    version: AppModule.packageVersion,
    description: AppModule.packageDescription,
    username: AppModule.swaggerUsername,
    password: AppModule.swaggerPassword,
  });
};
