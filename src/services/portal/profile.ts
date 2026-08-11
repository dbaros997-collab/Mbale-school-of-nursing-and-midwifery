import {
  MOCK_PROFILE,
  MOCK_PROGRAM,
  updateMockProfile,
} from "@/lib/portal/mock-store";
import type { NextOfKin, StudentProfile } from "@/lib/portal/schema";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

/** Ready for GET /api/portal/profile */
export async function getProfileBundle(): Promise<ProfileBundle> {
  await delay(200);
  return {
    profile: {
      ...MOCK_PROFILE,
      nextOfKin: { ...MOCK_PROFILE.nextOfKin },
    },
    programTitle: MOCK_PROGRAM.title,
  };
}

/** Ready for PATCH /api/portal/profile */
export async function saveProfile(
  input: ProfileUpdateInput,
): Promise<{ ok: boolean; message: string; bundle: ProfileBundle }> {
  await delay(450);

  if (!input.phone.trim() || !input.email.trim() || !input.address.trim()) {
    return {
      ok: false,
      message: "Phone, email, and address are required.",
      bundle: await getProfileBundle(),
    };
  }
  if (!input.nextOfKin.name.trim() || !input.nextOfKin.phone.trim()) {
    return {
      ok: false,
      message: "Next-of-kin name and phone are required.",
      bundle: await getProfileBundle(),
    };
  }

  updateMockProfile({
    phone: input.phone.trim(),
    email: input.email.trim(),
    address: input.address.trim(),
    nextOfKin: {
      name: input.nextOfKin.name.trim(),
      relationship: input.nextOfKin.relationship.trim() || "Guardian",
      phone: input.nextOfKin.phone.trim(),
      email: input.nextOfKin.email.trim(),
    },
  });

  return {
    ok: true,
    message: "Profile updated successfully.",
    bundle: await getProfileBundle(),
  };
}
