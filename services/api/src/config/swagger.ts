/* eslint-disable @typescript-eslint/no-explicit-any */
import { Express } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

const options: swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'GymU API',
      version: '0.0.1',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

const API_DOCS_PATH = '/api';

function initSwagger(app: Express, port: number): void {
  app.use(
    API_DOCS_PATH,
    swaggerUI.serve as any,
    swaggerUI.setup(swaggerSpec) as any,
  );
  console.log(
    `[server]: API docs are available at http://localhost:${port}${API_DOCS_PATH}`,
  );
}

export default initSwagger;
