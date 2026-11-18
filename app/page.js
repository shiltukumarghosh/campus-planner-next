import Login from "./components/Login";
import Planner from "./components/Planner";
import StudentDashboard from "./components/StudentDashboard";
import { currentRole } from "./server/session";
import { listTasks } from "./server/tasks";

export default async function Page({ searchParams }) {
  const role = await currentRole();
  if (role === "teacher") return <Planner initialTasks={listTasks()} />;
  if (role === "student") return <StudentDashboard tasks={listTasks()} />;
  return <Login invalid={(await searchParams).login === "invalid"} />;
}
