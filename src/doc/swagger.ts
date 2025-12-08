import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Poker API",
    description:
      "API to play poker remotely, with custom UI or even create bots",
  },
  host: "localhost:3000",

  securityDefinitions: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
    },
  },
};

const outputFile = "../swagger.json";
const routes = ["../app.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes, doc);
