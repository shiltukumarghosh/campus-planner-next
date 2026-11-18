import { signIn } from "../actions";
import UniversityBrand from "./UniversityBrand";

export default function Login({ invalid }) {
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
            {invalid && <div className="alert alert-danger" role="alert">The email or password is incorrect.</div>}
            <form action={signIn} className="d-grid gap-3">
              <label htmlFor="email">Email address<input className="form-control mt-2" id="email" name="email" type="email" autoComplete="username" placeholder="you@example.com" maxLength={254} required /></label>
              <label htmlFor="password">Password<input className="form-control mt-2" id="password" name="password" type="password" autoComplete="current-password" maxLength={256} required /></label>
              <button className="btn btn-primary mt-1">Sign in <span aria-hidden="true">→</span></button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
