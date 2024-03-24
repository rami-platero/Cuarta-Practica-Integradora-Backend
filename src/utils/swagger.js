import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Gaming Components", version: "1.0.0" },
  },
  apis: ["./src/routes/*.js", "./src/schemas/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app, port) => {
  app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  app.get("/api/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Version 1 Docs are available at http://localhost:${port}/api/docs`);
};
