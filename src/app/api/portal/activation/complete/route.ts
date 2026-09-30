import type {
  EmergencyContact,
  MedicalInfo,
  NextOfKin,
  PendingActivation,
} from "@/lib/portal/schema";
import { completePortalActivationInDb } from "@/lib/supabase/student-portal-auth-store";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { validatePassword } from "@/services/portal/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  pending?: PendingActivation;
  password?: string;
  confirmPassword?: string;
  profile?: {
    phone?: string;
    address?: string;
    nextOfKin?: NextOfKin;
    emergencyContact?: EmergencyContact;
    medicalInfo?: MedicalInfo;
  };
};

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return Response.json(
      { ok: false, message: "Portal activation requires a live Supabase connection." },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  if (!body.pending) {
    return Response.json({
      ok: false,
      message: "Start again from identity verification — your session expired.",
    });
  }

  const password = body.password ?? "";
  const passwordError = validatePassword(password);
  if (passwordError) {
    return Response.json({ ok: false, message: passwordError });
  }
  if (password !== (body.confirmPassword ?? "")) {
    return Response.json({ ok: false, message: "Passwords do not match." });
  }

  const profile = body.profile ?? {};
  if (!profile.phone?.trim() || !profile.address?.trim()) {
    return Response.json({ ok: false, message: "Phone and residential address are required." });
  }
  if (!profile.nextOfKin?.name?.trim() || !profile.nextOfKin?.phone?.trim()) {
    return Response.json({ ok: false, message: "Next-of-kin name and phone are required." });
  }
  if (!profile.emergencyContact?.name?.trim() || !profile.emergencyContact?.phone?.trim()) {
    return Response.json({
      ok: false,
      message: "Emergency contact name and phone are required.",
    });
  }
  if (!profile.medicalInfo?.bloodGroup?.trim()) {
    return Response.json({
      ok: false,
      message: "Blood group is required for institutional records.",
    });
  }

  const result = await completePortalActivationInDb({
    pending: body.pending,
    password,
    phone: profile.phone.trim(),
    address: profile.address.trim(),
    nextOfKin: {
      name: profile.nextOfKin.name.trim(),
      relationship: profile.nextOfKin.relationship?.trim() || "Guardian",
      phone: profile.nextOfKin.phone.trim(),
      email: profile.nextOfKin.email?.trim() ?? "",
    },
    emergencyContact: {
      name: profile.emergencyContact.name.trim(),
      relationship: profile.emergencyContact.relationship?.trim() || "Relative",
      phone: profile.emergencyContact.phone.trim(),
    },
    medicalInfo: {
      bloodGroup: profile.medicalInfo.bloodGroup.trim(),
      allergies: profile.medicalInfo.allergies?.trim() || "None known",
      chronicConditions: profile.medicalInfo.chronicConditions?.trim() || "None",
      disabilities: profile.medicalInfo.disabilities?.trim() || "None",
      doctorName: profile.medicalInfo.doctorName?.trim() ?? "",
      doctorPhone: profile.medicalInfo.doctorPhone?.trim() ?? "",
    },
  });

  if (!result.ok) {
    return Response.json({ ok: false, message: result.message });
  }

  return Response.json({
    ok: true,
    message: "Account activated successfully.",
    data: {
      user: result.user,
      profile: result.profile,
      programTitle: "Diploma in Nursing (Direct)",
    },
  });
}
