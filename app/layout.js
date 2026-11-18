import "./globals.css";

export const metadata = {
  title: "Campus Planner",
  description: "A simple planner for college assignments, exams and projects.",
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
