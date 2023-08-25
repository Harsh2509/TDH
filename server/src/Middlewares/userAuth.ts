import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../Database";

const secret = process.env.JWT_SECRET || "ThisIsTemporarySecretInUse";

interface IUser {
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

export default function userAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  } else {
    jwt.verify(token, secret, async (err, user) => {
      if (err || !user || typeof user === "string") {
        return res.status(401).json({ error: "Need to Login again" });
      }
      if (!(await User.findOne({ email: user.email }))) {
        return res.status(401).json({ message: "User doesn't exist" });
      }
      req.user = user as IUser;
      next();
    });
  }
}
