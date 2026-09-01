"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import {
  addCourseUnit,
  deleteTimetableSlot,
  getAdminContentBundle,
  postAnnouncement,
  uploadCourseMaterial,
  upsertTimetableSlot,
  type AdminContentBundle,
} from "@/services/portal/admin/content";
import type { Announcement, TimetableSlot } from "@/lib/portal/schema";
import { WEEK_DAYS } from "@/services/portal/timetable";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type TabId = "timetable" | "notices" | "materials";

export default function AdminContentPage() {
  const [data, setData] = useState<AdminContentBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);
  const [tab, setTab] = useState<TabId>("timetable");

  // Timetable form
  const [ttDay, setTtDay] = useState<TimetableSlot["day"]>("Monday");
  const [ttStart, setTtStart] = useState("08:00");
  const [ttEnd, setTtEnd] = useState("10:00");
  const [ttUnit, setTtUnit] = useState("");
  const [ttVenue, setTtVenue] = useState("");

  // Notice form
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeBody, setNoticeBody] = useState("");
  const [noticeAudience, setNoticeAudience] =
    useState<Announcement["audience"]>("students");

  // Material form
  const [matUnit, setMatUnit] = useState("");
  const [matTitle, setMatTitle] = useState("");
  const [matType, setMatType] = useState<"pdf" | "docx">("pdf");

  // New unit form
  const [unitCode, setUnitCode] = useState("");
  const [unitTitle, setUnitTitle] = useState("");
  const [unitCredits, setUnitCredits] = useState("3");
  const [unitSemester, setUnitSemester] = useState("4");

  const load = useCallback(async () => {
    setLoading(true);
    const bundle = await getAdminContentBundle();
    setData(bundle);
    if (!ttUnit && bundle.offerableUnits[0]) setTtUnit(bundle.offerableUnits[0].id);
    if (!matUnit && bundle.catalog[0]) setMatUnit(bundle.catalog[0].id);
    setLoading(false);
  }, [ttUnit, matUnit]);

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load only
  }, []);

  function showResult(ok: boolean, text: string, bundle: AdminContentBundle) {
    setData(bundle);
    setFlash({ ok, text });
  }

  async function handleAddSlot(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFlash(null);
    const result = await upsertTimetableSlot({
      day: ttDay,
      startTime: ttStart,
      endTime: ttEnd,
      courseUnitId: ttUnit,
      venue: ttVenue,
    });
    showResult(result.ok, result.message, result.bundle);
    if (result.ok) setTtVenue("");
    setBusy(false);
  }

  async function handleDeleteSlot(id: string) {
    setBusy(true);
    setFlash(null);
    const result = await deleteTimetableSlot(id);
    showResult(result.ok, result.message, result.bundle);
    setBusy(false);
  }

  async function handlePostNotice(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFlash(null);
    const result = await postAnnouncement({
      title: noticeTitle,
      body: noticeBody,
      audience: noticeAudience,
    });
    showResult(result.ok, result.message, result.bundle);
    if (result.ok) {
      setNoticeTitle("");
      setNoticeBody("");
    }
    setBusy(false);
  }

  async function handleUploadMaterial(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFlash(null);
    const result = await uploadCourseMaterial({
      courseUnitId: matUnit,
      title: matTitle,
      fileType: matType,
    });
    showResult(result.ok, result.message, result.bundle);
    if (result.ok) setMatTitle("");
    setBusy(false);
  }

  async function handleAddUnit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFlash(null);
    const result = await addCourseUnit({
      code: unitCode,
      title: unitTitle,
      credits: Number(unitCredits),
      semester: Number(unitSemester),
    });
    showResult(result.ok, result.message, result.bundle);
    if (result.ok) {
      setUnitCode("");
      setUnitTitle("");
    }
    setBusy(false);
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: "timetable", label: "Timetable" },
    { id: "notices", label: "Notice board" },
    { id: "materials", label: "Course materials" },
  ];

  const inputClass =
    "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-primary outline-none focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/30";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="admin-page-eyebrow">Content &amp; schedule</p>
        <h1 className="admin-page-title">Manage academic content</h1>
        <p className="admin-page-desc">
          Update the school timetable, post notice board announcements, and upload course
          materials or new units.
        </p>
      </div>

      {flash ? (
        <p
          className={
            flash.ok
              ? "rounded-lg border border-accent-green/30 bg-accent-green-soft px-4 py-3 text-sm font-medium text-accent-green"
              : "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          }
          role="status"
        >
          {flash.text}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition focus-ring",
              tab === t.id
                ? "bg-primary text-white"
                : "border border-border bg-white text-muted hover:bg-surface",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading || !data ? (
        <div className="h-80 animate-pulse rounded-xl border border-border bg-white" />
      ) : (
        <>
          {tab === "timetable" ? (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
                  Weekly timetable · {data.semesterLabel}
                </h2>
                <div className="mt-4 space-y-4">
                  {WEEK_DAYS.map((day) => {
                    const slots = data.byDay[day];
                    if (!slots.length) return null;
                    return (
                      <div key={day}>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted">
                          {day}
                        </p>
                        <ul className="mt-2 space-y-2">
                          {slots.map((s) => (
                            <li
                              key={s.id}
                              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-primary">
                                  {s.courseCode} · {s.startTime}–{s.endTime}
                                </p>
                                <p className="truncate text-xs text-muted">
                                  {s.courseTitle} · {s.venue}
                                </p>
                              </div>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => void handleDeleteSlot(s.id)}
                                className="rounded-md p-1.5 text-red-600 hover:bg-red-50 focus-ring disabled:opacity-50"
                                aria-label={`Remove ${s.courseCode} slot`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </section>

              <form
                onSubmit={handleAddSlot}
                className="h-fit rounded-xl border border-border bg-white p-5 shadow-sm"
              >
                <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
                  Add timetable slot
                </h2>
                <div className="mt-4 space-y-3">
                  <label className="block text-xs font-semibold text-muted">
                    Day
                    <select
                      className={cn(inputClass, "mt-1")}
                      value={ttDay}
                      onChange={(e) =>
                        setTtDay(e.target.value as TimetableSlot["day"])
                      }
                    >
                      {WEEK_DAYS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block text-xs font-semibold text-muted">
                      Start
                      <input
                        type="time"
                        className={cn(inputClass, "mt-1")}
                        value={ttStart}
                        onChange={(e) => setTtStart(e.target.value)}
                        required
                      />
                    </label>
                    <label className="block text-xs font-semibold text-muted">
                      End
                      <input
                        type="time"
                        className={cn(inputClass, "mt-1")}
                        value={ttEnd}
                        onChange={(e) => setTtEnd(e.target.value)}
                        required
                      />
                    </label>
                  </div>
                  <label className="block text-xs font-semibold text-muted">
                    Course unit
                    <select
                      className={cn(inputClass, "mt-1")}
                      value={ttUnit}
                      onChange={(e) => setTtUnit(e.target.value)}
                      required
                    >
                      {data.offerableUnits.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.code} — {u.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-xs font-semibold text-muted">
                    Venue
                    <input
                      className={cn(inputClass, "mt-1")}
                      value={ttVenue}
                      onChange={(e) => setTtVenue(e.target.value)}
                      placeholder="Lecture Hall A"
                      required
                    />
                  </label>
                  <Button type="submit" variant="primary" className="w-full" disabled={busy}>
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Add slot
                  </Button>
                </div>
              </form>
            </div>
          ) : null}

          {tab === "notices" ? (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
              <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
                  Published notices
                </h2>
                <ul className="mt-4 divide-y divide-border">
                  {data.announcements.map((a) => (
                    <li key={a.id} className="py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-primary">{a.title}</p>
                        <StatusBadge tone="info">{a.audience}</StatusBadge>
                      </div>
                      <p className="mt-1 text-sm text-muted">{a.body}</p>
                      <p className="mt-1 text-xs text-muted">
                        {new Date(a.publishedAt).toLocaleString("en-UG")}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

              <form
                onSubmit={handlePostNotice}
                className="h-fit rounded-xl border border-border bg-white p-5 shadow-sm"
              >
                <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
                  Post announcement
                </h2>
                <div className="mt-4 space-y-3">
                  <label className="block text-xs font-semibold text-muted">
                    Title
                    <input
                      className={cn(inputClass, "mt-1")}
                      value={noticeTitle}
                      onChange={(e) => setNoticeTitle(e.target.value)}
                      required
                    />
                  </label>
                  <label className="block text-xs font-semibold text-muted">
                    Body
                    <textarea
                      className={cn(inputClass, "mt-1 min-h-28")}
                      value={noticeBody}
                      onChange={(e) => setNoticeBody(e.target.value)}
                      required
                    />
                  </label>
                  <label className="block text-xs font-semibold text-muted">
                    Audience
                    <select
                      className={cn(inputClass, "mt-1")}
                      value={noticeAudience}
                      onChange={(e) =>
                        setNoticeAudience(e.target.value as Announcement["audience"])
                      }
                    >
                      <option value="all">All</option>
                      <option value="students">Students</option>
                      <option value="staff">Staff</option>
                    </select>
                  </label>
                  <Button type="submit" variant="green" className="w-full" disabled={busy}>
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Publish notice
                  </Button>
                </div>
              </form>
            </div>
          ) : null}

          {tab === "materials" ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
                  Uploaded materials
                </h2>
                <ul className="mt-4 max-h-[28rem] space-y-2 overflow-y-auto">
                  {data.materials.map((m) => (
                    <li
                      key={m.id}
                      className="rounded-lg border border-border px-3 py-2"
                    >
                      <p className="text-sm font-semibold text-primary">{m.title}</p>
                      <p className="text-xs text-muted">
                        {m.courseCode} · {m.fileType.toUpperCase()} ·{" "}
                        {new Date(m.uploadedAt).toLocaleDateString("en-UG")}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="space-y-6">
                <form
                  onSubmit={handleUploadMaterial}
                  className="rounded-xl border border-border bg-white p-5 shadow-sm"
                >
                  <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
                    Upload material
                  </h2>
                  <div className="mt-4 space-y-3">
                    <label className="block text-xs font-semibold text-muted">
                      Course unit
                      <select
                        className={cn(inputClass, "mt-1")}
                        value={matUnit}
                        onChange={(e) => setMatUnit(e.target.value)}
                        required
                      >
                        {data.catalog.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.code} — {u.title}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-xs font-semibold text-muted">
                      Title
                      <input
                        className={cn(inputClass, "mt-1")}
                        value={matTitle}
                        onChange={(e) => setMatTitle(e.target.value)}
                        placeholder="Week 3 lecture notes"
                        required
                      />
                    </label>
                    <label className="block text-xs font-semibold text-muted">
                      File type
                      <select
                        className={cn(inputClass, "mt-1")}
                        value={matType}
                        onChange={(e) => setMatType(e.target.value as "pdf" | "docx")}
                      >
                        <option value="pdf">PDF</option>
                        <option value="docx">DOCX</option>
                      </select>
                    </label>
                    <Button type="submit" variant="primary" className="w-full" disabled={busy}>
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Upload material
                    </Button>
                  </div>
                </form>

                <form
                  onSubmit={handleAddUnit}
                  className="rounded-xl border border-border bg-white p-5 shadow-sm"
                >
                  <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
                    Add course unit
                  </h2>
                  <div className="mt-4 space-y-3">
                    <label className="block text-xs font-semibold text-muted">
                      Code
                      <input
                        className={cn(inputClass, "mt-1")}
                        value={unitCode}
                        onChange={(e) => setUnitCode(e.target.value)}
                        placeholder="NSG2207"
                        required
                      />
                    </label>
                    <label className="block text-xs font-semibold text-muted">
                      Title
                      <input
                        className={cn(inputClass, "mt-1")}
                        value={unitTitle}
                        onChange={(e) => setUnitTitle(e.target.value)}
                        required
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block text-xs font-semibold text-muted">
                        Credits
                        <input
                          type="number"
                          min={1}
                          max={8}
                          className={cn(inputClass, "mt-1")}
                          value={unitCredits}
                          onChange={(e) => setUnitCredits(e.target.value)}
                          required
                        />
                      </label>
                      <label className="block text-xs font-semibold text-muted">
                        Semester
                        <input
                          type="number"
                          min={1}
                          max={8}
                          className={cn(inputClass, "mt-1")}
                          value={unitSemester}
                          onChange={(e) => setUnitSemester(e.target.value)}
                          required
                        />
                      </label>
                    </div>
                    <Button type="submit" variant="ghost" className="w-full" disabled={busy}>
                      Add to catalog
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
