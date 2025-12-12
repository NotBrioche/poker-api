import { Response } from "express";

export default function (res: Response, code: number, message: String) {
  let error = "Handle it with status code";

  switch (code) {
    case 400:
      error = "Bad Request";
    case 401:
      error = "Unauthorized";
    case 403:
      error = "Forbidden";
  }

  res.status(code).json({ error: error, message: message });
}
