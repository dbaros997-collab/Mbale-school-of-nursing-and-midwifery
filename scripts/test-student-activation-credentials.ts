/**
 * Verifies unique, isolated portal activation credentials for newly admitted students.
 *
 * Run: npm run test:student-activation
 */
import {
  generateUniqueActivationCredentials,
  validateActivationCredentialIndex,
  type ActivationCredentialIndex,
} from "../src/lib/portal/activation-credentials";
import {
  __resetStudentRegistryForTests,
  admitStudentForPortalActivation,
  findPendingActivation,
  registerActivatedStudent,
  validateActivationRegistryIntegrity,
} from "../src/lib/portal/student-registry";
import { buildFullActivationCredentialIndex } from "../src/services/portal/student-admission-service";
import {
  completeAccountActivation,
  loginStudent,
  verifyStudentIdentity,
} from "../src/services/portal/auth";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function runCredentialGeneratorChecks() {
  const index: ActivationCredentialIndex = {
    tempRegistrationNumbers: new Set(["TMP/MBSNM/2026/042"]),
    admissionLetterRefs: new Set(["ADM-MBSNM-2026-1184"]),
    studentNumbers: new Set(["MBSNM/NS/2026/042"]),
  };

  const first = generateUniqueActivationCredentials(index, 2026);
  assert(
    first.tempRegistrationNumber !== "TMP/MBSNM/2026/042",
    "Generator should skip an existing temporary registration number.",
  );
  assert(
    first.admissionLetterRef !== "ADM-MBSNM-2026-1184",
    "Generator should skip an existing admission letter reference.",
  );

  index.tempRegistrationNumbers.add(first.tempRegistrationNumber.toUpperCase());
  index.admissionLetterRefs.add(first.admissionLetterRef.toUpperCase());
  index.studentNumbers.add(first.studentNumber.toUpperCase());

  const second = generateUniqueActivationCredentials(index, 2026);
  assert(
    second.tempRegistrationNumber !== first.tempRegistrationNumber,
    "Second generated temporary registration must differ from the first.",
  );
  assert(
    second.admissionLetterRef !== first.admissionLetterRef,
    "Second generated admission letter reference must differ from the first.",
  );

  const integrity = validateActivationCredentialIndex({
    tempRegistrationNumbers: new Set([
      first.tempRegistrationNumber.toUpperCase(),
      second.tempRegistrationNumber.toUpperCase(),
    ]),
    admissionLetterRefs: new Set([
      first.admissionLetterRef.toUpperCase(),
      second.admissionLetterRef.toUpperCase(),
    ]),
    studentNumbers: new Set([
      first.studentNumber.toUpperCase(),
      second.studentNumber.toUpperCase(),
    ]),
  });
  assert(integrity.length === 0, `Expected no integrity issues, got: ${integrity.map((i) => i.message).join("; ")}`);
}

