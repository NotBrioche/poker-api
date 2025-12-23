import express from "express";
const swaggerUi = require("swagger-ui-express");

import user from "./routes/user";
import table from "./routes/table";

import swaggerFile from "./swagger.json";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type, Accept"
  );
  next();
});

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(
  // #swagger.tags = ['Users']

  "/user",
  user
);
app.use(
  // #swagger.tags = ['Tables']

  "/table",
  table
);

export default app;
