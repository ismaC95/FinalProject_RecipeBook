const swaggerJsdoc = require("swagger-jsdoc");

const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Recipe Book API",
      version: "1.0.0",
      description: "An API to share your cooking recipes",
    },
  },
  //come back to this once I have the routes
  apis: ["./routes/*.js"], // Path to your API routes
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
};
