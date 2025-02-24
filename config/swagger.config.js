const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for User and Product routes',
    },
    servers: [{ url: 'http://localhost:6001' }],
  },
  apis: [path.join(__dirname, '../routes/*.js')], // Dynamically fetch all route files
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
