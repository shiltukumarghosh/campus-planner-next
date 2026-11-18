"use server";

import { redirect } from "next/navigation";
import { authenticate, currentRole, endSession, startSession } from "./server/session";
import { getDatabase } from "./server/database";
import { addTask, addTasksIfEmpty, listTasks, validateTask } from "./server/tasks";

export async function signIn(formData) {
  const role = authenticate(formData.get("email")?.toString().trim().toLowerCase(), formData.get("password"));
  if (!role) redirect("/?login=invalid");
  await startSession(role);
  redirect("/");
}

export async function signOut() {
  await endSession();
  redirect("/");
}

export async function changeTasks(operation, input) {
  if (await currentRole() !== "teacher") return { error: "Only teachers can change tasks. Sign in again if your session has expired." };

  const db = getDatabase();
  if (operation === "create" || operation === "edit") {
    const values = validateTask(input);
    if (!values) return { error: "Check the task fields and try again." };
    if (operation === "create") {
      addTask(db, values);
    } else {
      if (typeof input.id !== "string") return { error: "Task not found." };
      const result = db.prepare("UPDATE tasks SET title = ?, category = ?, date = ?, subject = ?, priority = ?, notes = ? WHERE id = ?")
        .run(...values, input.id);
      if (!result.changes) return { error: "Task not found." };
    }
  } else if (operation === "complete" || operation === "delete") {
    if (typeof input?.id !== "string") return { error: "Task not found." };
    const result = operation === "delete"
      ? db.prepare("DELETE FROM tasks WHERE id = ?").run(input.id)
      : db.prepare("UPDATE tasks SET done = ? WHERE id = ?").run(Number(input.done === true), input.id);
    if (!result.changes) return { error: "Task not found." };
  } else if (operation === "samples" || operation === "import") {
    if (!Array.isArray(input) || !input.length || input.length > 500) return { error: "Choose between 1 and 500 tasks." };
    const entries = input.map(task => ({ values: validateTask(task), done: task?.done === true }));
    if (entries.some(entry => !entry.values)) return { error: "One or more tasks have invalid details." };
    if (!addTasksIfEmpty(entries)) return { error: "Bulk loading is available when the shared planner is empty.", tasks: listTasks() };
  } else {
    return { error: "Unknown task action." };
  }

  return { tasks: listTasks() };
}
