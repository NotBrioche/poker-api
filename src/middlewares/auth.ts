import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import send_error from "../utils/send_error";
import User from "../models/user";

export const isLogged = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    send_error(res, 401, "You must be logged in to perform this action");
    return;
  }

  const secret = process.env.JWT_SECRET;

  if (secret === undefined || secret == null) {
    res.sendStatus(500);
    return;
  }

  jwt.verify(token, secret, async (err: any, decoded: any) => {
    if (err) {
      send_error(res, 403, "Invalid or expired token");
    }

    const user = await User.findById(decoded._id, { password: 0 });

    if (user == null) {
      send_error(res, 404, "User not found");
    }

    req.user = user;
    next();
  });
};

export const isVerified = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.verified) {
    next();
    return;
  }

  send_error(
    res,
    401,
    "You must verify your email address to perform this action"
  );
};
