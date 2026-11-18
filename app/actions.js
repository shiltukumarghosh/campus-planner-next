"use server";

import { redirect } from "next/navigation";
import { authenticate, currentRole, endSession, startSession } from "./server/session";
import { query } from "./server/database";
import { addTask, addTasksIfEmpty, listTasks, validateTask } from "./server/tasks";

export async function signIn(formData) {
  const role = authenticate(formData.get("email")?.toString().trim().toLowerCase(), formData.get("password"));
  if (!role) redirect("/?login=invalid");
  try {
    await startSession(role);
  } catch (error) {
    console.error("Campus Planner sign-in storage failed", error.code ?? error.name);
    redirect("/?login=unavailable");
  }
  redirect("/");
}

export async function signOut() {
  await endSession();
  redirect("/");
}

export async function changeTasks(operation, input) {
  if (await currentRole() !== "teacher") return { error: "Only teachers can change tasks. Sign in again if your session has expired." };

  if (operation === "create" || operation === "edit") {
    const values = validateTask(input);
    if (!values) return { error: "Check the task fields and try again." };
    if (operation === "create") {
      await addTask(values);
    } else {
      if (typeof input.id !== "string") return { error: "Task not found." };
      const result = await query("UPDATE tasks SET title = ?, category = ?, date = ?, subject = ?, priority = ?, notes = ? WHERE id = ?",
        ...values, input.id);
      if (!result.rowsAffected) return { error: "Task not found." };
    }
  } else if (operation === "complete" || operation === "delete") {
    if (typeof input?.id !== "string") return { error: "Task not found." };
    const result = await (operation === "delete"
      ? query("DELETE FROM tasks WHERE id = ?", input.id)
      : query("UPDATE tasks SET done = ? WHERE id = ?", Number(input.done === true), input.id));
    if (!result.rowsAffected) return { error: "Task not found." };
  } else if (operation === "samples" || operation === "import") {
    if (!Array.isArray(input) || !input.length || input.length > 500) return { error: "Choose between 1 and 500 tasks." };
    const entries = input.map(task => ({ values: validateTask(task), done: task?.done === true }));
    if (entries.some(entry => !entry.values)) return { error: "One or more tasks have invalid details." };
    if (!await addTasksIfEmpty(entries)) {
      return { error: "Bulk loading is available when the shared planner is empty.", tasks: await listTasks() };
    }
  } else {
    return { error: "Unknown task action." };
  }

  return { tasks: await listTasks() };
}
