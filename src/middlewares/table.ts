import { NextFunction, Request, Response } from "express";
import Table from "../models/table";
import send_error from "../utils/send_error";

export const isInTable = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tables = await Table.find({ users: { $in: req.user._id } });

  if (tables.length > 1) {
    send_error(res, 409, "You are in multiple tables : quitting them all");
  }

  const table = tables[0];

  if (table == null) {
    send_error(res, 403, "You are not in the table");
  }

  req.table = table;

  next();
};

export const isHost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.table.hostId != req.user._id) {
    send_error(res, 401, "You are not the host of the table");
  }

  next();
};
