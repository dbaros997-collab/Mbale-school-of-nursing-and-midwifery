import { SCHOOL } from "@/lib/data";

/** Shown on the public privacy policy page and referenced from forms. */
export const PRIVACY_POLICY_LAST_UPDATED = "30 September 2026";

export const PRIVACY_POLICY_PATH = "/privacy";

export const privacyFormNotice =
  `${SCHOOL.shortName} collects the personal information you provide to respond to your request, process admissions, or send updates you ask for. We process data in line with the Data Protection and Privacy Act, 2019 (Uganda) and our Privacy Policy.`;

export type PrivacyPolicySection = {
  title: string;
  body: string[];
};

export const privacyPolicySections: PrivacyPolicySection[] = [
  {
    title: "Who we are (data controller)",
    body: [
      `${SCHOOL.name} (“MBSNM”, “we”, “us”) is the data controller for personal information collected through this website, admissions channels, and student services.`,
      `Registered address: ${SCHOOL.address}. Postal: ${SCHOOL.postal}.`,
      `For privacy enquiries contact ${SCHOOL.email} or ${SCHOOL.admissionsEmail}.`,
    ],
  },
  {
    title: "Legal framework in Uganda",
    body: [
      "We comply with the Data Protection and Privacy Act, 2019 of Uganda and applicable Ministry of Education and Sports requirements for student records.",
      "Where health or medical fitness information is collected for admission or clinical placement, we handle it carefully and only for legitimate educational and safety purposes.",
      "You may lodge a complaint with the Personal Data Protection Office (PDPO) if you believe your rights have been violated, after contacting us first so we can resolve your concern.",
    ],
  },
  {
    title: "Information we collect",
    body: [
      "Identity and contact details (name, phone, email, address, next of kin where relevant).",
      "Admissions and academic records (UCE/UACE results, programme choices, certificates, application references, interview outcomes).",
      "Student and finance records (registration, fee payments, bank references, portal activity).",
      "Communications you send through contact forms, email, WhatsApp, or newsletter subscription.",
      "Technical logs (IP address, browser type, pages visited) used for security and service improvement.",
    ],
  },
  {
    title: "Why we use your data (lawful bases)",
    body: [
      "Consent — for example when you subscribe to updates or tick a privacy consent box on a form.",
      "Contract and pre-contract steps — processing admissions applications and enrolling students.",
      "Legal obligation — retaining records required by education regulators, tax, or accreditation bodies.",
      "Legitimate interests — operating a safe campus, preventing fraud, and improving our services, balanced against your rights.",
    ],
  },
  {
    title: "How we share information",
    body: [
      "We share data only when necessary with: payment and banking partners, IT hosting providers, Ministry of Education and Sports / UNMC / NCHE as required, clinical placement sites, and professional councils where the law requires disclosure.",
      "We do not sell personal information. Staff and contractors with access are bound by confidentiality and least-privilege access controls.",
      "Some service providers may process data outside Uganda; we require appropriate safeguards consistent with Ugandan law.",
    ],
  },
  {
    title: "Retention",
    body: [
      "Applicant files are kept for the period required to complete admissions and audit intakes, then archived according to institutional policy.",
      "Enrolled student records are retained for the duration of study and for periods required by accreditation, alumni, and statutory record-keeping rules.",
      "Marketing contact details are kept until you unsubscribe or ask us to delete them, subject to any legal retention limits.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "Subject to Ugandan law, you may request access to personal data we hold about you, correction of inaccurate data, deletion where there is no lawful reason to keep it, restriction of processing, or objection to certain uses.",
      "You may withdraw consent for optional processing (such as newsletters) at any time without affecting lawful processing that occurred before withdrawal.",
      "To exercise your rights, email the registry with enough detail for us to identify your record. We may need to verify your identity before responding.",
    ],
  },
  {
    title: "Security",
    body: [
      "We use encrypted connections (HTTPS), access controls on admin and finance systems, and hashed storage for portal passwords.",
      "No method of transmission over the internet is completely secure; please protect your portal credentials and report suspected misuse immediately.",
    ],
  },
  {
    title: "Cookies and similar technologies",
    body: [
      "Our site may use essential cookies and local storage for session management, security, and remembering preferences.",
      "We do not use invasive third-party advertising trackers on core school services.",
    ],
  },
  {
    title: "Changes to this policy",
    body: [
      "We may update this policy when our practices or the law change. The “Last updated” date at the top will change, and material updates may be highlighted on the website.",
      "Continued use of our services after an update constitutes notice of the revised policy where permitted by law.",
    ],
  },
];
