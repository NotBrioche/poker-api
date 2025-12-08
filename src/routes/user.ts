import { Router } from "express";
import * as controller from "../controllers/user";

const router = Router();

router.get("/:id", controller.get);
router.post("/signup", controller.signup);
router.post("/login", controller.login);

export default router;
