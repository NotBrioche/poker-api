import { Router } from "express";
import * as controller from "../controllers/table";
import * as auth from "../middlewares/auth";

const router = Router();

router.post(
  // #swagger.security = [{"bearerAuth": []}]

  "/create",

  auth.isLogged,
  controller.create
);

export default router;
