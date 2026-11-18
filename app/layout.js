import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

export const metadata = {
  title: "SVU Campus Planner",
  description: "Plan coursework, track academic deadlines, and see your semester progress.",
  icons: { icon: "/svu-logo.png" },
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
