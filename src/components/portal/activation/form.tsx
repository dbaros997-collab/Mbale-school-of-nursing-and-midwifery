import { cn } from "@/lib/utils";

export const activationInputClass =
  "mt-1.5 w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30";

export function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-semibold uppercase tracking-wide text-muted"
    >
      {children}
      {required ? <span className="text-red-600"> *</span> : null}
    </label>
  );
}

export function FieldError({ message }: { message?: string | null }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-red-600">{message}</p>;
}

export function StepCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-white p-5 shadow-sm sm:p-7",
        className,
      )}
    >
      {children}
    </div>
  );
}
