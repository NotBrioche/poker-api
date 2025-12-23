import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import User from "../models/user";
import send_error from "../utils/send_error";

export const self = async (req: Request, res: Response) => {
  res.status(200).json(req.user);
};

export const get = async (req: Request, res: Response) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    res.sendStatus(400);
  }

  const user = await User.findById(req.params.id, {
    password: 0,
    chips: 0,
    verified: 0,
  });

  if (user != null) {
    res.status(200).json(user);
  }

  res.sendStatus(404);
};

export const changeDisplayName = async (req: Request, res: Response) => {
  const { displayName } = req.body;

  if (!displayName) {
    send_error(res, 400, "Please provide a display name");
  }

  if (displayName.length > 30 || displayName.length < 1) {
    send_error(res, 400, "Display name must be between 1 and 30 characters");
  }

  if (displayName.replace("\\", "") != displayName) {
    send_error(res, 400, 'Display name can\'t contain "\\"');
  }

  await User.updateOne({ _id: req.user._id }, { displayName: displayName });
  res.sendStatus(200);
};

export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const re = /^\S+@\S+\.\S+$/;

  if (!re.test(email)) {
    send_error(res, 400, "Please enter a valid email");
  }

  if (
    username.toLowerCase() != username ||
    username.replace("\\", "") != username
  ) {
    send_error(res, 400, 'Usernames must be in lowercase without "\\"');
  }

  if (password.length < 8) {
    send_error(res, 400, "Password must be at least 8 characters");
  }

  if ((await User.findOne({ email: email })) != null) {
    send_error(res, 400, "Email already used");
  }

  if ((await User.findOne({ username: username })) != null) {
    send_error(res, 400, "Username already taken");
  }

  const hashed = await bcrypt.hash(password, 12);

  await User.insertOne({
    username: username.toLowerCase(),
    email: email,
    displayName: username.toLowerCase(),
    password: hashed,
  }).catch((e) => {
    res.sendStatus(500);
  });

  res.sendStatus(201);
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
    send_error(res, 403, "Wrong username or password");
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
