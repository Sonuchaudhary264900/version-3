const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Smart Salon API",
      version: "1.0.0",
      description: "API documentation for Smart Salon Marketplace"
    },

    servers: [
      {
        url: "http://localhost:5005/api/v1",
        description: "Local Development Server"
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },

    security: [
      {
        bearerAuth: []
      }
    ],

    tags: [
      { name: "Auth", description: "Authentication APIs" },
      { name: "Users", description: "User APIs" },
      { name: "Salons", description: "Salon APIs" },
      { name: "Services", description: "Service APIs" },
      { name: "Bookings", description: "Booking APIs" },
      { name: "Reviews", description: "Review APIs" },
      { name: "Admin", description: "Admin APIs" }
    ]
  },

  apis: [
    "./src/routes/*.js",
    "./src/controllers/*.js"
  ]
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      swaggerOptions: {
        persistAuthorization: true
      }
    })
  );

}

module.exports = setupSwagger;