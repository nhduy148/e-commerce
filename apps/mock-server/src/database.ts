import path from "path";

import { IProduct, IUser, IMenu } from "@hera/data";
import { JSONFile, Low } from "jddb";
import lodash from "lodash";

import { readEntityFile } from "./data/helpers";

const databaseFile = path.join(process.cwd(), "", "database.json");

export const PRODUCTS_TABLE = "products";
export const USERS_TABLE = "users";
export const MENU_TABLE = "menu";

interface DbSchema {
  [PRODUCTS_TABLE]: IProduct[];
  [USERS_TABLE]: IUser[];
  [MENU_TABLE]: IMenu[];
}

// Extend Low class with a new `chain` field
class LowWithLodash<T> extends Low<T> {
  chain: lodash.ExpChain<this["data"]> = lodash.chain(this).get("data");
}

const adapter = new JSONFile<DbSchema>(databaseFile);
const db = new LowWithLodash(adapter);

export async function getDb() {
  await db.read();
  return db;
}

export const seedDatabase = async () => {
  const products = readEntityFile(PRODUCTS_TABLE);
  const users = readEntityFile(USERS_TABLE);
  const menu = readEntityFile(MENU_TABLE);

  await db.read();

  db.data = {
    products,
    users,
    menu,
  };

  // seed database with test data
  await db.write();
};
