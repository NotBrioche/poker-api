import express from "express";
const swaggerUi = require("swagger-ui-express");

import user from "./routes/user";
import table from "./routes/table";

import swaggerFile from "./swagger.json";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/user", user);
app.use("/table", table);

export default app;
