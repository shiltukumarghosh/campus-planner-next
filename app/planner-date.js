export function dateKey(date = new Date()) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part, index) => String(part).padStart(index === 0 ? 4 : 2, "0")).join("-");
}

export function formatDate(date, options = { month: "short", day: "numeric" }) {
  return new Date(date + "T00:00:00").toLocaleDateString(undefined, options);
}
