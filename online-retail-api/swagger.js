const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Online Retail API",
      version: "1.0.0",
      description: "API documentation for the Online Retail PostgreSQL analytics backend",
    },
    servers: [
      {
        url: "http://localhost:3000", // change port if different
      },
    ],
  },
  apis: ["./routes/*.js"], // path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
