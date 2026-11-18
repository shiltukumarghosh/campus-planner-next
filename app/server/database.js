import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { createClient } from "@libsql/client/web";

let database;

const schema = [
  `
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      role TEXT NOT NULL CHECK (role IN ('teacher', 'student')),
      expires_at INTEGER NOT NULL
    )`,
  `
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      subject TEXT NOT NULL,
      priority TEXT NOT NULL,
      notes TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0
    )`,
];

export function databaseConfigured() {
  const { TURSO_DATABASE_URL: url, TURSO_AUTH_TOKEN: token, VERCEL: vercel } = process.env;
  return url || token || vercel === "1" ? Boolean(url && token) : true;
}

async function openDatabase() {
  if (!databaseConfigured()) throw new Error("Turso database configuration is missing.");
  const url = process.env.TURSO_DATABASE_URL;
  if (url) {
    const client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
    try {
      for (const statement of schema) await client.execute(statement);
      return (sql, args) => client.execute({ sql, args });
    } catch (error) {
      client.close();
      throw error;
    }
  }

  const path = resolve(process.env.CAMPUS_DB_PATH || "data/campus-planner.sqlite");
  mkdirSync(dirname(path), { recursive: true });
  const connection = new DatabaseSync(path);
  try {
    connection.exec("PRAGMA busy_timeout = 5000");
    for (const statement of schema) connection.exec(statement);
  } catch (error) {
    connection.close();
    throw error;
  }
  return (sql, args) => {
    const statement = connection.prepare(sql);
    if (statement.columns().length) return { rows: statement.all(...args) };
    return { rowsAffected: statement.run(...args).changes };
  };
}

function getDatabase() {
  database ??= openDatabase().catch(error => {
    database = undefined;
    throw error;
  });
  return database;
}

export async function query(sql, ...args) {
  const execute = await getDatabase();
  return execute(sql, args);
}
