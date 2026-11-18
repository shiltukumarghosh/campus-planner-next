import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { getDatabase } from "./database";

const cookieName = "campus_session";
const lifetime = 8 * 60 * 60;
const accountEmails = { teacher: "teacher@gmail.com", student: "student@gmail.com" };
const demoPassword = "12345678";

function hash(value) {
  return createHash("sha256").update(value).digest();
}

function demoEnabled() {
  return !process.env.CAMPUS_TEACHER_PASSWORD && !process.env.CAMPUS_STUDENT_PASSWORD
    && process.env.CAMPUS_DEMO_MODE !== "off";
}

export function authenticate(email, password) {
  const role = Object.keys(accountEmails).find(role => accountEmails[role] === email);
  if (!role) return null;
  if (typeof password !== "string" || password.length > 256) return null;
  const configuredPassword = role === "teacher" ? process.env.CAMPUS_TEACHER_PASSWORD : process.env.CAMPUS_STUDENT_PASSWORD;
  const expected = demoEnabled() ? demoPassword : configuredPassword;
  return expected && timingSafeEqual(hash(password), hash(expected)) ? role : null;
}

export async function currentRole() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  return getDatabase().prepare("SELECT role FROM sessions WHERE token_hash = ? AND expires_at > ?")
    .get(hash(token).toString("hex"), Date.now())?.role ?? null;
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (token) getDatabase().prepare("DELETE FROM sessions WHERE token_hash = ?").run(hash(token).toString("hex"));
  jar.delete(cookieName);
}

export async function startSession(role) {
  await endSession();
  const token = randomBytes(32).toString("hex");
  const db = getDatabase();
  db.prepare("DELETE FROM sessions WHERE expires_at <= ?").run(Date.now());
  db.prepare("INSERT INTO sessions VALUES (?, ?, ?)").run(hash(token).toString("hex"), role, Date.now() + lifetime * 1000);
  const secure = (await headers()).get("x-forwarded-proto") === "https";
  (await cookies()).set(cookieName, token, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: lifetime });
}
