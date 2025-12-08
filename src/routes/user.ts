import { Router } from "express";
import * as controller from "../controllers/user";
import * as auth from "../middlewares/auth";

const router = Router();

router.get(
  // #swagger.security = [{"bearerAuth": []}]

  "/self",

  auth.isLogged,
  controller.self
);

router.get(
  // #swagger.security = [{"bearerAuth": []}]

  "/:id",

  auth.isLogged,
  controller.get
);
router.post("/signup", controller.signup);
router.post("/login", controller.login);

export default router;
