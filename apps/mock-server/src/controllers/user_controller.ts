import express, { Request, Response } from "express";

import { getDb, USERS_TABLE } from "../database";

export class UserController {
  static router = express.Router();

  static async getAllUser(req: Request, res: Response) {
    const db = await getDb();

    const users = db.chain.get(USERS_TABLE).value();

    res.status(200).json(users);
  }
}

UserController.router.get("/all", UserController.getAllUser);
