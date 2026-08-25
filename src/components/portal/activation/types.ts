import type {
  EmergencyContact,
  MedicalInfo,
  NextOfKin,
} from "@/lib/portal/schema";

export type WizardDraft = {
  tempRegistrationNumber: string;
  admissionLetterRef: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  nextOfKin: NextOfKin;
  emergencyContact: EmergencyContact;
  medicalInfo: MedicalInfo;
};

export function emptyWizardDraft(): WizardDraft {
  return {
    tempRegistrationNumber: "",
    admissionLetterRef: "",
    password: "",
    confirmPassword: "",
    phone: "",
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
  };
}
