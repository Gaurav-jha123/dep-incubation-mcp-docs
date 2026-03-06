import swaggerJsdoc from 'swagger-jsdoc';
import { authDocs } from '../docs/auth.docs';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DEP Incubation — Auth Service',
      version: '1.0.0',
      description: 'Authentication API for the DEP Incubation Dashboard',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Local development',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    paths: authDocs,
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);