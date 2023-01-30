import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { getDb, USERS_TABLE } from "../database";

const signToken = (id: string) => {
  return jwt.sign({ id }, "process.env.JWT_SECRET", {
    expiresIn: "365d",
  });
};

export class AuthenticationController {
  static router = express.Router();

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const db = await getDb();
    const profile = db.chain
      .get(USERS_TABLE)
      .find((data) => {
        return data.email === email && password === "s3cret";
      })
      .value();

    if (!profile) {
      return res.status(401).json({ error: "Invalid Credential" });
    }

    const token = signToken(profile.id);

    res.status(200).json({
      data: {
        profile,
        token,
      },
    });
  }
}

AuthenticationController.router.post("/login", AuthenticationController.login);
