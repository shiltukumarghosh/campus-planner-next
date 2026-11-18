import { randomUUID } from "node:crypto";
import { categories, priorities } from "../planner-options";
import { query } from "./database";

export async function listTasks() {
  const { rows } = await query("SELECT * FROM tasks ORDER BY date, id");
  return rows.map(({ id, title, category, date, subject, priority, notes, done }) =>
    ({ id, title, category, date, subject, priority, notes, done: Boolean(done) }));
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

export async function addTask(values) {
  await query("INSERT INTO tasks (id, title, category, date, subject, priority, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
    randomUUID(), ...values);
}

export async function addTasksIfEmpty(entries) {
  const records = entries.map(({ values, done }) => [randomUUID(), ...values, Number(done)]);
  const result = await query(`
    INSERT INTO tasks (id, title, category, date, subject, priority, notes, done)
    SELECT value ->> 0, value ->> 1, value ->> 2, value ->> 3,
           value ->> 4, value ->> 5, value ->> 6, value ->> 7
    FROM json_each(?)
    WHERE NOT EXISTS (SELECT 1 FROM tasks)
  `, JSON.stringify(records));
  return result.rowsAffected > 0;
}
