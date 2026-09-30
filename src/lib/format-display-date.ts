export function formatDisplayDate(iso: string, locale = "en-UG") {
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
