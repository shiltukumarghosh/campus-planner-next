import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { query } from "./database";

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
  const result = await query("SELECT role FROM sessions WHERE token_hash = ? AND expires_at > ?", hash(token).toString("hex"), Date.now());
  return result.rows[0]?.role ?? null;
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (token) await query("DELETE FROM sessions WHERE token_hash = ?", hash(token).toString("hex"));
  jar.delete(cookieName);
}

export async function startSession(role) {
  await endSession();
  const token = randomBytes(32).toString("hex");
  await query("DELETE FROM sessions WHERE expires_at <= ?", Date.now());
  await query("INSERT INTO sessions VALUES (?, ?, ?)", hash(token).toString("hex"), role, Date.now() + lifetime * 1000);
  const secure = (await headers()).get("x-forwarded-proto") === "https";
  (await cookies()).set(cookieName, token, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: lifetime });
}
