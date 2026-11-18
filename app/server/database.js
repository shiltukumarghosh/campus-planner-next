import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

let database;

export function getDatabase() {
  if (database) return database;
  const path = resolve(process.env.CAMPUS_DB_PATH || "data/campus-planner.sqlite");
  mkdirSync(dirname(path), { recursive: true });
  const connection = new DatabaseSync(path);
  connection.exec(`
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      role TEXT NOT NULL CHECK (role IN ('teacher', 'student')),
      expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      subject TEXT NOT NULL,
      priority TEXT NOT NULL,
      notes TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0
    );
  `);
  database = connection;
  return database;
}
