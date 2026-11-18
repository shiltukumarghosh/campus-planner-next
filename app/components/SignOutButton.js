import { signOut } from "../actions";

export default function SignOutButton() {
  return <form action={signOut}><button type="submit" className="btn btn-soft">Sign out</button></form>;
}
