import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const DEFAULT_DATABASE_URL = "file:./dev.db";

const getSQLiteFilePath = (databaseUrl: string) => {
  let filePath = databaseUrl.startsWith("file:")
    ? databaseUrl.slice("file:".length)
    : databaseUrl;

  if (filePath.startsWith("//")) {
    filePath = filePath.slice(2);
  }

  if (!path.isAbsolute(filePath)) {
    filePath = path.resolve(process.cwd(), filePath);
  }

  return filePath;
};

const databaseUrl = process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL;
const sqlitePath = getSQLiteFilePath(databaseUrl);
const adapter = new PrismaBetterSqlite3({ url: sqlitePath });

const prisma = new PrismaClient({ adapter });

export default prisma;
