# SVU Campus Planner

A Bootstrap 5 and Next.js academic planner with teacher and student dashboards. The teacher creates and manages shared coursework. Students sign in to view and search assigned tasks.

## Run locally

Use Node.js 24 or later.

```sh
npm ci
npm run dev
```

Open http://localhost:3000.

| Role | Email | Demo password |
| --- | --- | --- |
| Teacher | teacher@gmail.com | 12345678 |
| Student | student@gmail.com | 12345678 |

## Showcase walkthrough

1. Sign in as the teacher and select **New task**. Enter a due date, subject, priority, and instructions.
2. The teacher can also edit, close, reopen, or delete tasks and browse deadlines on the calendar.
3. Open a private browser window and sign in as the student on the same server. The published task appears under **Assigned tasks**, where it can be searched or filtered by category.
4. Reload either dashboard to demonstrate persistence. If you have tasks from the previous browser-only version, the teacher can explicitly publish them when the shared planner is empty.

## Architecture and hosting

Next.js server actions verify the signed-in role before every task write. Sessions and tasks are stored in SQLite at `data/campus-planner.sqlite` by default. Both accounts use one shared class task list. Components in `app/components` provide the sign-in form and separate dashboards.

Use `npm run build` followed by `npm start` for a production build on a Node.js server with a persistent writable disk. Set `CAMPUS_DB_PATH` to choose the local database path. For a shared deployment, set `CAMPUS_TEACHER_PASSWORD` and `CAMPUS_STUDENT_PASSWORD` to distinct passwords and serve the app over HTTPS. The demo credentials are disabled when either password is configured, or when `CAMPUS_DEMO_MODE=off`.

### Deploy to Vercel

1. Connect a [Turso database](https://vercel.com/marketplace/tursocloud/database) to the Campus Planner project in Vercel.
2. In the project's environment variables, verify that `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are set for **Production**. Enable them for **Preview** too if you test preview deployments. Use a token with write access.
3. Deploy the updated code and redeploy after changing environment variables. The app creates its tables when it first connects.

Local SQLite files stay on the computer where they were created. A new Turso database starts with an empty task list.
