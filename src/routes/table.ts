import { Router } from "express";
import * as controller from "../controllers/table";
import * as auth from "../middlewares/auth";
import * as table from "../middlewares/table";

const router = Router();

const isVerified = [auth.isLogged, auth.isVerified];
const isHost = [table.isInTable, table.isHost];

router.get(
  // #swagger.security = [{"bearerAuth": []}]

  "/list/stream",

  // auth.isLogged,
  controller.listStream
);

router.get(
  // #swagger.security = [{"bearerAuth": []}]

  "/stream",

  // auth.isLogged,
  table.isInTable,
  controller.tableStream
);

router.get(
  // #swagger.security = [{"bearerAuth": []}]

  "/",

  auth.isLogged,
  table.isInTable,
  controller.get
);

router.get(
  // #swagger.security = [{"bearerAuth": []}]

  "/list",

  auth.isLogged,
  controller.list
);

router.post(
  // #swagger.security = [{"bearerAuth": []}]

  "/create",

  isVerified,
  controller.create
);

router.post(
  // #swagger.security = [{"bearerAuth": []}]

  "/join",

  auth.isLogged,
  controller.join
);

router.post(
  // #swagger.security = [{"bearerAuth": []}]

  "/quit",

  auth.isLogged,
  table.isInTable,
  controller.quit
);

router.post(
  // #swagger.security = [{"bearerAuth": []}]

  "/open",

  isVerified,
  isHost,
  controller.open
);

router.post(
  // #swagger.security = [{"bearerAuth": []}]

  "/start",

  isVerified,
  isHost,
  controller.start
);

router.delete(
  // #swagger.security = [{"bearerAuth": []}]

  "/",

  isVerified,
  isHost,
  controller.remove
);

export default router;
