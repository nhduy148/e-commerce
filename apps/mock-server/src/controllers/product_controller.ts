import express, { Request, Response } from "express";
import { getDb, PRODUCTS_TABLE } from "../database";

export class ProductController {
  static router = express.Router();

  static async index(req: Request, res: Response) {
    const db = await getDb();

    const products = db.chain.get(PRODUCTS_TABLE).value();

    res.json({
      data: {
        data: products,
        paginate: {
          has_next: false,
          has_prev: false,
          page: 1,
          size: 20,
          total: 3,
          total_entries: 0,
          total_pages: 0,
        },
      },
    });
  }
}

ProductController.router.get("/", ProductController.index);
