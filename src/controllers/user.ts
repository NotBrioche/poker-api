import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import User from "../models/user";
import error from "../utils/send_error";

export const self = async (req: Request, res: Response) => {
  res.status(200).json(req.user);
};

export const get = async (req: Request, res: Response) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    res.sendStatus(400);
  }

  const user = await User.findById(req.params.id, { password: 0 });

  if (user != null) {
    res.status(200).json(user);
  }

  res.sendStatus(404);
};

export const signup = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (
    username.toLowerCase() != username ||
    username.replace("\\", "") != username ||
    username.replace("$", "") != username
  ) {
    res
      .status(400)
      .json(error(400, 'Usernames must be in lowercase without "\\" or "$"'));
  }

  if (password.length < 8) {
    res.status(400).json(error(400, "Password must be at least 8 characters"));
  }

  if ((await User.findOne({ username: username })) != null) {
    res.status(400).json(error(400, "Username already taken"));
  }

  const hashed = await bcrypt.hash(password, 12);

  const result = await User.insertOne({
    username: username.toLowerCase(),
    displayName: username.toLowerCase(),
    password: hashed,
    chips: 10000,
  }).catch((e) => {
    res.sendStatus(500);
  });

  res.status(201).json(result);
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username });

  if (user == null) {
    res.sendStatus(404);
    return;
  }

  const isPasswordCorrect = await bcrypt.compare(password, user!.password);

  if (!isPasswordCorrect) {
    res.status(403).json(error(403, "Wrong username or password"));
  }

  const payload = { _id: user._id, username: user.username };
  const secret = process.env.JWT_SECRET;

  if (secret !== undefined) {
    const token = jwt.sign(payload, secret, {
      expiresIn: "1w",
    });

    res.status(200).json({ token: token });
  } else {
    res.sendStatus(500);
  }
};
