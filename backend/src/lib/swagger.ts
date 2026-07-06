import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'FacultiQ API',
      version: '1.0.0',
      description:
        'REST API for the FacultiQ Faculty Management Portal — authentication, faculty, departments, analytics and activity logs.',
    },
    servers: [
      {
        url: '/api',
        description: 'FacultiQ Backend',
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
    tags: [
      { name: 'Authentication' },
      { name: 'Faculty' },
      { name: 'Departments' },
      { name: 'Analytics' },
      { name: 'Activity Logs' },
    ],
  },
  apis: ['./src/routes/*.ts'],
});