function runPortalIsolationChecks() {
  __resetStudentRegistryForTests();

  const admitted = [];
  for (let i = 0; i < 5; i += 1) {
    const index = buildFullActivationCredentialIndex();
    const pending = admitStudentForPortalActivation(
      {
        fullName: `Test Student ${i + 1}`,
        email: `test.student.${i + 1}@mbaleschoolofnursing.ac.ug`,
        phone: `+256 700 000 ${100 + i}`,
        programId: "prog-dn",
      },
      index,
    );
    admitted.push(pending);
  }

  const temps = new Set(admitted.map((p) => p.tempRegistrationNumber.toUpperCase()));
  const letters = new Set(admitted.map((p) => p.admissionLetterRef.toUpperCase()));
  assert(temps.size === admitted.length, "Each admitted student must receive a unique temporary registration number.");
  assert(letters.size === admitted.length, "Each admitted student must receive a unique admission letter reference.");

  for (const pending of admitted) {
    const match = findPendingActivation(
      pending.tempRegistrationNumber,
      pending.admissionLetterRef,
    );
    assert(Boolean(match), `Expected activation lookup to succeed for ${pending.fullName}.`);
    assert(
      match!.email === pending.email,
      "Activation lookup must map to the same student email.",
    );
  }

  const a = admitted[0]!;
  const b = admitted[1]!;
  const crossMatch = findPendingActivation(a.tempRegistrationNumber, b.admissionLetterRef);
  assert(
    crossMatch === null,
    "Cross-pairing temp registration and admission letter from different students must not activate.",
  );

  registerActivatedStudent(a, {
    passwordHash: "mock-hash:Student@Test1",
    phone: a.phone,
    address: "Mbale, Uganda",
    nextOfKin: { name: "Kin A", relationship: "Guardian", phone: "+256 700 111 111", email: "" },
    emergencyContact: { name: "Emer A", relationship: "Relative", phone: "+256 700 222 222" },
    medicalInfo: {
      bloodGroup: "O+",
      allergies: "None",
      chronicConditions: "None",
      disabilities: "None",
      doctorName: "Dr Test",
      doctorPhone: "+256 700 333 333",
    },
  });

  const reused = findPendingActivation(a.tempRegistrationNumber, a.admissionLetterRef);
  assert(reused === null, "Activated credentials must be removed from the pending queue.");

  const integrity = validateActivationRegistryIntegrity();
  assert(integrity.length === 0, `Registry integrity failed: ${integrity.map((i) => i.message).join("; ")}`);
}

/** Same server actions used by /portal/activate (ActivationWizard). */
async function runActivationWizardFlowChecks() {
  __resetStudentRegistryForTests();
  const index = buildFullActivationCredentialIndex();
  const pending = admitStudentForPortalActivation(
    {
      fullName: "Portal Flow Test Student",
      email: "portal.flow.test@mbaleschoolofnursing.ac.ug",
      phone: "+256 700 999 001",
      programId: "prog-dn",
    },
    index,
  );

  const verify = await verifyStudentIdentity({
    tempRegistrationNumber: pending.tempRegistrationNumber,
    admissionLetterRef: pending.admissionLetterRef,
  });
  assert(verify.ok && verify.data?.email === pending.email, verify.message);

  const wrongPair = await verifyStudentIdentity({
    tempRegistrationNumber: pending.tempRegistrationNumber,
    admissionLetterRef: "ADM-MBSNM-2099-9999",
  });
  assert(!wrongPair.ok, "Wrong admission letter must fail verification.");

  const password = "Portal@Test26";
  const activate = await completeAccountActivation({
    password,
    confirmPassword: password,
    profile: {
      phone: pending.phone,
      address: "Mbale, Uganda",
      nextOfKin: {
        name: "Test Kin",
        relationship: "Guardian",
        phone: "+256 700 999 002",
        email: "kin.test@email.com",
      },
      emergencyContact: {
        name: "Test Emergency",
        relationship: "Sibling",
        phone: "+256 700 999 003",
      },
      medicalInfo: {
        bloodGroup: "A+",
        allergies: "None",
        chronicConditions: "None",
        disabilities: "None",
        doctorName: "Dr Test",
        doctorPhone: "+256 700 999 004",
      },
    },
  });
  assert(activate.ok && activate.data?.profile.studentNumber === pending.studentNumber, activate.message);

  const login = await loginStudent(pending.email, password);
  assert(login.ok && login.data?.profile.fullName === pending.fullName, login.message);
}

async function main() {
  runCredentialGeneratorChecks();
  runPortalIsolationChecks();
  await runActivationWizardFlowChecks();
  console.log("✓ Student activation credential checks passed.");
  console.log("  - Unique TMP/MBSNM/YYYY/XXX and ADM-MBSNM-YYYY-XXXX generation");
  console.log("  - Pair-isolated portal activation lookup");
  console.log("  - Post-activation pending queue cleanup");
  console.log("  - /portal/activate wizard flow (verify → activate → login)");
}

void main();
