import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "./contract.js";
import contractJson from "./contract.json" with { type: "json" };

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);

dotenv.config({
  path: path.resolve(currentDir, "../../.env"),
});

const databaseUrl = process.env["DATABASE_URL"];

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing from packages/db/.env");
}

export const db = postgres<Contract>({
  contractJson,
  url: databaseUrl,
});
