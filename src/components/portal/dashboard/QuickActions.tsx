import Link from "next/link";
import { BookOpen, CalendarDays, CreditCard } from "lucide-react";

const actions = [
  {
    href: "/portal/registration",
    label: "Register courses",
    description: "Select units for the upcoming semester",
    Icon: BookOpen,
    ready: true,
  },
  {
    href: "/portal/fees",
    label: "Pay fees",
    description: "Mobile money or bank payment mock",
    Icon: CreditCard,
    ready: true,
  },
  {
    href: "/portal/timetable",
    label: "View timetable",
    description: "Weekly class and exam schedule",
    Icon: CalendarDays,
    ready: true,
  },
] as const;

export function QuickActions() {
  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Quick actions</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {actions.map(({ href, label, description, Icon, ready }) => (
          <li key={label}>
            {ready ? (
              <Link
                href={href}
                className="flex h-full flex-col rounded-lg border border-border bg-surface/60 p-4 transition hover:border-primary/30 hover:bg-accent-cyan-soft focus-ring"
              >
                <Icon className="h-5 w-5 text-primary" aria-hidden />
                <span className="mt-3 text-sm font-bold text-primary">{label}</span>
                <span className="mt-1 text-xs text-muted">{description}</span>
              </Link>
            ) : (
              <div className="flex h-full flex-col rounded-lg border border-dashed border-border bg-surface/40 p-4 opacity-80">
                <Icon className="h-5 w-5 text-muted" aria-hidden />
                <span className="mt-3 text-sm font-bold text-primary">{label}</span>
                <span className="mt-1 text-xs text-muted">{description}</span>
                <span className="mt-3 text-[10px] font-bold uppercase tracking-wide text-muted">
                  Coming soon
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
