import type { GraphNotice } from "@/lib/microsoft/types";

function formatPublished(iso: string) {
  return new Date(iso).toLocaleString("en-UG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type MicrosoftNoticesListProps = {
  notices: GraphNotice[];
};

export function MicrosoftNoticesList({ notices }: MicrosoftNoticesListProps) {
  if (notices.length === 0) {
    return (
      <p className="px-5 py-8 text-sm text-muted">
        No SharePoint notices are configured yet. Ask ICT to set{" "}
        <code className="text-xs">MICROSOFT_NOTICES_LIST_ID</code> or check the local notice
        board.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {notices.map((notice) => (
        <li key={notice.id} className="px-5 py-4">
          <p className="font-bold text-primary">{notice.title}</p>
          {notice.body ? (
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{notice.body}</p>
          ) : null}
          <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-muted">
            {formatPublished(notice.publishedAt)} · {notice.source}
          </p>
        </li>
      ))}
    </ul>
  );
}
