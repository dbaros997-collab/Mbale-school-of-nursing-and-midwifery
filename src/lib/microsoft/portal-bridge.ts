import { findActivatedStudent } from "@/lib/portal/student-registry";
import { MOCK_PROGRAM } from "@/lib/portal/mock-store";
import type { Session, StudentProfile, User } from "@/lib/portal/schema";
import type { MicrosoftUserProfile } from "./types";

export function mapMicrosoftProfileToPortalSession(profile: MicrosoftUserProfile): {
  user: User;
  session: Session;
  profile: StudentProfile;
  programTitle: string;
} {
  const existing = findActivatedStudent(profile.email);

  if (existing) {
    return {
      user: { ...existing.user, email: profile.email },
      session: createMicrosoftLinkedSession(existing.user),
      profile: {
        ...existing.profile,
        fullName: profile.displayName || existing.profile.fullName,
        email: profile.email,
      },
      programTitle: MOCK_PROGRAM.title,
    };
  }

  const userId = `ms-${profile.id}`;
  const user: User = {
    id: userId,
    email: profile.email,
    passwordHash: "",
    role: profile.institutionalRole === "lecturer" ? "lecturer" : "student",
    createdAt: new Date().toISOString(),
    accountActivated: true,
    mustChangePassword: false,
  };

  const studentProfile: StudentProfile = {
    id: `stu-${profile.id}`,
    userId,
    studentNumber: profile.email.split("@")[0]?.toUpperCase() ?? "MBSNM/STU",
    tempRegistrationNumber: null,
    admissionLetterRef: "MICROSOFT-SSO",
    fullName: profile.displayName,
    programId: MOCK_PROGRAM.id,
    phone: "",
    email: profile.email,
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
    creditsRequired: MOCK_PROGRAM.totalCredits,
    cumulativeGpa: 0,
    semesterGpa: 0,
  };

  return {
    user,
    session: createMicrosoftLinkedSession(user),
    profile: studentProfile,
    programTitle: MOCK_PROGRAM.title,
  };
}

function createMicrosoftLinkedSession(user: User): Session {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 8);

  return {
    id: `sess-ms-${user.id}`,
    userId: user.id,
    role: user.role,
    token: `microsoft-sso.${user.id}`,
    expiresAt: expiresAt.toISOString(),
  };
}
