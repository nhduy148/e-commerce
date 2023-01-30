import express, { Request, Response } from "express";

import { getDb, MENU_TABLE } from "../database";

export class MenuController {
  static router = express.Router();

  static async getMenu(req: Request, res: Response) {
    const db = await getDb();
    const menu = db.chain.get(MENU_TABLE).value();
    res.status(200).json({ data: menu });
  }
}

MenuController.router.get("/", MenuController.getMenu);
