"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  getProfileBundle,
  saveProfile,
  type ProfileBundle,
} from "@/services/portal/profile";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  const { refreshProfile } = useAuth();
  const [data, setData] = useState<ProfileBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [kinName, setKinName] = useState("");
  const [kinRelationship, setKinRelationship] = useState("");
  const [kinPhone, setKinPhone] = useState("");
  const [kinEmail, setKinEmail] = useState("");

  useEffect(() => {
    void getProfileBundle().then((bundle) => {
      setData(bundle);
      setPhone(bundle.profile.phone);
      setEmail(bundle.profile.email);
      setAddress(bundle.profile.address);
      setKinName(bundle.profile.nextOfKin.name);
      setKinRelationship(bundle.profile.nextOfKin.relationship);
      setKinPhone(bundle.profile.nextOfKin.phone);
      setKinEmail(bundle.profile.nextOfKin.email);
      setLoading(false);
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFlash(null);
    const result = await saveProfile({
      phone,
      email,
      address,
      nextOfKin: {
        name: kinName,
        relationship: kinRelationship,
        phone: kinPhone,
        email: kinEmail,
      },
    });
    setData(result.bundle);
    setFlash({ ok: result.ok, text: result.message });
    if (result.ok) refreshProfile();
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-cyan">
          Account
        </p>
        <h1 className="mt-1 text-2xl font-extrabold text-primary sm:text-3xl">
          Profile settings
        </h1>
        <p className="mt-1 text-sm text-muted">
          Update your contact details and next-of-kin information.
        </p>
      </div>

      {flash ? (
        <p
          role="status"
          className={
            flash.ok
              ? "rounded-lg border border-accent-green/30 bg-accent-green-soft px-4 py-3 text-sm font-medium text-accent-green"
              : "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          }
        >
          {flash.text}
        </p>
      ) : null}

      {loading || !data ? (
        <div className="h-96 animate-pulse rounded-xl border border-border bg-white" />
      ) : (
        <form
          onSubmit={handleSave}
          className="space-y-6 rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="rounded-lg bg-surface px-4 py-3">
            <p className="text-sm font-bold text-primary">{data.profile.fullName}</p>
            <p className="mt-0.5 text-xs text-muted">
              {data.profile.studentNumber} · {data.programTitle}
            </p>
          </div>

          <fieldset>
            <legend className="text-sm font-bold uppercase tracking-wider text-primary">
              Contact details
            </legend>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Phone
                </span>
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5 w-full rounded-md border border-border px-3 py-2.5 text-sm outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Email
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-md border border-border px-3 py-2.5 text-sm outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Address
                </span>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1.5 w-full rounded-md border border-border px-3 py-2.5 text-sm outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30"
                />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-bold uppercase tracking-wider text-primary">
              Next of kin
            </legend>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Full name
                </span>
                <input
                  required
                  value={kinName}
                  onChange={(e) => setKinName(e.target.value)}
                  className="mt-1.5 w-full rounded-md border border-border px-3 py-2.5 text-sm outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Relationship
                </span>
                <input
                  value={kinRelationship}
                  onChange={(e) => setKinRelationship(e.target.value)}
                  className="mt-1.5 w-full rounded-md border border-border px-3 py-2.5 text-sm outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Phone
                </span>
                <input
                  required
                  value={kinPhone}
                  onChange={(e) => setKinPhone(e.target.value)}
                  className="mt-1.5 w-full rounded-md border border-border px-3 py-2.5 text-sm outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Email
                </span>
                <input
                  type="email"
                  value={kinEmail}
                  onChange={(e) => setKinEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-md border border-border px-3 py-2.5 text-sm outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30"
                />
              </label>
            </div>
          </fieldset>

          <Button type="submit" variant="primary" disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            Save changes
          </Button>
        </form>
      )}
    </div>
  );
}
