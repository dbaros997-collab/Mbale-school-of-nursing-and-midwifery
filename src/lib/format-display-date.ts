export function formatDisplayDate(iso: string, locale = "en-UG") {
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Makerere-style list dates, e.g. “29 September, 2026”. */
export function formatMakNewsDate(iso: string, locale = "en-GB") {
  const formatted = new Date(iso).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return formatted.replace(/^(\d+\s+\w+)\s(\d{4})$/, "$1, $2");
}
