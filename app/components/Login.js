import { signIn } from "../actions";
import UniversityBrand from "./UniversityBrand";

export default function Login({ problem, setupRequired = false }) {
  return (
    <main className="login-screen">
      <div className="login-card">
        <section className="login-brand-panel" aria-label="Swami Vivekananda University">
          <div className="login-brand-content">
            <UniversityBrand subtitle="Swami Vivekananda University" />
          </div>
        </section>
        <section className="login-form-panel" aria-labelledby="sign-in-title">
          <div className="login-form-content">
            <h1 id="sign-in-title">Sign in</h1>
            <p className="login-description">Use your teacher or student account to access your dashboard.</p>
            {setupRequired && <div className="alert alert-warning" role="alert">Sign-in is unavailable until this deployment is connected to its database.</div>}
            {problem === "invalid" && <div className="alert alert-danger" role="alert">The email or password is incorrect.</div>}
            {problem === "unavailable" && <div className="alert alert-warning" role="alert">The planner could not connect to its database. Please try again shortly.</div>}
            <form action={signIn} className="d-grid gap-3">
              <label htmlFor="email">Email address<input className="form-control mt-2" id="email" name="email" type="email" autoComplete="username" placeholder="you@example.com" maxLength={254} required /></label>
              <label htmlFor="password">Password<input className="form-control mt-2" id="password" name="password" type="password" autoComplete="current-password" maxLength={256} required /></label>
              <button className="btn btn-primary mt-1" disabled={setupRequired}>Sign in <span aria-hidden="true">→</span></button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
