import type { NextOfKin, StudentProfile } from "@/lib/portal/schema";

export type ProfileBundle = {
  profile: StudentProfile;
  programTitle: string;
};

export type ProfileUpdateInput = {
  phone: string;
  email: string;
  address: string;
  nextOfKin: NextOfKin;
};

const EMPTY_PROFILE: StudentProfile = {
  id: "",
  userId: "",
  studentNumber: "",
  tempRegistrationNumber: null,
  admissionLetterRef: "",
  fullName: "",
  programId: "",
  phone: "",
  email: "",
  address: "",
  nextOfKin: { name: "", relationship: "", phone: "", email: "" },
  emergencyContact: { name: "", relationship: "", phone: "" },
  medicalInfo: {
    bloodGroup: "",
    allergies: "",
    chronicConditions: "",
    disabilities: "",
    doctorName: "",
    doctorPhone: "",
  },
  creditsCompleted: 0,
  creditsRequired: 120,
  cumulativeGpa: 0,
  semesterGpa: 0,
};

export async function getProfileBundle(profile?: StudentProfile | null): Promise<ProfileBundle> {
  const base = profile ?? EMPTY_PROFILE;
  return {
    profile: {
      ...base,
      nextOfKin: { ...base.nextOfKin },
      emergencyContact: { ...base.emergencyContact },
      medicalInfo: { ...base.medicalInfo },
    },
    programTitle: "—",
  };
}

export async function saveProfile(
  input: ProfileUpdateInput,
  profile: StudentProfile,
): Promise<{ ok: boolean; message: string; bundle: ProfileBundle }> {
  if (!input.phone.trim() || !input.email.trim() || !input.address.trim()) {
    return {
      ok: false,
      message: "Phone, email, and address are required.",
      bundle: await getProfileBundle(profile),
    };
  }
  if (!input.nextOfKin.name.trim() || !input.nextOfKin.phone.trim()) {
    return {
      ok: false,
      message: "Next-of-kin name and phone are required.",
      bundle: await getProfileBundle(profile),
    };
  }

  const next: StudentProfile = {
    ...profile,
    phone: input.phone.trim(),
    email: input.email.trim(),
    address: input.address.trim(),
    nextOfKin: {
      name: input.nextOfKin.name.trim(),
      relationship: input.nextOfKin.relationship.trim() || "Guardian",
      phone: input.nextOfKin.phone.trim(),
      email: input.nextOfKin.email.trim(),
    },
  };

  return {
    ok: true,
    message: "Profile saved for this session. Full registry sync requires a live student record.",
    bundle: await getProfileBundle(next),
  };
}
