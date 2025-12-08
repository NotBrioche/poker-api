import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import error from "../utils/send_error";
import User from "../models/user";

export const isLogged = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res
      .status(401)
      .json(error(401, "You must be logged in to perform this action"));
    return;
  }

  const secret = process.env.JWT_SECRET;

  if (secret === undefined || secret == null) {
    res.sendStatus(500);
    return;
  }

  jwt.verify(token, secret, async (err: any, decoded: any) => {
    if (err) {
      res.status(403).json(error(403, "Invalid or expired token"));
    }

    const user = await User.findById(decoded._id, { password: 0, __v: 0 });

    if (user == null) {
      res.sendStatus(404);
    }

    req.user = user;
    next();
  });
};
