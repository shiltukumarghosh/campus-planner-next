import { randomUUID } from "node:crypto";
import { categories, priorities } from "../planner-options";
import { getDatabase } from "./database";

export function listTasks() {
  return getDatabase().prepare("SELECT * FROM tasks ORDER BY date, id")
    .all().map(task => ({ ...task, done: Boolean(task.done) }));
}

export function validateTask(input) {
  if (!input || typeof input !== "object") return null;
  const { title, category, date, subject, priority, notes } = input;
  if (![title, date, subject, notes].every(value => typeof value === "string")) return null;
  if (!title.trim() || title.length > 100 || subject.length > 80 || notes.length > 500) return null;
  if (!categories.includes(category) || !priorities.includes(priority)) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const parsedDate = new Date(date + "T00:00:00Z");
  if (!Number.isFinite(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) return null;
  return [title.trim(), category, date, subject.trim(), priority, notes.trim()];
}

export function addTask(db, values, done = false) {
  db.prepare("INSERT INTO tasks (id, title, category, date, subject, priority, notes, done) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
    .run(randomUUID(), ...values, Number(done));
}

export function addTasksIfEmpty(entries) {
  const db = getDatabase();
  db.exec("BEGIN IMMEDIATE");
  try {
    if (db.prepare("SELECT id FROM tasks LIMIT 1").get()) {
      db.exec("ROLLBACK");
      return false;
    }
    for (const { values, done } of entries) addTask(db, values, done);
    db.exec("COMMIT");
    return true;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
