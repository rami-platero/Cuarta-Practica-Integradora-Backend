import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import __dirname from "../utils.js";
import { config } from "./variables.config.js";

const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Gaming Components",
      version: "1.0.0",
      description: "Gaming Components API",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app, port) => {
  console.log(__dirname);
  app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  app.get("/api/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Version 1 Docs are available at ${config.BASE_URL}/api/docs`);
};
