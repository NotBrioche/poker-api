import { NextFunction, Request, Response } from "express";
import Table from "../models/table";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = Table.insertOne({
    name: req.body.name,
    users: req.body.users,
    blindPrice: req.body.blindPrice,
    raiseLimit: req.body.raiseLimit,
  });

  res.status(201).json(result);
};
