import { connection } from "next/server";
import Login from "./components/Login";
import Planner from "./components/Planner";
import StudentDashboard from "./components/StudentDashboard";
import { databaseConfigured } from "./server/database";
import { currentRole } from "./server/session";
import { listTasks } from "./server/tasks";

export default async function Page({ searchParams }) {
  await connection();
  if (!databaseConfigured()) return <Login setupRequired />;
  try {
    const role = await currentRole();
    if (role === "teacher") return <Planner initialTasks={await listTasks()} />;
    if (role === "student") return <StudentDashboard tasks={await listTasks()} />;
  } catch (error) {
    console.error("Campus Planner dashboard storage failed", error.code ?? error.name);
    return <Login problem="unavailable" />;
  }
  return <Login problem={(await searchParams).login} />;
}
